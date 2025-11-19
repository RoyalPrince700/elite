import React from 'react';
import { useParams } from 'react-router-dom';
import BlogDetail from '../components/blog/BlogDetail';

const BlogDetailPage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <BlogDetail slug={slug} />
    </div>
  );
};

export default BlogDetailPage;
