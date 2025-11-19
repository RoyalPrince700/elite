import { useEffect, useState } from 'react';

const CommentForm = ({
  onSubmit,
  loading = false,
  initialValue = '',
  placeholder = 'Share your thoughts...',
  submitLabel = 'Post comment',
  onCancel,
  isReply = false
}) => {
  const [content, setContent] = useState(initialValue);
  const [characters, setCharacters] = useState(initialValue.length);

  useEffect(() => {
    setContent(initialValue);
    setCharacters(initialValue.length);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    if (!initialValue) {
      setContent('');
      setCharacters(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setCharacters(event.target.value.length);
        }}
        placeholder={placeholder}
        rows={isReply ? 3 : 4}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {characters} / 1000
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="rounded-full bg-blue-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Posting...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;

