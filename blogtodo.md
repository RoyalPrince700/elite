# Blog Feature Implementation Plan

## Project Overview
**Tech Stack:**
- Backend: Node.js/Express, MongoDB (Mongoose), JWT Auth, Cloudinary
- Frontend: React/Vite, Tailwind CSS, React Router, React Hook Form
- Existing: Admin panel with role-based access, image upload system

## Phase 1: Backend Database Models & Setup

### Phase 1: Create Blog Model
**Backend Implementation:**
- Create `backend/models/Blog.js`
- Fields: title, subheading, content, headerImage, author, published, slug, tags, metaDescription
- Add timestamps and indexes
- Virtual for reading time calculation

**Prompt:** "Create a Mongoose schema for Blog model with title (required), subheading (optional), content (rich text), headerImage (Cloudinary URL), author (User reference), published (boolean), slug (unique), tags (array), metaDescription, timestamps. Add virtual for reading time calculation."

### Phase 1: Create Comment Model
**Backend Implementation:**
- Create `backend/models/Comment.js`
- Fields: content, author, blog, parentComment (for nested replies), likes
- Add timestamps and population references

**Prompt:** "Create a Mongoose schema for Comment model with content, author (User reference), blog (Blog reference), parentComment (self-reference for replies), likes (array of User IDs), timestamps."

### Phase 1: Create Like Model (Optional - or embed in Blog/Comment)
**Backend Implementation:**
- Create `backend/models/Like.js`
- Fields: user, targetType ('Blog' or 'Comment'), targetId
- Unique compound index on user+targetType+targetId

**Prompt:** "Create a Like model for blog posts and comments with user reference, targetType ('Blog' or 'Comment'), targetId, and unique compound index."

## Phase 2: Backend API Routes & Controllers

### Phase 2: Blog Controller
**Backend Implementation:**
- Create `backend/controllers/blogController.js`
- Methods: getAllBlogs, getPublishedBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog, getBlogStats

**Prompt:** "Create blog controller with CRUD operations, publish/unpublish functionality, and stats. Include proper error handling, validation, and authorization checks for admin-only operations."

### Phase 2: Comment Controller
**Backend Implementation:**
- Create `backend/controllers/commentController.js`
- Methods: getCommentsByBlog, createComment, updateComment, deleteComment, likeComment, unlikeComment

**Prompt:** "Create comment controller with CRUD operations and like/unlike functionality. Include nested replies support and proper authorization (users can only edit/delete their own comments)."

### Phase 2: Like Controller
**Backend Implementation:**
- Create `backend/controllers/likeController.js`
- Methods: likeBlog, unlikeBlog, likeComment, unlikeComment, getLikeStatus

**Prompt:** "Create like controller for blogs and comments with toggle functionality and status checking. Prevent duplicate likes and handle authorization."

### Phase 2: Blog Routes
**Backend Implementation:**
- Create `backend/routes/blog.js`
- Public routes: GET /blogs (published), GET /blogs/:slug
- Protected routes: POST /blogs, PUT /blogs/:id, DELETE /blogs/:id
- Admin routes: PUT /blogs/:id/publish, GET /blogs/admin/all

**Prompt:** "Create blog routes with proper middleware for authentication and admin authorization. Include comment and like routes nested under blog routes."

## Phase 3: Backend Integration & Validation

### Phase 3: Update Admin Routes
**Backend Implementation:**
- Add blog management routes to `backend/routes/admin.js`
- Methods: getAllBlogs, updateBlogStatus, getBlogAnalytics

**Prompt:** "Add blog management routes to existing admin router for dashboard integration."

### Phase 3: Input Validation
**Backend Implementation:**
- Add validation middleware for blog creation/editing
- Validate title length, content presence, image URLs
- Sanitize rich text content

**Prompt:** "Add express-validator middleware for blog input validation including title requirements, content sanitization, and image URL validation."

### Phase 3: File Upload Setup
**Backend Implementation:**
- Configure multer for blog header images
- Integrate with existing Cloudinary setup
- Add image optimization and validation

**Prompt:** "Configure multer and Cloudinary for blog header image uploads with proper validation, resizing, and optimization."

## Phase 4: Frontend Blog Components

### Phase 4: Blog List Component
**Frontend Implementation:**
- Create `elite/src/components/blog/BlogList.jsx`
- Display published blogs with header images, titles, excerpts
- Pagination and search functionality

**Prompt:** "Create BlogList component that fetches and displays published blogs with header images, titles, subheadings, reading time, and publish dates. Include pagination and loading states."

### Phase 4: Blog Detail Component
**Frontend Implementation:**
- Create `elite/src/components/blog/BlogDetail.jsx`
- Rich text rendering, header image display, like button, comments section
- Social sharing buttons

**Prompt:** "Create BlogDetail component that renders rich text content, displays header image prominently, includes like functionality, and shows comments section with nested replies."

### Phase 4: Comment System Components
**Frontend Implementation:**
- Create `elite/src/components/blog/CommentSection.jsx`
- Create `elite/src/components/blog/CommentItem.jsx`
- Create `elite/src/components/blog/CommentForm.jsx`
- Handle nested comments and likes

**Prompt:** "Create comment components with form for new comments, display of existing comments with nested replies, and like functionality. Include proper loading states and error handling."

