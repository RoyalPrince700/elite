import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import apiService from '../../services/api';
import OptimizedImage from './OptimizedImage';

const BlogCard = ({ blog }) => {
  const publishDate = useMemo(() => {
    if (!blog?.createdAt) return '';
    return new Date(blog.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [blog?.createdAt]);

  const likes = blog?.metrics?.likes ?? 0;
  const comments = blog?.metrics?.comments ?? 0;

  return (
    <Link to={`/blog/${blog.slug}`} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
        {blog?.headerImage && (
          <div className="relative h-52 w-full overflow-hidden rounded-b-none bg-slate-100 md:h-44 lg:h-40">
            <OptimizedImage
              src={blog.headerImage}
              alt={blog.title}
              className="h-full w-full object-contain md:object-cover transition duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between gap-3 p-4">
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 md:text-lg">
              {blog.title}
            </h3>
            {blog?.subheading && (
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                {blog.subheading}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500 md:text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-baseline gap-1">
                <span className="font-semibold text-slate-800">{likes}</span>
                <span className="text-slate-500">likes</span>
              </span>
              <span className="flex items-baseline gap-1">
                <span className="font-semibold text-slate-800">{comments}</span>
                <span className="text-slate-500">comments</span>
              </span>
            </div>
            <span className="whitespace-nowrap text-slate-500">{publishDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const TagFilter = () => null;

const PaginationControls = ({ pagination, onPageChange }) => {
  if (!pagination) return null;
  const { page, totalPages } = pagination;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm font-semibold text-slate-600">
        Page {page} of {totalPages || 1}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

const BlogListSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 2 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
    ))}
  </div>
);

const BlogList = ({ pageSize = 6 }) => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [availableTags, setAvailableTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pageSize.toString()
        });

        if (debouncedSearch) params.set('search', debouncedSearch);

        const response = await apiService.request(`/blogs?${params.toString()}`);

        const { data = [], pagination: meta, filters = {} } = response || {};

        setBlogs(data);
        setPagination({
          page: meta?.page || 1,
          totalPages: meta?.totalPages || 1,
          total: meta?.total || data.length
        });
        setAvailableTags(filters?.availableTags || []);
      } catch (err) {
        console.error('❌ [BlogList] Error fetching blogs:', err);
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pagination.page, debouncedSearch, activeTag, pageSize]);

  const handlePageChange = (nextPage) => {
    setPagination((prev) => ({ ...prev, page: nextPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 lg:px-0">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Insights
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Stories from the Elite Retoucher team
          </h2>
          <p className="text-base text-slate-600">
            Explore our latest thoughts on retouching workflows, creative direction, and growth tips.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none ring-offset-0 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              placeholder="Search by title, tag, or topic..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </div>
        </div>

        <TagFilter />

        {loading ? (
          <BlogListSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-base font-semibold text-slate-700">No blog posts found.</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {blogs.map((blog) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} />
              ))}
            </div>
            <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading fresh stories
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;

