// components/ArtworkModal.tsx
import React from 'react';
import { Artwork } from '../types';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-3xl hover:text-amber-400 transition-colors"
        >
          &times;
        </button>
        
        {/* Frame container */}
        <div className="relative">
          {/* Frame image - same for all artworks */}
          <img 
            src="/images/frames/artwork-frame.png" 
            alt="Artwork frame"
            className="w-full h-auto"
          />
          
          {/* Artwork image */}
          <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-12 md:p-16">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="max-h-[80vh] max-w-full object-contain"
              style={{ objectPosition: artwork.category === 'canvas' ? 'center 20%' : 'center' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;