class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    this.popularBlogsTTL = 10 * 60 * 1000; // 10 minutes for popular blogs
    this.statsTTL = 15 * 60 * 1000; // 15 minutes for stats
  }

  /**
   * Set a value in cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get or set cache with a fetcher function
   * @param {string} key - Cache key
   * @param {Function} fetcher - Function to fetch data if not cached
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<any>} - Cached or fetched value
   */
  async getOrSet(key, fetcher, ttl = this.defaultTTL) {
    let value = this.get(key);
    if (value !== null) {
      return value;
    }

    value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Cache keys
export const CACHE_KEYS = {
  POPULAR_BLOGS: 'popular_blogs',
  BLOG_STATS: 'blog_stats',
  PUBLISHED_BLOGS_PAGE: (page, limit, search, tags) =>
    `published_blogs:${page}:${limit}:${search || ''}:${tags ? tags.join(',') : ''}`,
  BLOG_DETAIL: (slug) => `blog_detail:${slug}`,
  BLOG_COMMENTS: (blogId) => `blog_comments:${blogId}`,
  BLOG_LIKES: (blogId) => `blog_likes:${blogId}`
};

// Auto cleanup expired entries every 10 minutes
setInterval(() => {
  cacheService.cleanup();
}, 10 * 60 * 1000);

export default cacheService;
