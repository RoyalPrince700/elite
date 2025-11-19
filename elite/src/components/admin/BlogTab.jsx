import React from 'react';
import { FaNewspaper, FaEdit, FaTrash, FaEye, FaEyeSlash, FaCalendar, FaUser, FaHeart, FaComment } from 'react-icons/fa';

const BlogTab = ({
  blogs,
  onEditBlog,
  onDeleteBlog,
  onTogglePublish,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasBlog = blogs && blogs.length > 0;

  return (
    <div className="space-y-4">
      {hasBlog ? (
        blogs.map((blog) => (
          <div key={blog._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  {blog.headerImage && (
                    <img
                      src={blog.headerImage}
                      alt={blog.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {blog.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        blog.published ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {blog.subheading && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {blog.subheading}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <FaUser className="text-gray-400" />
                        <span>{blog.author?.fullName || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaCalendar className="text-gray-400" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaHeart className="text-gray-400" />
                        <span>{blog.likesCount || 0} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaComment className="text-gray-400" />
                        <span>{blog.commentsCount || 0} comments</span>
                      </div>
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onTogglePublish(blog._id, blog.published)}
                    className={`p-2 rounded-lg transition-colors ${
                      blog.published
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={blog.published ? 'Unpublish blog' : 'Publish blog'}
                  >
                    {blog.published ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => onEditBlog(blog)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit blog"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDeleteBlog(blog._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete blog"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <FaNewspaper className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No blogs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first blog post.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogTab;
