import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Artwork } from '../types';

interface GalleryGridProps {
  artworks: Artwork[];
  title?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ artworks, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Artwork | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Optimize image URL with query parameters for size and quality
  const optimizeImageUrl = (url: string, width: number = 400) => {
    if (url.includes('your-image-service.com')) {
      return `${url}?w=${width}&q=80&auto=format`;
    }
    return url;
  };

  const openLightbox = (artwork: Artwork) => {
    setCurrentImage(artwork);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const handleNext = useCallback(() => {
    if (!currentImage) return;
    const currentIndex = artworks.findIndex(artwork => artwork.id === currentImage.id);
    const nextIndex = (currentIndex + 1) % artworks.length;
    setCurrentImage(artworks[nextIndex]);
  }, [artworks, currentImage]);

  const handlePrev = useCallback(() => {
    if (!currentImage) return;
    const currentIndex = artworks.findIndex(artwork => artwork.id === currentImage.id);
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setCurrentImage(artworks[prevIndex]);
  }, [artworks, currentImage]);

  // Preload first few images
  useEffect(() => {
    artworks.slice(0, 6).forEach(artwork => {
      const img = new Image();
      img.src = optimizeImageUrl(artwork.imageUrl, 800);
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [artwork.id]: true }));
      };
    });
  }, [artworks]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft': handlePrev(); break;
        case 'ArrowRight': handleNext(); break;
        case 'Escape': closeLightbox(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  // Touch navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.touches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
    setTouchStart(null);
  };

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-serif font-bold mb-6 text-indigo-900">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <div 
            key={artwork.id}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openLightbox(artwork)}
          >
            {/* Skeleton loader */}
            {!loadedImages[artwork.id] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
            )}
            
            {/* Optimized image with lazy loading */}
            <img 
              src={optimizeImageUrl(artwork.imageUrl, 400)}
              srcSet={`
                ${optimizeImageUrl(artwork.imageUrl, 400)} 400w,
                ${optimizeImageUrl(artwork.imageUrl, 800)} 800w,
                ${optimizeImageUrl(artwork.imageUrl, 1200)} 1200w
              `}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={artwork.title || `Artwork ${artwork.id}`}
              className={`w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 ${
                loadedImages[artwork.id] ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoadedImages(prev => ({ ...prev, [artwork.id]: true }))}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white text-lg font-bold">{artwork.title || ' '}</h3>
              {artwork.description && (
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{artwork.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            <X size={32} />
          </button>
          
          <div className="w-full max-w-5xl p-4" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={optimizeImageUrl(currentImage.imageUrl, 1200)}
                alt={currentImage.title || 'Artwork'}
                className="max-h-[80vh] mx-auto object-contain" 
              />
              
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-bold">{currentImage.title || " "}</h3>
                {currentImage.description && (
                  <p className="text-gray-300 mt-2">{currentImage.description}</p>
                )}
              </div>
            </div>
            
            <button 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-amber-600 text-white rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            
            <button 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-amber-600 text-white rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;