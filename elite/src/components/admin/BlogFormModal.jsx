import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaUpload, FaImage } from 'react-icons/fa';
// NOTE: We previously tried using a rich text editor (ReactQuill) here,
// but it caused focus/click issues in the modal for this project setup.
// To keep the authoring experience reliable, we use a simple textarea
// and automatically convert the text to basic HTML paragraphs on save.
import { toast } from 'react-toastify';

// Convert plain text content into basic HTML paragraphs so it renders
// nicely in the blog detail view (which expects HTML and is wrapped in `prose`)
const convertContentToHtml = (content) => {
  if (!content) return '';

  // If the content already contains common HTML tags, assume it's already formatted
  if (/<(p|br|h1|h2|h3|ul|ol|li|strong|em|div)[\s>]/i.test(content)) {
    return content;
  }

  // Split on blank lines to create paragraphs and convert single line breaks to <br />
  const paragraphs = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const withLineBreaks = block.replace(/\n+/g, '<br />');
      return `<p>${withLineBreaks}</p>`;
    });

  return paragraphs.join('\n\n');
};

const BlogFormModal = ({
  showModal,
  setShowModal,
  blog,
  onSave,
  saving
}) => {
  const [formData, setFormData] = useState({
    title: '',
    subheading: '',
    content: '',
    headerImage: '',
    published: false,
    tags: '',
    metaDescription: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (showModal && blog) {
      // Edit mode
      setFormData({
        title: blog.title || '',
        subheading: blog.subheading || '',
        content: blog.content || '',
        headerImage: blog.headerImage || '',
        published: blog.published || false,
        tags: blog.tags ? blog.tags.join(', ') : '',
        metaDescription: blog.metaDescription || ''
      });
      setImagePreview(blog.headerImage || '');
    } else if (showModal && !blog) {
      // Create mode
      setFormData({
        title: '',
        subheading: '',
        content: '',
        headerImage: '',
        published: false,
        tags: '',
        metaDescription: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
    setErrors({});
  }, [showModal, blog]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error when user edits the field
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
    // Clear content error when user edits
    setErrors(prev => ({
      ...prev,
      content: undefined
    }));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          headerImage: 'Image size must be less than 10MB'
        }));
        toast.error('Image size must be less than 10MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          headerImage: e.target.result // Temporary preview, will be replaced with uploaded URL
        }));
        // Clear any previous header image errors once a valid file is selected
        setErrors(prev => ({
          ...prev,
          headerImage: undefined
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadToEditor = async (editor) => {
    // For now, we'll use URL input for images in blog content
    // TODO: Implement proper image upload for inline blog images
    const url = window.prompt('Enter image URL for your blog post:');
    if (url && url.trim()) {
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', url.trim(), 'user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation to mirror backend metadata requirements
    const newErrors = {};

    const titleTrimmed = formData.title?.trim() || '';
    if (titleTrimmed.length > 150) {
      newErrors.title = 'Title must be under 150 characters';
    }

    const subheadingTrimmed = formData.subheading?.trim() || '';
    if (subheadingTrimmed.length > 200) {
      newErrors.subheading = 'Subheading must be under 200 characters';
    }

    const metaDescriptionTrimmed = formData.metaDescription?.trim() || '';
    if (metaDescriptionTrimmed.length > 180) {
      newErrors.metaDescription = 'Meta description must be under 180 characters';
    }

    // Validate tags – up to 10, each 2–30 characters
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);

    if (tagsArray.length > 10) {
      newErrors.tags = 'Provide up to 10 tags';
    } else {
      for (const tag of tagsArray) {
        if (tag.length < 2 || tag.length > 30) {
          newErrors.tags = 'Each tag must be between 2 and 30 characters';
          break;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the highlighted errors before saving.');
      return;
    }

    // Prepare data for submission
    const formattedContent = convertContentToHtml(formData.content);

    const submitData = {
      ...formData,
      tags: tagsArray,
      content: formattedContent,
      headerImageFile: imageFile // Pass the file for upload
    };

    // If we're uploading a new file, let the backend handle headerImage via multer.
    // Remove any base64 data URLs so validation doesn't reject the request.
    if (imageFile || (typeof submitData.headerImage === 'string' && submitData.headerImage.startsWith('data:'))) {
      delete submitData.headerImage;
    }

    try {
      // Clear any previous server-side validation errors before submit
      setErrors({});
      await onSave(submitData);
    } catch (error) {
      console.error('❌ [BlogFormModal] Failed to save blog:', error);

      // Map backend validation errors (422) to field-level errors where possible
      if (error.errors && Array.isArray(error.errors)) {
        const backendErrors = {};
        error.errors.forEach(err => {
          let field = err.path;
          if (field === 'tags.*') {
            field = 'tags';
          }
          if (!backendErrors[field]) {
            backendErrors[field] = err.msg || 'Invalid value';
          }
        });
        setErrors(backendErrors);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      title: '',
      subheading: '',
      content: '',
      headerImage: '',
      published: false,
      tags: '',
      metaDescription: ''
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop - prevent clicks from bubbling through */}
      <div
        className="absolute inset-0"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'none' }}
      />
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative" style={{ zIndex: 10000, pointerEvents: 'auto' }}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <p className="text-gray-600 mt-1">
                {blog ? 'Update your blog post details' : 'Fill in the details for your new blog post'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={saving}
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog title (optional)"
                disabled={saving}
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Subheading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
              <input
                type="text"
                name="subheading"
                value={formData.subheading}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog subheading (optional)"
                disabled={saving}
              />
            </div>
            {errors.subheading && (
              <p className="text-xs text-red-600 mt-1">
                {errors.subheading}
              </p>
            )}

            {/* Header Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Image</label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative mx-auto max-w-3xl">
                    <img
                      src={imagePreview}
                      alt="Header preview"
                      className="w-full h-40 object-cover rounded-lg md:h-44 lg:h-48"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, headerImage: '' }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      disabled={saving}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    <FaUpload />
                    <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    Recommended: 1200x600px, max 10MB
                  </span>
                </div>
                {errors.headerImage && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.headerImage}
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-8">
              <div className="flex items-center mb-3">
                <label className="block text-base font-semibold text-gray-900">
                  Blog Content <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="ml-4 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Plain text with auto-formatting
                </div>
              </div>
              <div
                className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                style={{ position: 'relative', zIndex: 10000, pointerEvents: 'auto' }}
              >
                <textarea
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your blog content here... Use blank lines between paragraphs. You can also paste simple HTML (e.g., <h2>, <p>, <ul>)."
                  className="w-full min-h-[350px] p-4 text-base border-none outline-none resize-none"
                  disabled={saving}
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 <strong>Tips:</strong> Use blank lines between paragraphs. If you’re comfortable with HTML, you can add headings like {'<h2>Section</h2>'} and lists, and the blog page will render them with proper spacing.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
              {errors.tags && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.tags}
                </p>
              )}
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description for SEO (optional)"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 150-160 characters (maximum 180)
              </p>
              <p className="text-xs text-gray-500">
                {formData.metaDescription?.length || 0} / 180 characters
              </p>
              {errors.metaDescription && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.metaDescription}
                </p>
              )}
            </div>

            {/* Published Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={saving}
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publish immediately
              </label>
              <span className="text-xs text-gray-500">
                (You can always change this later)
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? 'Saving...' : (blog ? 'Update Post' : 'Create Post')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogFormModal;
