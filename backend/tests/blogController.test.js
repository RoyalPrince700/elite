import {
  getPublishedBlogs,
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getBlogStats
} from '../controllers/blogController.js';
import {
  createTestUser,
  createTestAdmin,
  createTestBlog,
  createMockRequest,
  createMockResponse,
  generateTestToken
} from './testUtils.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

describe('Blog Controller', () => {
  describe('getPublishedBlogs', () => {
    it('should return published blogs with pagination', async () => {
      // Create test data
      const author = await createTestUser();
      await createTestBlog({ author, published: true });
      await createTestBlog({ author, published: true });
      await createTestBlog({ author, published: false }); // Draft

      const req = createMockRequest({
        query: { page: '1', limit: '10' }
      });
      const res = createMockResponse();

      await getPublishedBlogs(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
          pagination: expect.objectContaining({
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1
          })
        })
      );

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(2);
      expect(responseData.data[0]).toHaveProperty('id');
      expect(responseData.data[0]).toHaveProperty('metrics');
    });

    it('should filter blogs by search term', async () => {
      const author = await createTestUser();
      await createTestBlog({ author, title: 'React Tutorial', published: true });
      await createTestBlog({ author, title: 'Vue Guide', published: true });

      const req = createMockRequest({
        query: { search: 'React' }
      });
      const res = createMockResponse();

      await getPublishedBlogs(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0].title).toBe('React Tutorial');
    });

    it('should filter blogs by tags', async () => {
      const author = await createTestUser();
      await createTestBlog({ author, tags: ['react', 'javascript'], published: true });
      await createTestBlog({ author, tags: ['vue', 'javascript'], published: true });

      const req = createMockRequest({
        query: { tags: 'react' }
      });
      const res = createMockResponse();

      await getPublishedBlogs(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0].tags).toContain('react');
    });
  });

  describe('getAllBlogs', () => {
    it('should return all blogs for admin with status filter', async () => {
      const admin = await createTestAdmin();
      await createTestBlog({ published: true });
      await createTestBlog({ published: false });

      const req = createMockRequest({
        query: { status: 'published' },
        user: { _id: admin._id, role: 'admin' }
      });
      const res = createMockResponse();

      await getAllBlogs(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
      expect(responseData.filters.status.published).toBe(1);
      expect(responseData.filters.status.draft).toBe(1);
    });

    it('should filter by author', async () => {
      const author1 = await createTestUser();
      const author2 = await createTestUser();
      await createTestBlog({ author: author1 });
      await createTestBlog({ author: author2 });

      const req = createMockRequest({
        query: { author: author1._id.toString() },
        user: { _id: author1._id, role: 'admin' }
      });
      const res = createMockResponse();

      await getAllBlogs(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
    });
  });

  describe('getBlogBySlug', () => {
    it('should return published blog by slug', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog({ author, slug: 'test-blog-slug', published: true });

      const req = createMockRequest({
        params: { slug: 'test-blog-slug' }
      });
      const res = createMockResponse();

      await getBlogBySlug(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: blog._id.toString(),
            slug: 'test-blog-slug'
          })
        })
      );
    });

    it('should allow admin to view draft blogs', async () => {
      const admin = await createTestAdmin();
      const blog = await createTestBlog({ slug: 'draft-blog', published: false });

      const req = createMockRequest({
        params: { slug: 'draft-blog' },
        user: { _id: admin._id, role: 'admin' }
      });
      const res = createMockResponse();

      await getBlogBySlug(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            slug: 'draft-blog',
            published: false
          })
        })
      );
    });

    it('should return 404 for non-existent blog', async () => {
      const req = createMockRequest({
        params: { slug: 'non-existent' }
      });
      const res = createMockResponse();

      await getBlogBySlug(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Blog not found'
        })
      );
    });
  });

  describe('createBlog', () => {
    it('should create a new blog post', async () => {
      const author = await createTestUser();

      const req = createMockRequest({
        body: {
          title: 'New Blog Post',
          content: '<p>Blog content</p>',
          tags: ['tag1', 'tag2']
        },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await createBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            title: 'New Blog Post',
            content: '<p>Blog content</p>',
            tags: ['tag1', 'tag2']
          }),
          message: 'Blog created successfully'
        })
      );
    });

    it('should generate unique slug', async () => {
      const author = await createTestUser();
      await createTestBlog({ title: 'Test Blog', slug: 'test-blog' });

      const req = createMockRequest({
        body: {
          title: 'Test Blog',
          content: '<p>Content</p>'
        },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await createBlog(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data.slug).not.toBe('test-blog');
      expect(responseData.data.slug).toMatch(/^test-blog-\d+$/);
    });
  });

  describe('updateBlog', () => {
    it('should update blog content', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog({ author });

      const req = createMockRequest({
        params: { id: blog._id.toString() },
        body: {
          title: 'Updated Title',
          content: '<p>Updated content</p>'
        },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await updateBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            title: 'Updated Title',
            content: '<p>Updated content</p>'
          }),
          message: 'Blog updated successfully'
        })
      );
    });

    it('should return 404 for non-existent blog', async () => {
      const author = await createTestUser();

      const req = createMockRequest({
        params: { id: '507f1f77bcf86cd799439011' },
        body: { title: 'Updated Title' },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await updateBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Blog not found'
        })
      );
    });
  });

  describe('deleteBlog', () => {
    it('should delete blog and associated data', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog({ author });
      const comment = await createTestComment(blog._id);
      await createTestLike('Blog', blog._id);
      await createTestLike('Comment', comment._id);

      const req = createMockRequest({
        params: { id: blog._id.toString() },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await deleteBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Blog deleted successfully'
        })
      );

      // Verify blog and associated data are deleted
      expect(await Blog.findById(blog._id)).toBeNull();
      expect(await Comment.find({ blog: blog._id })).toHaveLength(0);
      expect(await Like.find({ targetId: blog._id })).toHaveLength(0);
    });
  });

  describe('publishBlog/unpublishBlog', () => {
    it('should publish a draft blog', async () => {
      const admin = await createTestAdmin();
      const blog = await createTestBlog({ published: false });

      const req = createMockRequest({
        params: { id: blog._id.toString() },
        user: { _id: admin._id, role: 'admin' }
      });
      const res = createMockResponse();

      await publishBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            published: true
          }),
          message: 'Blog published successfully'
        })
      );
    });

    it('should unpublish a published blog', async () => {
      const admin = await createTestAdmin();
      const blog = await createTestBlog({ published: true });

      const req = createMockRequest({
        params: { id: blog._id.toString() },
        user: { _id: admin._id, role: 'admin' }
      });
      const res = createMockResponse();

      await unpublishBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            published: false
          }),
          message: 'Blog unpublished successfully'
        })
      );
    });
  });

  describe('getBlogStats', () => {
    it('should return comprehensive blog statistics', async () => {
      const author = await createTestUser();
      await createTestBlog({ author, published: true, tags: ['react'] });
      await createTestBlog({ author, published: true, tags: ['vue'] });
      await createTestBlog({ author, published: false });

      const blog = await createTestBlog({ author, published: true });
      await createTestComment(blog._id);
      await createTestLike('Blog', blog._id);

      const req = createMockRequest({
        user: { role: 'admin' }
      });
      const res = createMockResponse();

      await getBlogStats(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.data.totals.blogs).toBe(4);
      expect(responseData.data.totals.published).toBe(3);
      expect(responseData.data.totals.drafts).toBe(1);
      expect(responseData.data.totals.likes).toBe(1);
      expect(responseData.data.totals.comments).toBe(1);
      expect(responseData.data.tags).toHaveLength(2);
    });
  });
});
