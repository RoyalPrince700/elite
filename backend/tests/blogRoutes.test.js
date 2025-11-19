import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import blogRoutes from '../routes/blog.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  createTestUser,
  createTestAdmin,
  createTestBlog,
  generateTestToken
} from './testUtils.js';

// Mock the auth middleware for testing
jest.mock('../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // For testing, we'll set req.user based on authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // In a real scenario, you'd verify the token
        // For testing, we'll assume the token contains user info
        if (token.includes('admin')) {
          req.user = { _id: 'admin-user-id', role: 'admin' };
        } else {
          req.user = { _id: 'regular-user-id', role: 'user' };
        }
      } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    }
    next();
  }),
  optionalAuth: jest.fn((req, res, next) => {
    // Optional auth - just pass through
    next();
  }),
  requireAdmin: jest.fn((req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  })
}));

// Mock Cloudinary upload middleware
jest.mock('../config/cloudinary.js', () => ({
  uploadBlogHeader: {
    single: jest.fn(() => (req, res, next) => {
      // Mock file upload
      if (req.body.mockFile) {
        req.file = {
          path: 'https://cloudinary.com/mock-image.jpg',
          filename: 'mock-image.jpg'
        };
      }
      next();
    })
  }
}));

describe('Blog Routes', () => {
  let app;
  let adminToken;
  let userToken;

  beforeEach(() => {
    // Create Express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/blogs', blogRoutes);

    // Generate test tokens
    adminToken = `Bearer admin-${Date.now()}`;
    userToken = `Bearer user-${Date.now()}`;
  });

  describe('GET /api/blogs', () => {
    it('should return published blogs', async () => {
      const author = await createTestUser();
      await createTestBlog({ author, published: true, title: 'Published Blog' });
      await createTestBlog({ author, published: false, title: 'Draft Blog' });

      const response = await request(app)
        .get('/api/blogs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Published Blog');
      expect(response.body.pagination).toBeDefined();
    });

    it('should support search and pagination', async () => {
      const author = await createTestUser();
      await createTestBlog({ author, title: 'React Tutorial', published: true });
      await createTestBlog({ author, title: 'Vue Guide', published: true });

      const response = await request(app)
        .get('/api/blogs?search=React&page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('React Tutorial');
    });
  });

  describe('GET /api/blogs/admin/all', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/blogs/admin/all')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should return all blogs for admin', async () => {
      const author = await createTestUser();
      await createTestBlog({ author, published: true });
      await createTestBlog({ author, published: false });

      const response = await request(app)
        .get('/api/blogs/admin/all')
        .set('Authorization', adminToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.filters.status).toBeDefined();
    });
  });

  describe('POST /api/blogs', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .send({
          title: 'New Blog',
          content: '<p>Content</p>'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should create a new blog post', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', adminToken)
        .send({
          title: 'New Blog Post',
          subheading: 'Blog subtitle',
          content: '<p>This is blog content</p>',
          tags: ['javascript', 'react'],
          metaDescription: 'Blog meta description',
          published: true
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Blog Post');
      expect(response.body.data.slug).toMatch(/^new-blog-post/);
      expect(response.body.message).toBe('Blog created successfully');
    });
  });

  describe('PUT /api/blogs/:id', () => {
    it('should require admin authentication', async () => {
      const blog = await createTestBlog();

      const response = await request(app)
        .put(`/api/blogs/${blog._id}`)
        .send({ title: 'Updated Title' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should update blog post', async () => {
      const blog = await createTestBlog({ title: 'Original Title' });

      const response = await request(app)
        .put(`/api/blogs/${blog._id}`)
        .set('Authorization', adminToken)
        .send({
          title: 'Updated Title',
          content: '<p>Updated content</p>',
          published: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.message).toBe('Blog updated successfully');
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    it('should require admin authentication', async () => {
      const blog = await createTestBlog();

      const response = await request(app)
        .delete(`/api/blogs/${blog._id}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should delete blog post', async () => {
      const blog = await createTestBlog();

      const response = await request(app)
        .delete(`/api/blogs/${blog._id}`)
        .set('Authorization', adminToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Blog deleted successfully');

      // Verify blog is deleted
      const deletedBlog = await mongoose.connection.db.collection('blogs').findOne({ _id: blog._id });
      expect(deletedBlog).toBeNull();
    });
  });

  describe('PUT /api/blogs/:id/publish', () => {
    it('should require admin authentication', async () => {
      const blog = await createTestBlog({ published: false });

      const response = await request(app)
        .put(`/api/blogs/${blog._id}/publish`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should publish a blog post', async () => {
      const blog = await createTestBlog({ published: false });

      const response = await request(app)
        .put(`/api/blogs/${blog._id}/publish`)
        .set('Authorization', adminToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.published).toBe(true);
      expect(response.body.message).toBe('Blog published successfully');
    });
  });

  describe('GET /api/blogs/:slug', () => {
    it('should return published blog by slug', async () => {
      const blog = await createTestBlog({
        title: 'Test Blog',
        slug: 'test-blog-slug',
        published: true
      });

      const response = await request(app)
        .get('/api/blogs/test-blog-slug')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('test-blog-slug');
      expect(response.body.data.published).toBe(true);
    });

    it('should return 404 for non-existent blog', async () => {
      const response = await request(app)
        .get('/api/blogs/non-existent-slug')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Blog not found');
    });
  });

  describe('Blog Likes', () => {
    describe('POST /api/blogs/:blogId/likes', () => {
      it('should require authentication', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .post(`/api/blogs/${blog._id}/likes`)
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      it('should like a blog post', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .post(`/api/blogs/${blog._id}/likes`)
          .set('Authorization', userToken)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Blog liked successfully');
      });
    });

    describe('DELETE /api/blogs/:blogId/likes', () => {
      it('should require authentication', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .delete(`/api/blogs/${blog._id}/likes`)
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      it('should unlike a blog post', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .delete(`/api/blogs/${blog._id}/likes`)
          .set('Authorization', userToken)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Blog unliked successfully');
      });
    });

    describe('GET /api/blogs/:blogId/likes/status', () => {
      it('should require authentication', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .get(`/api/blogs/${blog._id}/likes/status`)
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      it('should return like status', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .get(`/api/blogs/${blog._id}/likes/status`)
          .set('Authorization', userToken)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('liked');
        expect(response.body.data).toHaveProperty('likesCount');
      });
    });
  });

  describe('Comments', () => {
    describe('GET /api/blogs/:blogId/comments', () => {
      it('should return comments for a blog', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .get(`/api/blogs/${blog._id}/comments`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('POST /api/blogs/:blogId/comments', () => {
      it('should require authentication', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .post(`/api/blogs/${blog._id}/comments`)
          .send({ content: 'Test comment' })
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      it('should create a comment', async () => {
        const blog = await createTestBlog();

        const response = await request(app)
          .post(`/api/blogs/${blog._id}/comments`)
          .set('Authorization', userToken)
          .send({ content: 'This is a test comment' })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content).toBe('This is a test comment');
        expect(response.body.message).toBe('Comment created successfully');
      });
    });
  });
});
