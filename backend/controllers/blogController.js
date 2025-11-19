import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import cacheService, { CACHE_KEYS } from '../services/cacheService.js';

const { ObjectId } = mongoose.Types;

const sanitizeContentForMeta = (value = '') => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const slugifyTitle = (title = '') => {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = slugifyTitle(title);
  if (!baseSlug) {
    baseSlug = `blog-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Blog.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    }).select('_id');

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter++}`;
  }
};

const toObjectIds = (ids = []) => ids
  .map((value) => {
    if (!value) return null;
    if (value instanceof ObjectId) return value;
    try {
      return new ObjectId(value.toString());
    } catch (error) {
      return null;
    }
  })
  .filter(Boolean);

const aggregateBlogLikes = async (blogIds = []) => {
  if (!blogIds.length) return {};

  const objectIds = toObjectIds(blogIds);
  if (!objectIds.length) return {};

  const results = await Like.aggregate([
    {
      $match: {
        targetType: 'Blog',
        targetId: { $in: objectIds }
      }
    },
    {
      $group: {
        _id: '$targetId',
        total: { $sum: 1 }
      }
    }
  ]);

  return results.reduce((acc, item) => {
    acc[item._id.toString()] = item.total;
    return acc;
  }, {});
};

const aggregateBlogComments = async (blogIds = []) => {
  if (!blogIds.length) return {};

  const objectIds = toObjectIds(blogIds);
  if (!objectIds.length) return {};

  const results = await Comment.aggregate([
    {
      $match: {
        blog: { $in: objectIds }
      }
    },
    {
      $group: {
        _id: '$blog',
        total: { $sum: 1 }
      }
    }
  ]);

  return results.reduce((acc, item) => {
    acc[item._id.toString()] = item.total;
    return acc;
  }, {});
};

const formatBlogResponse = (blogDoc, metrics = {}) => {
  if (!blogDoc) return null;

  const { likes = {}, comments = {} } = metrics;
  const blogObject = blogDoc.toObject({ virtuals: true });
  const id = blogDoc._id.toString();

  return {
    ...blogObject,
    id: blogObject._id,
    metrics: {
      likes: likes[id] || 0,
      comments: comments[id] || 0
    }
  };
};

const parsePageParam = (value, fallback = 1) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

const parseLimitParam = (value, fallback = 10) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, 50);
};

const parseTagFilters = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((tag) => tag.trim()).filter(Boolean);
  }
  return value.split(',').map((tag) => tag.trim()).filter(Boolean);
};

const buildSearchQuery = (searchTerm = '') => {
  if (!searchTerm) return null;
  const regex = new RegExp(searchTerm.trim(), 'i');

  return {
    $or: [
      { title: regex },
      { subheading: regex },
      { tags: regex },
      { metaDescription: regex }
    ]
  };
};

const fetchBlogListing = async ({
  query,
  page,
  limit,
  sort = { createdAt: -1 },
  includeTags = true
}) => {
  const skip = (page - 1) * limit;

  const [blogs, total, availableTags] = await Promise.all([
    Blog.find(query)
      .populate('author', 'fullName avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(query),
    includeTags ? Blog.distinct('tags', query) : Promise.resolve([])
  ]);

  const blogIds = blogs.map((blog) => blog._id);
  const [likesMap, commentsMap] = await Promise.all([
    aggregateBlogLikes(blogIds),
    aggregateBlogComments(blogIds)
  ]);

  return {
    blogs: blogs.map((blog) => formatBlogResponse(blog, { likes: likesMap, comments: commentsMap })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    },
    availableTags: includeTags
      ? (availableTags || [])
          .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))
      : []
  };
};

