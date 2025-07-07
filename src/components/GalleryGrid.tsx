// src/components/GalleryGrid.tsx
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
  const scrollbarWidth = useRef(0);

  const openLightbox = useCallback((artwork: Artwork) => {
    setCurrentImage(artwork);
    setLightboxOpen(true);

    scrollbarWidth.current = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth.current}px`;
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    setCurrentImage(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!currentImage) return;
    const currentIndex = artworks.findIndex(artwork => artwork.id === currentImage.id);
    if (currentIndex === -1) {
      setCurrentImage(artworks[0] || null);
      return;
    }
    const nextIndex = (currentIndex + 1) % artworks.length;
    setCurrentImage(artworks[nextIndex]);
  }, [artworks, currentImage]);

  const handlePrev = useCallback(() => {
    if (!currentImage) return;
    const currentIndex = artworks.findIndex(artwork => artwork.id === currentImage.id);
    if (currentIndex === -1) {
      setCurrentImage(artworks[artworks.length - 1] || null);
      return;
    }
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setCurrentImage(artworks[prevIndex]);
  }, [artworks, currentImage]);

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

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-serif font-bold mb-6 text-indigo-900">{title}</h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openLightbox(artwork)}
          >
            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy" // <--- This ensures thumbnails only load when in/near viewport
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white text-lg font-bold">{artwork.title}</h3>
              {artwork.artist && (
                 <p className="text-gray-300 text-sm">{artwork.artist}</p>
              )}
            </div>
          </div>
        ))}
      </div>

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
              loading="eager" // <--- This image should load immediately when the lightbox is opened
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