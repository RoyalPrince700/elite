import React from 'react';
import BlogList from '../components/blog/BlogList';

const BlogListPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
        <BlogList />
      </div>
    </div>
  );
};

export default BlogListPage;