export const getPublishedBlogs = async (req, res) => {
  try {
    const page = parsePageParam(req.query.page, 1);
    const limit = parseLimitParam(req.query.limit, 6);
    const tags = parseTagFilters(req.query.tags || req.query.tag);
    const search = req.query.search;

    const query = { published: true };

    const searchFilter = buildSearchQuery(search);

    if (searchFilter) {
      Object.assign(query, searchFilter);
    }

    if (tags.length) {
      query.tags = { $in: tags };
    }

    // Use cache for first page without search/filters (most common case)
    const cacheKey = CACHE_KEYS.PUBLISHED_BLOGS_PAGE(page, limit, search, tags);
    const useCache = page === 1 && !search && tags.length === 0;

    const result = useCache
      ? await cacheService.getOrSet(cacheKey, () => fetchBlogListing({ query, page, limit }))
      : await fetchBlogListing({ query, page, limit });

    return res.json({
      success: true,
      data: result.blogs,
      pagination: result.pagination,
      filters: { availableTags: result.availableTags }
    });
  } catch (error) {
    console.error('❌ [getPublishedBlogs] Error fetching published blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch published blogs'
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const page = parsePageParam(req.query.page, 1);
    const limit = parseLimitParam(req.query.limit, 15);
    const tags = parseTagFilters(req.query.tags);
    const status = req.query.status;
    const query = {};

    if (status === 'published') {
      query.published = true;
    } else if (status === 'draft') {
      query.published = false;
    }

    const searchFilter = buildSearchQuery(req.query.search);
    if (searchFilter) {
      Object.assign(query, searchFilter);
    }

    if (tags.length) {
      query.tags = { $in: tags };
    }

    if (req.query.author && mongoose.isValidObjectId(req.query.author)) {
      query.author = req.query.author;
    }

    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) {
        query.createdAt.$gte = new Date(req.query.from);
      }
      if (req.query.to) {
        query.createdAt.$lte = new Date(req.query.to);
      }
    }

    const result = await fetchBlogListing({
      query,
      page,
      limit,
      includeTags: true
    });

    const [publishedCount, draftCount] = await Promise.all([
      Blog.countDocuments({ published: true }),
      Blog.countDocuments({ published: false })
    ]);

    return res.json({
      success: true,
      data: {
        blogs: result.blogs,
        pagination: result.pagination,
        filters: {
          availableTags: result.availableTags,
          status: { published: publishedCount, draft: draftCount }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs'
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const allowDraft = req.user?.role === 'admin';

    const query = { slug };
    if (!allowDraft) {
      query.published = true;
    }

    // Use cache for published blogs (not drafts)
    const cacheKey = CACHE_KEYS.BLOG_DETAIL(slug);
    const useCache = !allowDraft;

    const fetchBlogData = async () => {
      const blog = await Blog.findOne(query)
        .populate('author', 'fullName avatar role bio');

      if (!blog) return null;

      const [likesMap, commentsMap] = await Promise.all([
        aggregateBlogLikes([blog._id]),
        aggregateBlogComments([blog._id])
      ]);

      return formatBlogResponse(blog, { likes: likesMap, comments: commentsMap });
    };

    const blogData = useCache
      ? await cacheService.getOrSet(cacheKey, fetchBlogData)
      : await fetchBlogData();

    if (!blogData) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    return res.json({
      success: true,
      data: blogData
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog'
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    let {
      title,
      subheading,
      content,
      tags = [],
      metaDescription,
      published = false
    } = req.body;

    // Parse tags if it's a JSON string
    if (typeof tags === 'string' && tags.startsWith('[') && tags.endsWith(']')) {
      try {
        tags = JSON.parse(tags);
      } catch (error) {
        console.warn('⚠️ [createBlog] Failed to parse tags JSON string:', error.message);
        tags = [];
      }
    }

    // Ensure tags is an array
    if (!Array.isArray(tags)) {
      tags = [];
    }

    // Convert published to boolean if it's a string
    if (typeof published === 'string') {
      published = published === 'true';
    }

    // Check for empty strings and provide defaults
    const titleValue = title && title.trim() !== '' ? title.trim() : null;
    const contentValue = content && content.trim() !== '' ? content.trim() : null;

    // Provide defaults for empty fields
    const finalTitle = titleValue || 'Untitled Blog Post';
    const finalContent = contentValue || '';

    const slug = await generateUniqueSlug(finalTitle);
    const headerImage = req.file?.path || req.body.headerImage;
    const computedMeta = metaDescription || (finalContent ? sanitizeContentForMeta(finalContent).slice(0, 160) : '');

    const blog = await Blog.create({
      title: finalTitle,
      subheading,
      content: finalContent,
      tags,
      metaDescription: computedMeta,
      headerImage,
      author: req.user._id,
      published,
      slug
    });

    await blog.populate('author', 'fullName avatar role');

    // Clear cache for new blog creation
    cacheService.delete(CACHE_KEYS.PUBLISHED_BLOGS_PAGE(1, 6, '', [])); // Clear first page cache
    cacheService.delete(CACHE_KEYS.BLOG_STATS); // Clear stats cache

    return res.status(201).json({
      success: true,
      data: formatBlogResponse(blog),
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('❌ [createBlog] Error creating blog:', error);
    console.error('❌ [createBlog] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors,
      stack: error.stack
    });
    
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this slug already exists'
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(422).json({
        success: false,
        message: 'Blog validation failed',
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create blog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const updates = req.body || {};

    if (updates.title && updates.title !== blog.title) {
      blog.title = updates.title;
      blog.slug = await generateUniqueSlug(updates.title, blog._id);
    }

    if (typeof updates.subheading !== 'undefined') {
      blog.subheading = updates.subheading;
    }

    if (typeof updates.content !== 'undefined') {
      blog.content = updates.content;
      if (!updates.metaDescription && !blog.metaDescription) {
        blog.metaDescription = sanitizeContentForMeta(updates.content).slice(0, 160);
      }
    }

    if (Array.isArray(updates.tags)) {
      blog.tags = updates.tags;
    }

    if (typeof updates.metaDescription !== 'undefined') {
      blog.metaDescription = updates.metaDescription;
    }

    if (typeof updates.published === 'boolean') {
      blog.published = updates.published;
    }

    if (req.body.removeHeaderImage === true || req.body.removeHeaderImage === 'true') {
      blog.headerImage = undefined;
    }

    if (req.file?.path) {
      blog.headerImage = req.file.path;
    } else if (updates.headerImage) {
      blog.headerImage = updates.headerImage;
    }

    const savedBlog = await blog.save();
    await savedBlog.populate('author', 'fullName avatar role');

    // Clear cache for updated blog
    cacheService.delete(CACHE_KEYS.BLOG_DETAIL(savedBlog.slug));
    cacheService.delete(CACHE_KEYS.PUBLISHED_BLOGS_PAGE(1, 6, '', [])); // Clear first page cache
    cacheService.delete(CACHE_KEYS.BLOG_STATS); // Clear stats cache

    const [likesMap, commentsMap] = await Promise.all([
      aggregateBlogLikes([savedBlog._id]),
      aggregateBlogComments([savedBlog._id])
    ]);

    return res.json({
      success: true,
      data: formatBlogResponse(savedBlog, { likes: likesMap, comments: commentsMap }),
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this slug already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update blog'
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const commentIds = await Comment.find({ blog: blog._id }).distinct('_id');

    await Promise.all([
      Blog.deleteOne({ _id: blog._id }),
      Comment.deleteMany({ blog: blog._id }),
      Like.deleteMany({ targetType: 'Blog', targetId: blog._id }),
      commentIds.length
        ? Like.deleteMany({ targetType: 'Comment', targetId: { $in: commentIds } })
        : Promise.resolve()
    ]);

    // Clear cache for deleted blog
    cacheService.delete(CACHE_KEYS.BLOG_DETAIL(blog.slug));
    cacheService.delete(CACHE_KEYS.PUBLISHED_BLOGS_PAGE(1, 6, '', [])); // Clear first page cache
    cacheService.delete(CACHE_KEYS.BLOG_STATS); // Clear stats cache

    return res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
};

const updatePublishState = async (req, res, isPublished) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { published: isPublished },
      { new: true }
    ).populate('author', 'fullName avatar role');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    return res.json({
      success: true,
      data: formatBlogResponse(blog),
      message: isPublished ? 'Blog published successfully' : 'Blog unpublished successfully'
    });
  } catch (error) {
    console.error('Error updating publish status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update publish status'
    });
  }
};

export const publishBlog = (req, res) => updatePublishState(req, res, true);
export const unpublishBlog = (req, res) => updatePublishState(req, res, false);

export const getBlogStats = async (req, res) => {
  try {
    // Use cache for blog stats (admin data, less frequently changing)
    const cacheKey = CACHE_KEYS.BLOG_STATS;
    const stats = await cacheService.getOrSet(
      cacheKey,
      async () => {
        const [
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          totalBlogLikes,
          totalComments,
          topTags,
          monthlyPublications
        ] = await Promise.all([
          Blog.countDocuments(),
          Blog.countDocuments({ published: true }),
          Blog.countDocuments({ published: false }),
          Like.countDocuments({ targetType: 'Blog' }),
          Comment.countDocuments(),
          Blog.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]),
          Blog.aggregate([
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  published: '$published'
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
          ])
        ]);

        return {
          totals: {
            blogs: totalBlogs,
            published: publishedBlogs,
            drafts: draftBlogs,
            likes: totalBlogLikes,
            comments: totalComments
          },
          tags: topTags.map((tag) => ({
            label: tag._id,
            count: tag.count
          })),
          monthlyPublications: monthlyPublications.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            published: item._id.published,
            count: item.count
          }))
        };
      },
      cacheService.statsTTL // 15 minutes TTL for stats
    );

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog statistics'
    });
  }
};

