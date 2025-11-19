import React, { forwardRef, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = forwardRef(({ value, onChange, onImageUpload, placeholder = 'Write something remarkable...', className = '', readOnly = false }, ref) => {
  const internalRef = useRef(null);
  const quillRef = ref || internalRef;

  // Debug: Log when component mounts and key props change
  React.useEffect(() => {
    console.log('RichTextEditor mounted/updated:', { value, readOnly, placeholder });
  }, [value, readOnly, placeholder]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: async () => {
          if (onImageUpload) {
            await onImageUpload(quillRef?.current?.getEditor());
            return;
          }

          // Create a custom dialog for image insertion
          const imageUrl = window.prompt('Enter image URL (e.g., https://example.com/image.jpg):');
          if (imageUrl && imageUrl.trim() && quillRef?.current) {
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', imageUrl.trim(), 'user');
          }
        },
        link: function(value) {
          if (value) {
            const href = window.prompt('Enter the URL:');
            if (href) {
              const editor = quillRef?.current?.getEditor();
              if (editor) {
                editor.format('link', href);
              }
            }
          } else {
            const editor = quillRef?.current?.getEditor();
            if (editor) {
              editor.format('link', false);
            }
          }
        }
      }
    },
    clipboard: {
      matchVisual: false
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    }
  }), [onImageUpload, quillRef]);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'script',
    'align',
    'color',
    'background',
    'link',
    'image',
    'video'
  ];

  return (
    <div className={`rich-text-editor ${className}`} style={{ position: 'relative', zIndex: 1 }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        onFocus={() => console.log('ReactQuill focused')}
        onBlur={() => console.log('ReactQuill blurred')}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        preserveWhitespace={true}
        style={{
          minHeight: '300px'
        }}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;

