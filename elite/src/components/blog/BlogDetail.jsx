import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Loader2, Share2 } from 'lucide-react';
import apiService from '../../services/api';
import CommentSection from './CommentSection';
import OptimizedImage from './OptimizedImage';

const BlogDetail = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [moreBlogs, setMoreBlogs] = useState([]);

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) return;
      setLoading(true);
      setError('');
      try {
        const response = await apiService.request(`/blogs/${slug}`);
        const blogData = response?.data;
        setBlog(blogData);
        setLikesCount(blogData?.metrics?.likes || 0);
        setCommentCount(blogData?.metrics?.comments || 0);

        const token = localStorage.getItem('auth_token');
        if (token && blogData?._id) {
          try {
            const likeStatus = await apiService.request(`/blogs/${blogData._id}/likes/status`);
            setLiked(Boolean(likeStatus?.data?.liked));
            setLikesCount(likeStatus?.data?.totalLikes ?? blogData?.metrics?.likes ?? 0);
          } catch (statusError) {
            console.warn('Unable to fetch like status:', statusError?.message);
          }
        } else {
          setLiked(false);
        }

        // Fetch a few more published blogs to show beneath this post
        try {
          const moreResponse = await apiService.request('/blogs?page=1&limit=3');
          const allBlogs = moreResponse?.data || [];
          const filtered = allBlogs.filter((b) => b.slug !== blogData.slug).slice(0, 3);
          setMoreBlogs(filtered);
        } catch (moreError) {
          console.warn('Unable to load additional blogs:', moreError?.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  const publishDate = useMemo(() => {
    if (!blog?.createdAt) return '';
    return new Date(blog.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [blog?.createdAt]);

  const handleLikeToggle = async () => {
    if (!blog?._id) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please sign in to like this post.');
      return;
    }

    try {
      const endpoint = `/blogs/${blog._id}/likes`;
      if (liked) {
        const response = await apiService.request(endpoint, { method: 'DELETE' });
        setLiked(false);
        setLikesCount(response?.data?.totalLikes ?? Math.max(0, likesCount - 1));
      } else {
        const response = await apiService.request(endpoint, { method: 'POST' });
        setLiked(true);
        setLikesCount(response?.data?.totalLikes ?? likesCount + 1);
      }
    } catch (err) {
      setError(err.message || 'Unable to update like');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (shareError) {
      console.error('Unable to copy link:', shareError);
    }
  };

  const handleCommentCountChange = (count) => {
    setCommentCount(count);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
        <p className="text-base font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 lg:px-0 animate-in fade-in-0 duration-500">
        <div className="flex flex-col gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Blog
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">
            {blog.title}
          </h1>
          {blog?.subheading && (
            <p className="text-lg text-slate-600 md:text-xl">{blog.subheading}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            <span>{publishDate}</span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {blog.readingTime || 4} min read
            </span>
            <span>{commentCount} comments</span>
          </div>
        </div>

        {blog?.headerImage && (
          <OptimizedImage
            src={blog.headerImage}
            alt={blog.title}
            containerClassName="mx-auto rounded-3xl shadow-2xl max-w-3xl"
            imageClassName="w-full h-64 object-cover object-center md:h-80 lg:h-96"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>Share this story</span>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
              {shareCopied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLikeToggle}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                liked ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {likesCount} likes
            </button>
          </div>
        </div>

        <div className="blog-post-content prose-lg max-w-none prose-headings:font-semibold prose-a:text-slate-900 prose-img:rounded-xl prose-strong:text-slate-900">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {blog?.tags?.length ? (
          <div className="flex flex-wrap gap-3">
            {blog.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <CommentSection
          blogId={blog._id}
          initialCount={commentCount}
          onCountChange={handleCommentCountChange}
        />

        {moreBlogs.length > 0 && (
          <section className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              More stories from Elite Retoucher
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {moreBlogs.map((item) => (
                <Link
                  key={item._id || item.slug}
                  to={`/blog/${item.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {item.headerImage && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      <img
                        src={item.headerImage}
                        alt={item.title}
                        className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  {item.subheading && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {item.subheading}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default BlogDetail;

