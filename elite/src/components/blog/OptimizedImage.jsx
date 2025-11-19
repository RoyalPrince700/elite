import { useState, useCallback } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  imageClassName = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg==',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    // Fallback to a simple placeholder if image fails to load
    setImageSrc(placeholder);
    onError?.();
  }, [onError, placeholder]);

  // Generate responsive image URLs (assuming Cloudinary or similar service)
  const generateResponsiveSrc = useCallback((baseSrc, width) => {
    if (!baseSrc || !baseSrc.includes('cloudinary')) return baseSrc;

    // For Cloudinary, add transformation parameters
    const transformation = `w_${width},f_auto,q_auto`;
    return baseSrc.replace('/upload/', `/upload/${transformation}/`);
  }, []);

  const srcSet = [
    `${generateResponsiveSrc(src, 480)} 480w`,
    `${generateResponsiveSrc(src, 768)} 768w`,
    `${generateResponsiveSrc(src, 1024)} 1024w`,
    `${generateResponsiveSrc(src, 1280)} 1280w`,
    `${generateResponsiveSrc(src, 1920)} 1920w`
  ].join(', ');

  const containerClasses = `${className} ${containerClassName}`.trim();
  const imgClasses = imageClassName || className;

  return (
    <div className={`relative overflow-hidden ${containerClasses}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
          <div className="text-sm text-slate-500">Loading...</div>
        </div>
      )}

      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-sm text-slate-500">Failed to load image</div>
        </div>
      )}

      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'hidden' : ''} ${imgClasses}`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
