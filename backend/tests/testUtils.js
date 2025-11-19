import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

// Generate JWT token for testing
export const generateTestToken = (userId = '507f1f77bcf86cd799439011', role = 'user') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );
};

// Create test user
export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    fullName: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'hashedpassword123',
    role: 'user',
    isVerified: true
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new User(userData);
  await user.save();
  return user;
};

// Create test admin
export const createTestAdmin = async (overrides = {}) => {
  return createTestUser({ role: 'admin', ...overrides });
};

// Create test blog
export const createTestBlog = async (overrides = {}) => {
  const author = overrides.author || await createTestUser();

  const defaultBlog = {
    title: 'Test Blog Post',
    subheading: 'Test blog subheading',
    content: '<p>This is test blog content</p>',
    tags: ['test', 'blog'],
    metaDescription: 'Test blog meta description',
    author: author._id,
    published: true,
    slug: `test-blog-${Date.now()}`
  };

  const blogData = { ...defaultBlog, ...overrides };
  const blog = new Blog(blogData);
  await blog.save();
  await blog.populate('author', 'fullName avatar role');
  return blog;
};

// Create test comment
export const createTestComment = async (blogId, overrides = {}) => {
  const author = overrides.author || await createTestUser();

  const defaultComment = {
    content: 'This is a test comment',
    author: author._id,
    blog: blogId
  };

  const commentData = { ...defaultComment, ...overrides };
  const comment = new Comment(commentData);
  await comment.save();
  await comment.populate('author', 'fullName avatar');
  return comment;
};

// Create test like
export const createTestLike = async (targetType, targetId, overrides = {}) => {
  const user = overrides.user || await createTestUser();

  const defaultLike = {
    user: user._id,
    targetType,
    targetId
  };

  const likeData = { ...defaultLike, ...overrides };
  const like = new Like(likeData);
  await like.save();
  return like;
};

// Mock request object
export const createMockRequest = (overrides = {}) => {
  const defaultReq = {
    body: {},
    params: {},
    query: {},
    user: null,
    file: null,
    ...overrides
  };
  return defaultReq;
};

// Mock response object
export const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  return res;
};

// Mock next function
export const createMockNext = () => jest.fn();
