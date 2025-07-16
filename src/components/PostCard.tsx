import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface PostCardProps {
  id: string;
  title: string;
  small_image: string;
  medium_image: string;
  published_at: string;
}

const PostCard: React.FC<PostCardProps> = ({ 
  id, 
  title, 
  small_image, 
  medium_image, 
  published_at 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      ref={ref}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        {inView && (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            <img
              src={medium_image || small_image}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            {imageError && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Image not available</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-2">
          {formatDate(published_at)}
        </p>
        
        <h3 
          className="text-gray-800 font-semibold leading-tight line-clamp-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
};

export default PostCard;