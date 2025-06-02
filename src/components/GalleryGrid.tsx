import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    imageRefs.current.forEach((img) => {
      if (observerRef.current) {
        observerRef.current.observe(img);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [artworks]);

  const openLightbox = (artwork: Artwork) => {
    setCurrentImage(artwork);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set(prev).add(imageUrl));
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
  }, [lightboxOpen, handleNext, handlePrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <div 
            key={artwork.id}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-gray-100"
            onClick={() => openLightbox(artwork)}
            style={{ minHeight: '300px' }}
          >
            <div className={`absolute inset-0 bg-gray-200 animate-pulse ${loadedImages.has(artwork.imageUrl) ? 'hidden' : ''}`}>
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <img 
              ref={el => el && imageRefs.current.set(artwork.id, el)}
              data-src={artwork.imageUrl}
              alt={artwork.title}
              className={`w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 ${
                loadedImages.has(artwork.imageUrl) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(artwork.imageUrl)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white text-lg font-bold">{artwork.title}</h3>
              {artwork.description && (
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{artwork.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          
          <div className="w-full max-w-5xl p-4">
            <div className="relative">
              <img 
                src={currentImage.imageUrl} 
                alt={currentImage.title} 
                className="max-h-[80vh] mx-auto object-contain" 
              />
              
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-bold">{currentImage.title}</h3>
                {currentImage.description && (
                  <p className="text-gray-300 mt-2">{currentImage.description}</p>
                )}
              </div>
            </div>
            
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button 
                className="bg-black/50 hover:bg-amber-600 text-white rounded-full p-2 transition-colors"
                onClick={handlePrev}
              >
                ←
              </button>
            </div>
            
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button 
                className="bg-black/50 hover:bg-amber-600 text-white rounded-full p-2 transition-colors"
                onClick={handleNext}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;