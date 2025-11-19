import { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const countComments = (items = []) => {
  return items.reduce((total, comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];
    return total + 1 + countComments(replies);
  }, 0);
};

const appendComment = (list, newComment, parentId = null) => {
  if (!parentId) {
    return [newComment, ...list];
  }

  return list.map((comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];
    if (comment._id === parentId) {
      return {
        ...comment,
        replies: [newComment, ...replies]
      };
    }

    return {
      ...comment,
      replies: appendComment(replies, newComment, parentId)
    };
  });
};

const updateComment = (list, commentId, updater) => {
  return list.map((comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];
    if (comment._id === commentId) {
      return {
        ...comment,
        ...updater(comment)
      };
    }

    return {
      ...comment,
      replies: updateComment(replies, commentId, updater)
    };
  });
};

const removeComment = (list, commentId) => {
  return list
    .filter((comment) => comment._id !== commentId)
    .map((comment) => ({
      ...comment,
      replies: removeComment(comment.replies || [], commentId)
    }));
};

const CommentSection = ({ blogId, initialCount = 0, onCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCount);

  const syncCount = useCallback((items) => {
    const total = countComments(items);
    setCommentCount(total);
    onCountChange?.(total);
  }, [onCountChange]);

  useEffect(() => {
    setCommentCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!blogId) return;
      setLoading(true);
      setError('');
      try {
        const response = await apiService.request(`/blogs/${blogId}/comments`);
        const data = response?.data || [];
        setComments(data);
        syncCount(data);
      } catch (err) {
        setError(err.message || 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId, syncCount]);

  const handleCreateComment = async (content, parentComment = null) => {
    if (!blogId) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        content,
        ...(parentComment ? { parentComment } : {})
      };
      const response = await apiService.request(`/blogs/${blogId}/comments`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const newComment = response?.data;
      setComments((prev) => {
        const updated = appendComment(prev, newComment, parentComment);
        syncCount(updated);
        return updated;
      });
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeToggle = async (commentId, liked) => {
    if (!user) {
      setError('Sign in to like comments.');
      return;
    }
    try {
      const response = await apiService.request(`/blogs/comments/${commentId}/likes`, {
        method: liked ? 'DELETE' : 'POST'
      });
      const payload = response?.data;
      setComments((prev) =>
        updateComment(prev, commentId, () => ({
          likesCount: payload?.likesCount,
          viewerHasLiked: payload?.viewerHasLiked
        }))
      );
    } catch (err) {
      console.error('Unable to toggle comment like:', err);
    }
  };

  const handleDeleteComment = async (comment) => {
    if (!comment?._id) return;
    const shouldDelete = window.confirm('Delete this comment? Replies will also be removed.');
    if (!shouldDelete) return;

    try {
      await apiService.request(`/blogs/comments/${comment._id}`, {
        method: 'DELETE'
      });
      setComments((prev) => {
        const updated = removeComment(prev, comment._id);
        syncCount(updated);
        return updated;
      });
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  const heading = useMemo(() => {
    if (commentCount === 0) return 'Be the first to share a thought.';
    if (commentCount === 1) return '1 comment';
    return `${commentCount} comments`;
  }, [commentCount]);

  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          <MessageCircle className="h-4 w-4 text-slate-300" />
          Discussion
        </div>
        <h3 className="text-2xl font-semibold text-slate-900">{heading}</h3>
      </div>

      <div className="mt-6">
        {user ? (
          <CommentForm
            onSubmit={(value) => handleCreateComment(value)}
            loading={submitting && !replyingTo}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
            <p>
              <a href="/auth" className="font-semibold text-slate-900 underline">
                Sign in
              </a>{' '}
              to join the conversation.
            </p>
          </div>
        )}
      </div>

      {replyingTo && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Replying to {replyingTo.author?.fullName}
          </p>
          <CommentForm
            isReply
            onSubmit={(value) => handleCreateComment(value, replyingTo._id)}
            onCancel={() => setReplyingTo(null)}
            loading={submitting}
            placeholder={`Reply to ${replyingTo.author?.fullName}`}
            submitLabel="Reply"
          />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Loading comments...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No comments yet. Start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={(target) => {
                if (!user) {
                  setError('Sign in to reply to comments.');
                  return;
                }
                setReplyingTo(target);
              }}
              onLikeToggle={handleLikeToggle}
              onDelete={handleDeleteComment}
              currentUserId={user?._id}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;

