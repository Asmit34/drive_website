import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artwork } from '../types';

interface GalleryGridProps {
  artworks: Artwork[];
  title?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ artworks, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Artwork | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const scrollbarWidth = useRef(0);

  // Preload critical resources and establish early connections
  useEffect(() => {
    if (artworks.length === 0) return;

    try {
      // Preconnect to image origin domain
      const imageOrigin = new URL(artworks[0].imageUrl).origin;
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = imageOrigin;
      document.head.appendChild(preconnectLink);

      // Preload first 3 images (above-the-fold)
      artworks.slice(0, 3).forEach(artwork => {
        const img = new Image();
        img.src = artwork.imageUrl;
        img.fetchPriority = 'high';
      });

      return () => {
        document.head.removeChild(preconnectLink);
      };
    } catch (e) {
      console.warn('Could not optimize image loading:', e);
    }
  }, [artworks]);

  const openLightbox = useCallback((artwork: Artwork) => {
    setCurrentImage(artwork);
    setLightboxOpen(true);

    // Preload adjacent images for lightbox navigation
    const currentIndex = artworks.findIndex(a => a.id === artwork.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
      const nextIndex = (currentIndex + 1) % artworks.length;
      
      [prevIndex, nextIndex].forEach(idx => {
        const img = new Image();
        img.src = artworks[idx].imageUrl;
      });
    }

    // Handle scrollbar width to prevent layout shift
    scrollbarWidth.current = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth.current}px`;
  }, [artworks]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    setCurrentImage(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!currentImage || artworks.length === 0) return;
    const currentIndex = artworks.findIndex(artwork => artwork.id === currentImage.id);
    const nextIndex = (currentIndex + 1) % artworks.length;
    setCurrentImage(artworks[nextIndex]);
  }, [artworks, currentImage]);

  const handlePrev = useCallback(() => {
    if (!currentImage || artworks.length === 0) return;
    const currentIndex = artworks.findIndex(artwork => artwork.id === currentImage.id);
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setCurrentImage(artworks[prevIndex]);
  }, [artworks, currentImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev, closeLightbox]);

  // Touch navigation handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || e.touches.length !== 1) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Generate blur-up placeholder (simplified version)
  const getBlurDataUrl = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg==';
  };

  return (
    <div className="gallery-grid-container">
      {title && (
        <h2 className="text-2xl font-serif font-bold mb-6 text-indigo-900">{title}</h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork, index) => {
          // Optimization strategy based on position
          const isAboveTheFold = index < 6;
          const isCritical = index < 3;
          const hasLoaded = loadedImages.has(artwork.id);

          return (
            <div
              key={artwork.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => openLightbox(artwork)}
            >
              <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative">
                {/* Blur-up placeholder */}
                {!hasLoaded && (
                  <img
                    src={artwork.thumbnailUrl || getBlurDataUrl()}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-sm"
                    aria-hidden="true"
                    loading="eager"
                  />
                )}
                
                {/* Main image with optimized loading */}
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    hasLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={isAboveTheFold ? 'eager' : 'lazy'}
                  fetchpriority={isCritical ? 'high' : 'auto'}
                  width={400}
                  height={300}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(artwork.id))}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target && artwork.fallbackUrl) {
                      target.src = artwork.fallbackUrl;
                    }
                  }}
                />
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-bold">{artwork.title}</h3>
                {artwork.artist && (
                  <p className="text-gray-300 text-sm">{artwork.artist}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 touch-action-none"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full max-w-5xl flex flex-col items-center justify-center bg-transparent rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 text-white hover:text-amber-400 transition-colors"
              onClick={closeLightbox}
              aria-label="Close Lightbox"
            >
              <X size={32} />
            </button>

            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="max-h-[80vh] max-w-[95vw] object-contain rounded-lg shadow-xl"
              loading="eager"
              fetchpriority="high"
            />

            <div className="mt-4 text-center text-white bg-black bg-opacity-50 p-3 rounded-lg max-w-[90vw] overflow-hidden">
              <h3 className="text-xl font-semibold">{currentImage.title}</h3>
              {currentImage.artist && (
                <p className="text-gray-300 text-sm mt-1">{currentImage.artist}</p>
              )}
              {currentImage.description && (
                <p className="text-gray-400 text-sm mt-2 line-clamp-3">{currentImage.description}</p>
              )}
            </div>

            {artworks.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-600 text-white rounded-full p-3 transition-colors flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-600 text-white rounded-full p-3 transition-colors flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  aria-label="Next Image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;