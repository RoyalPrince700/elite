import {
  getCommentsByBlog,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} from '../controllers/commentController.js';
import {
  createTestUser,
  createTestBlog,
  createTestComment,
  createTestLike,
  createMockRequest,
  createMockResponse
} from './testUtils.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

describe('Comment Controller', () => {
  describe('getCommentsByBlog', () => {
    it('should return comments for a blog with nested replies', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog({ author });

      // Create parent comment
      const parentComment = await createTestComment(blog._id, { author });

      // Create reply
      await createTestComment(blog._id, {
        author,
        parentComment: parentComment._id,
        content: 'This is a reply'
      });

      const req = createMockRequest({
        params: { blogId: blog._id.toString() }
      });
      const res = createMockResponse();

      await getCommentsByBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(2); // Parent + reply
    });

    it('should include like counts for comments', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id, { author: user1 });

      // Create likes for the comment
      await createTestLike('Comment', comment._id, { user: user1 });
      await createTestLike('Comment', comment._id, { user: user2 });

      const req = createMockRequest({
        params: { blogId: blog._id.toString() }
      });
      const res = createMockResponse();

      await getCommentsByBlog(req, res);

      const responseData = res.json.mock.calls[0][0];
      const commentData = responseData.data.find(c => c._id === comment._id.toString());
      expect(commentData.likesCount).toBe(2);
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog();

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        body: {
          content: 'This is a new comment'
        },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await createComment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            content: 'This is a new comment',
            blog: blog._id.toString(),
            author: expect.objectContaining({
              _id: author._id.toString()
            })
          }),
          message: 'Comment created successfully'
        })
      );
    });

    it('should create a reply to an existing comment', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog();
      const parentComment = await createTestComment(blog._id);

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        body: {
          content: 'This is a reply',
          parentCommentId: parentComment._id.toString()
        },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await createComment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            content: 'This is a reply',
            parentComment: parentComment._id.toString()
          })
        })
      );
    });
  });

  describe('updateComment', () => {
    it('should update comment content', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id, { author });

      const req = createMockRequest({
        params: { commentId: comment._id.toString() },
        body: {
          content: 'Updated comment content'
        },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await updateComment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            content: 'Updated comment content'
          }),
          message: 'Comment updated successfully'
        })
      );
    });

    it('should not allow updating other users comments', async () => {
      const author1 = await createTestUser();
      const author2 = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id, { author: author1 });

      const req = createMockRequest({
        params: { commentId: comment._id.toString() },
        body: { content: 'Hacked content' },
        user: { _id: author2._id }
      });
      const res = createMockResponse();

      await updateComment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Not authorized to update this comment'
        })
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete comment and its replies', async () => {
      const author = await createTestUser();
      const blog = await createTestBlog();
      const parentComment = await createTestComment(blog._id, { author });
      const reply = await createTestComment(blog._id, {
        author,
        parentComment: parentComment._id
      });

      const req = createMockRequest({
        params: { commentId: parentComment._id.toString() },
        user: { _id: author._id }
      });
      const res = createMockResponse();

      await deleteComment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Comment deleted successfully'
        })
      );

      // Verify comments are deleted
      expect(await Comment.findById(parentComment._id)).toBeNull();
      expect(await Comment.findById(reply._id)).toBeNull();
    });
  });

  describe('likeComment/unlikeComment', () => {
    it('should like a comment', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id);

      const req = createMockRequest({
        params: { commentId: comment._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await likeComment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Comment liked successfully'
        })
      );

      // Verify like was created
      const like = await Like.findOne({
        user: user._id,
        targetType: 'Comment',
        targetId: comment._id
      });
      expect(like).toBeTruthy();
    });

    it('should unlike a comment', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id);
      await createTestLike('Comment', comment._id, { user });

      const req = createMockRequest({
        params: { commentId: comment._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await unlikeComment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Comment unliked successfully'
        })
      );

      // Verify like was removed
      const like = await Like.findOne({
        user: user._id,
        targetType: 'Comment',
        targetId: comment._id
      });
      expect(like).toBeNull();
    });

    it('should prevent duplicate likes', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id);
      await createTestLike('Comment', comment._id, { user });

      const req = createMockRequest({
        params: { commentId: comment._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await likeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Comment already liked'
        })
      );
    });
  });
});
