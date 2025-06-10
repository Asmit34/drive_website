// src/pages/MuralGallery.tsx (Your provided code, with one small change for mobile image display)

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMuralArtworks, getMuralCategories } from '../utils/artworkService';
import GalleryGrid from '../components/GalleryGrid';
import { Artwork } from '../types';
import { ArrowRight, ChevronDown } from 'lucide-react';

const MuralGallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const muralCategories = await getMuralCategories();
      setCategories(muralCategories);

      const muralArtworks = await getMuralArtworks();
      setArtworks(muralArtworks);
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

  // Mobile-specific artwork grouping (2 per row) - (This variable is not actually used in the rendering,
  // the map directly uses filteredArtworks, which is fine)
  const groupedArtworks = [];
  for (let i = 0; i < filteredArtworks.length; i += 2) {
    groupedArtworks.push(filteredArtworks.slice(i, i + 2));
  }

  return (
    <div>
      {/* Hero Section - Unchanged */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1995730/pexels-photo-1995730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Mural Art Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/60" />
        </div>
        
        <div className="relative text-center text-white mx-4 -mt-12 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Mural Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore our diverse collection of stunning murals across various themes and styles.
          </p>
        </div>

        <Link
          to="/canvas"
          className="absolute bottom-9 md:bottom-12 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 group bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-yellow-600 hover:via-pink-500 hover:to-red-400 text-white rounded-2xl p-4 md:p-6 transition-all duration-500 flex flex-col items-center transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-yellow-400/40 ring-4 ring-white/20 hover:ring-white/40 w-full max-w-xs md:w-96"
        >
          <div className="relative overflow-hidden rounded-xl mb-3 flex flex-col items-center justify-center w-full h-20 md:h-30 bg-white/10 backdrop-blur-md shadow-inner">
            <div className="text-center p-3 space-y-1">
              <p className="text-white text-xl font-bold tracking-wide drop-shadow-md">Canvas Gallery</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-500" />
          </div>
          <span className="text-white flex items-center gap-2 text-base md:text-lg font-bold tracking-wide drop-shadow-md">
            Click here
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
          </span>
        </Link>
      </section>

      {/* Gallery Section */}
      <section className="py-16 container mx-auto px-4">
        {/* Desktop Category Filter - Unchanged */}
        <div className="hidden md:flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {category.split('-').join(' ')}
            </button>
          ))}
        </div>

        {/* Mobile Category Filter - Unchanged */}
        <div className="md:hidden mb-8 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full flex-1 ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
            >
              See by Category
              <ChevronDown size={16} className={`transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showMobileCategories && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    handleCategoryChange(category);
                    setShowMobileCategories(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {category.split('-').join(' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
          </div>
        ) : (
          <>
            {filteredArtworks.length > 0 ? (
              <>
                {/* Mobile View Only (2 images per row) */}
                <div className="md:hidden grid grid-cols-2 gap-4">
                  {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="group">
                      <Link to={`/mural/${artwork.id}`} className="block">
                        <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md bg-gray-100">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            // CHANGE HERE: Use object-contain to show the full image in the thumbnail
                            className="w-full h-full object-contain" 
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-2 px-1">
                          <h3 className="font-medium text-sm line-clamp-1">{artwork.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-1">{artwork.artist}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Unchanged (using GalleryGrid) */}
                <div className="hidden md:block">
                  <GalleryGrid artworks={filteredArtworks} />
                </div>
              </>
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
    </div>
  );
};

export default MuralGallery;