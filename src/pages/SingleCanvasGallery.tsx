import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getSingleCanvasArtworks, getSingleCanvasCategories } from '../utils/artworkService';
import GalleryGrid from '../components/GalleryGrid';
import { Artwork } from '../types';
import { ArrowRight, ChevronDown } from 'lucide-react';

const SingleCanvasGallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [singleCanvasCategories, singleCanvasArtworks] = await Promise.all([
        getSingleCanvasCategories(),
        getSingleCanvasArtworks()
      ]);
      
      if (singleCanvasArtworks.length === 0 && retryCount < 2) {
        // If no artworks found but we can retry
        setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        return;
      }

      setCategories(singleCanvasCategories);
      setArtworks(singleCanvasArtworks);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load artworks");
      if (retryCount < 2) {
        setTimeout(() => setRetryCount(prev => prev + 1), 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [retryCount]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleRetry = () => {
    setRetryCount(0);
    loadData();
  };

  const filteredArtworks = activeCategory === 'all'
    ? artworks
    : artworks.filter(artwork => artwork.subcategory === activeCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg"
            alt="Single Panel Canvas Gallery"
            className="w-full h-full object-cover"
            loading="eager" // Load hero image immediately
          />
          <div className="absolute inset-0 bg-indigo-900/60" />
        </div>
        
        <div className="relative text-center text-white mx-4 -mt-20 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Single Panel Canvas</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Elegant standalone canvas artworks perfect for focused displays.
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
        {/* Desktop Category Filter */}
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

        {/* Mobile Category Filter */}
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
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <GalleryGrid artworks={filteredArtworks} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No artworks found in this category.
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default SingleCanvasGallery;