# Blog API Documentation

This document provides comprehensive documentation for the EliteRetoucher Blog API endpoints.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Public Blog Endpoints](#public-blog-endpoints)
4. [Comment System](#comment-system)
5. [Like System](#like-system)
6. [Admin Blog Management](#admin-blog-management)
7. [Data Models](#data-models)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)

## Overview

The Blog API provides a complete blogging platform with:
- Rich text blog posts with image support
- Comment system with nested replies
- Like system for engagement
- SEO optimization
- Admin content management
- Performance optimization with caching

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Admin-only endpoints require users with `role: 'admin'`.

## Public Blog Endpoints

### Get Published Blogs

Retrieve a paginated list of published blog posts.

```http
GET /api/blogs
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 6 | Number of blogs per page (max 50) |
| `search` | string | - | Search term for title, content, or tags |
| `tags` | string | - | Comma-separated list of tags to filter by |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "blog-id",
      "title": "Blog Title",
      "subheading": "Blog subheading",
      "slug": "blog-title",
      "content": "<p>Blog content...</p>",
      "headerImage": "https://cloudinary.com/image.jpg",
      "author": {
        "fullName": "Author Name",
        "avatar": "https://example.com/avatar.jpg"
      },
      "tags": ["tag1", "tag2"],
      "createdAt": "2024-01-15T10:00:00Z",
      "metrics": {
        "likes": 10,
        "comments": 5
      },
      "readingTime": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 25,
    "totalPages": 5
  },
  "filters": {
    "availableTags": ["react", "javascript", "photography"]
  }
}
```

### Get Blog by Slug

Retrieve a single blog post by its URL slug.

```http
GET /api/blogs/:slug
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "blog-id",
    "title": "Blog Title",
    "content": "<p>Full blog content...</p>",
    "headerImage": "https://cloudinary.com/image.jpg",
    "author": {
      "fullName": "Author Name",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Author biography"
    },
    "tags": ["tag1", "tag2"],
    "metaDescription": "SEO description",
    "createdAt": "2024-01-15T10:00:00Z",
    "metrics": {
      "likes": 15,
      "comments": 8
    },
    "readingTime": 5
  }
}
```

## Comment System

### Get Comments for Blog

Retrieve all comments for a specific blog post.

```http
GET /api/blogs/:blogId/comments
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "comment-id",
      "content": "This is a comment",
      "author": {
        "fullName": "Commenter Name",
        "avatar": "https://example.com/avatar.jpg"
      },
      "createdAt": "2024-01-15T12:00:00Z",
      "likesCount": 3,
      "replies": [
        {
          "id": "reply-id",
          "content": "This is a reply",
          "author": {
            "fullName": "Replier Name",
            "avatar": "https://example.com/avatar.jpg"
          },
          "createdAt": "2024-01-15T12:30:00Z",
          "parentComment": "comment-id"
        }
      ]
    }
  ]
}
```

### Create Comment

Add a new comment to a blog post.

```http
POST /api/blogs/:blogId/comments
```

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "content": "This is my comment",
  "parentCommentId": "optional-parent-comment-id"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "new-comment-id",
    "content": "This is my comment",
    "author": {
      "fullName": "Your Name",
      "avatar": "https://example.com/avatar.jpg"
    },
    "blog": "blog-id",
    "createdAt": "2024-01-15T12:00:00Z"
  },
  "message": "Comment created successfully"
}
```

### Update Comment

Update an existing comment (author only).

```http
PUT /api/blogs/comments/:commentId
```

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "content": "Updated comment content"
}
```

### Delete Comment

Delete a comment and its replies (author only).

```http
DELETE /api/blogs/comments/:commentId
```

#### Headers
```
Authorization: Bearer <token>
```

## Like System

### Like Blog Post

Like or unlike a blog post.

```http
POST /api/blogs/:blogId/likes
```

#### Headers
```
Authorization: Bearer <token>
```

#### Response

```json
{
  "success": true,
  "message": "Blog liked successfully"
}
```

### Unlike Blog Post

Remove like from a blog post.

```http
DELETE /api/blogs/:blogId/likes
```

#### Headers
```
Authorization: Bearer <token>
```

### Check Like Status

Check if user has liked a blog post or comment.

```http
GET /api/blogs/:blogId/likes/status
GET /api/blogs/comments/:commentId/likes/status
```

#### Headers
```
Authorization: Bearer <token>
```

#### Response

```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 15
  }
}
```

## Admin Blog Management

### Get All Blogs (Admin)

Retrieve all blog posts including drafts (admin only).

```http
GET /api/blogs/admin/all
```

#### Headers
```
Authorization: Bearer <admin-token>
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | Filter by status: 'published', 'draft', or 'all' |
| `author` | string | Filter by author ID |
| `search` | string | Search term |
| `tags` | string | Comma-separated tags |
| `from` | string | Start date (ISO format) |
| `to` | string | End date (ISO format) |

### Get Blog Statistics (Admin)

Get comprehensive blog analytics.

```http
GET /api/blogs/admin/stats
```

#### Headers
```
Authorization: Bearer <admin-token>
```

#### Response

```json
{
  "success": true,
  "data": {
    "totals": {
      "blogs": 25,
      "published": 20,
      "drafts": 5,
      "likes": 150,
      "comments": 75
    },
    "tags": [
      { "label": "photography", "count": 10 },
      { "label": "retouching", "count": 8 }
    ],
    "monthlyPublications": [
      {
        "year": 2024,
        "month": 1,
        "published": true,
        "count": 5
      }
    ]
  }
}
```

### Create Blog Post

Create a new blog post (admin only).

```http
POST /api/blogs
```

#### Headers
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

#### Form Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Blog title (max 150 chars) |
| `subheading` | string | No | Blog subheading (max 200 chars) |
| `content` | string | Yes | Rich text content |
| `tags` | string | No | Comma-separated tags (max 10) |
| `metaDescription` | string | No | SEO description (max 180 chars) |
| `published` | boolean | No | Publish immediately (default: false) |
| `headerImage` | file | No | Header image file |

### Update Blog Post

Update an existing blog post (admin only).

```http
PUT /api/blogs/:id
```

#### Headers
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

#### Form Data
Same as create, plus:

| Field | Type | Description |
|-------|------|-------------|
| `removeHeaderImage` | boolean | Remove current header image |

### Delete Blog Post

Delete a blog post and all associated comments/likes (admin only).

```http
DELETE /api/blogs/:id
```

#### Headers
```
Authorization: Bearer <admin-token>
```

### Publish/Unpublish Blog

Change publication status of a blog post (admin only).

```http
PUT /api/blogs/:id/publish
PUT /api/blogs/:id/unpublish
```

#### Headers
```
Authorization: Bearer <admin-token>
```

## Data Models

### Blog

```javascript
{
  _id: ObjectId,
  title: String, // Required, max 150 chars
  subheading: String, // Optional, max 200 chars
  content: String, // Required, rich text HTML
  headerImage: String, // Cloudinary URL
  author: ObjectId, // Reference to User
  published: Boolean, // Default: false
  slug: String, // Required, unique, URL-friendly
  tags: [String], // Array of tags
  metaDescription: String, // SEO description, max 180 chars
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```javascript
{
  _id: ObjectId,
  content: String, // Required
  author: ObjectId, // Reference to User
  blog: ObjectId, // Reference to Blog
  parentComment: ObjectId, // Self-reference for replies
  likes: [ObjectId], // Array of User IDs who liked
  createdAt: Date,
  updatedAt: Date
}
```

### Like

```javascript
{
  _id: ObjectId,
  user: ObjectId, // Reference to User
  targetType: String, // 'Blog' or 'Comment'
  targetId: ObjectId, // Reference to Blog or Comment
  createdAt: Date
}
```

## Error Handling

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `422` - Unprocessable Entity (validation failed)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 1000 requests per 15 minutes per IP
- **Blog creation**: 10 requests per hour per user
- **Comment creation**: 30 requests per hour per user
- **Like operations**: 60 requests per hour per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Performance Features

### Database Indexes

The system includes optimized database indexes for:
- Blog queries (published, createdAt, tags, author)
- Comment queries (blog, createdAt, parent-child relationships)
- Like queries (user + target compound indexes)
- Text search indexes for blog content

### Caching

Popular content is cached for improved performance:
- Published blog lists (5 minutes)
- Individual blog posts (10 minutes)
- Blog statistics (15 minutes)
- Cache invalidation on content updates

### Image Optimization

Images are automatically optimized:
- Responsive image sizes (480w, 768w, 1024w, 1280w, 1920w)
- WebP format support with fallbacks
- Lazy loading implementation
- Cloudinary transformations for optimal delivery
