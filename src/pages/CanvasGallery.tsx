import React, { useState, useEffect } from 'react';
import { getCanvasArtworks, getCanvasCategories } from '../utils/artworkService';
import GalleryGrid from '../components/GalleryGrid';
import CategoryFilter from '../components/CategoryFilter';
import ArtworkModal from '../components/ArtworkModal'; // Add this import
import { Artwork } from '../types';

const CanvasGallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null); // Add this state

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const canvasCategories = await getCanvasCategories();
      setCategories(canvasCategories);

      const canvasArtworks = await getCanvasArtworks();
      setArtworks(canvasArtworks);
      setIsLoading(false);
    };

    loadData();
  }, []);

const handleCategoryChange = (category: string) => {
  setActiveCategory(category);
  if (category === 'all') {
    searchParams.delete('category');
  } else {
    searchParams.set('category', category);
  }
  setSearchParams(searchParams);
};


  const filteredArtworks = activeCategory === 'all'
    ? artworks
    : artworks.filter(artwork => artwork.subcategory === activeCategory);

  // Add this handler
  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Canvas Art Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/60" />
        </div>
        
        <div className="relative text-center text-white mx-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Canvas Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover our collection of exquisite canvas artworks showcasing remarkable talent and creativity.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 container mx-auto px-4">
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
          </div>
        ) : (
          <>
            {filteredArtworks.length > 0 ? (
              <GalleryGrid 
                artworks={filteredArtworks} 
                onArtworkClick={handleArtworkClick} // Pass the click handler
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No artworks found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)} 
        />
      )}
    </div>
  );
};

export default CanvasGallery;