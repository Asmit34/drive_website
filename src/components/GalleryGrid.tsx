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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Mobile-optimized image URL generator
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return '';
    const params = isMobile 
      ? '?w=400&h=300&q=70&auto=format&fm=webp' 
      : '?w=800&h=600&q=85&auto=format';
    return `${url.split('?')[0]}${params}`;
  };

  // Lightbox controls
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
    const currentIndex = artworks.findIndex(a => a.id === currentImage.id);
    const nextIndex = (currentIndex + 1) % artworks.length;
    setCurrentImage(artworks[nextIndex]);
  }, [artworks, currentImage]);

  const handlePrev = useCallback(() => {
    if (!currentImage) return;
    const currentIndex = artworks.findIndex(a => a.id === currentImage.id);
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setCurrentImage(artworks[prevIndex]);
  }, [artworks, currentImage]);

  // Keyboard navigation for lightbox
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

  // Touch navigation for lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diff = touchStart - e.touches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
    setTouchStart(null);
  };

  // Image component with optimized loading
  const ImageWithLoader = ({ artwork }: { artwork: Artwork }) => {
    const [loaded, setLoaded] = useState(false);
    const optimizedUrl = getOptimizedImageUrl(artwork.imageUrl);

    return (
      <div className="relative aspect-[4/3]">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
        )}
        <img
          src={optimizedUrl}
          alt={artwork.title || `Artwork ${artwork.id}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setLoaded(true);
            setLoadedImages(prev => ({ ...prev, [artwork.id]: true }));
          }}
        />
      </div>
    );
  };

  return (
    <div className="gallery-container">
      {title && (
        <h2 className="text-2xl font-serif font-bold mb-6 text-indigo-900">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {artworks.map((artwork) => (
          <div 
            key={artwork.id}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openLightbox(artwork)}
          >
            <ImageWithLoader artwork={artwork} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white text-lg font-bold">
                {artwork.title || 'Untitled'}
              </h3>
              {artwork.description && (
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                  {artwork.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
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
          
          <div 
            className="w-full max-w-5xl p-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={getOptimizedImageUrl(currentImage.imageUrl).replace('w=400', 'w=1200').replace('q=70', 'q=90')}
                alt={currentImage.title || 'Artwork'}
                className="max-h-[80vh] mx-auto object-contain"
              />
              
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-bold">
                  {currentImage.title || 'Untitled'}
                </h3>
                {currentImage.description && (
                  <p className="text-gray-300 mt-2">
                    {currentImage.description}
                  </p>
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