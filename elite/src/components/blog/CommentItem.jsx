import { useMemo, useState } from 'react';
import { ChevronDown, Heart, MessageCircle, Trash2 } from 'lucide-react';

const CommentItem = ({
  comment,
  depth = 0,
  onReply,
  onLikeToggle,
  onDelete,
  currentUserId
}) => {
  const [showReplies, setShowReplies] = useState(true);

  const isOwner = useMemo(() => {
    if (!currentUserId || !comment?.author?._id) return false;
    return comment.author._id.toString() === currentUserId.toString();
  }, [currentUserId, comment?.author?._id]);

  const timestamp = useMemo(() => {
    if (!comment?.createdAt) return '';
    return new Date(comment.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [comment?.createdAt]);

  const handleLike = () => {
    if (onLikeToggle) {
      onLikeToggle(comment._id, comment.viewerHasLiked);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
          {comment?.author?.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {comment?.author?.fullName || 'Anonymous'}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {timestamp}
              </p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{comment.content}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                comment.viewerHasLiked ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              {comment.likesCount}
            </button>
            <button
              type="button"
              onClick={handleReply}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {Array.isArray(comment?.replies) && comment.replies.length > 0 && (
        <div className="ml-10 flex flex-col gap-3 border-l border-slate-100 pl-6">
          <button
            type="button"
            onClick={() => setShowReplies((prev) => !prev)}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            <ChevronDown className={`h-4 w-4 transition ${showReplies ? 'rotate-0' : '-rotate-90'}`} />
            {showReplies ? 'Hide replies' : 'Show replies'}
          </button>
          {showReplies &&
            comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                depth={depth + 1}
                onReply={onReply}
                onLikeToggle={onLikeToggle}
                onDelete={onDelete}
                currentUserId={currentUserId}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