### Phase 4: Rich Text Editor Component
**Frontend Implementation:**
- Choose and integrate rich text editor (React Quill or similar)
- Create `elite/src/components/blog/RichTextEditor.jsx`
- Support images, links, formatting, lists

**Prompt:** "Integrate a rich text editor (React Quill) for blog content creation with image upload capability, link insertion, and common formatting tools."

## Phase 5: Admin Blog Management

### Phase 5: Blog Admin Tab
**Frontend Implementation:**
- Create `elite/src/components/admin/BlogTab.jsx`
- List all blogs with status, edit/delete buttons
- Search and filter functionality

**Prompt:** "Create BlogTab component for admin dashboard showing all blogs with publish status, edit/delete actions, and filtering options matching existing admin tab patterns."

### Phase 5: Blog Form Modal
**Frontend Implementation:**
- Create `elite/src/components/admin/BlogFormModal.jsx`
- Title, subheading, header image upload, rich text editor
- Edit mode vs create mode

**Prompt:** "Create BlogFormModal component with form validation, image upload integration, rich text editor, and toggle for publish status. Handle both create and edit modes."

### Phase 5: Blog Stats Integration
**Frontend Implementation:**
- Add blog statistics to `StatsCards.jsx`
- Total blogs, published blogs, total likes, total comments

**Prompt:** "Update StatsCards component to include blog-related statistics fetched from admin API."

## Phase 6: Navigation & Routing

### Phase 6: Add Blog Routes
**Frontend Implementation:**
- Update `elite/src/App.jsx` with blog routes
- `/blog` - blog list, `/blog/:slug` - blog detail
- Protected admin routes for blog management

**Prompt:** "Add blog routes to App.jsx including public blog list and detail pages, and protected admin blog management routes."

### Phase 6: Update Navigation
**Frontend Implementation:**
- Add "Blog" link to main navigation (`NavBar.jsx`)
- Add blog section to admin navigation (`TabsNavigation.jsx`)

**Prompt:** "Add 'Blog' link to main website navigation and integrate blog management tab into admin dashboard navigation."

### Phase 6: Update Admin Dashboard
**Frontend Implementation:**
- Import and add BlogTab to `AdminDashboard.jsx`
- Add blog stats to dashboard overview

**Prompt:** "Integrate BlogTab component into AdminDashboard and include blog statistics in the main stats overview."

## Phase 7: API Integration & Services

### Phase 7: Blog Service
**Frontend Implementation:**
- Create `elite/src/services/blogService.js`
- Methods for all blog CRUD operations, like/comment functionality

**Prompt:** "Create blogService.js with methods for fetching blogs, creating/updating/deleting blogs, liking blogs, and managing comments. Include proper error handling and token management."

### Phase 7: Update API Service
**Frontend Implementation:**
- Add blog endpoints to existing `apiService.js`
- Ensure consistent error handling and response formatting

**Prompt:** "Extend existing apiService.js to include blog-related API calls following the same patterns as other services."

## Phase 8: Styling & UI Polish

### Phase 8: Blog Page Styling
**Frontend Implementation:**
- Style blog list and detail pages with Tailwind CSS
- Ensure responsive design and consistent with site theme
- Add loading skeletons and animations

**Prompt:** "Style blog components with Tailwind CSS ensuring responsive design, consistent branding, and smooth loading states. Match existing component styling patterns."

### Phase 8: Admin Blog Styling
**Frontend Implementation:**
- Style admin blog components to match existing admin UI
- Consistent table layouts, modals, and forms

**Prompt:** "Style admin blog components to match existing admin dashboard design patterns including tables, modals, and form layouts."

## Phase 9: Testing & Optimization

### Phase 9: Backend Testing
**Backend Implementation:**
- Add Jest tests for blog controllers and routes
- Test authentication, validation, and error handling

**Prompt:** "Create comprehensive tests for blog API endpoints including CRUD operations, authentication, and input validation."

### Phase 9: Frontend Testing
**Frontend Implementation:**
- Add unit tests for blog components
- Test user interactions and API integration

**Prompt:** "Add React Testing Library tests for blog components focusing on user interactions, form submissions, and API error handling."

### Phase 9: Performance Optimization
**Backend & Frontend Implementation:**
- Add database indexes for blog queries
- Implement caching for popular blogs
- Optimize images and lazy loading

**Prompt:** "Optimize blog performance with database indexes, image optimization, lazy loading, and caching strategies for frequently accessed content."

## Phase 10: Deployment & Final Integration

### Phase 10: Database Seeding
**Backend Implementation:**
- Create sample blog posts for testing
- Add to existing seeder script

**Prompt:** "Update seeder.js to include sample blog posts with realistic content for testing and demonstration purposes."

### Phase 10: Final Testing
**Full Stack Implementation:**
- End-to-end testing of complete blog workflow
- Admin creation, publishing, user viewing, commenting, liking

**Prompt:** "Conduct comprehensive end-to-end testing of blog feature including admin management, user interactions, and edge cases."

### Phase 10: Documentation
**Implementation:**
- Update README with blog feature documentation
- API documentation for blog endpoints

**Prompt:** "Update project documentation to include blog feature overview, API documentation, and usage instructions."
