import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMuralArtworks, getMuralCategories } from '../utils/artworkService';
import GalleryGrid from '../components/GalleryGrid';
import CategoryFilter from '../components/CategoryFilter';
import { Artwork } from '../types';

const MuralGallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1995730/pexels-photo-1995730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Mural Art Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/60" />
        </div>
        
        <div className="relative text-center text-white mx-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Mural Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore our diverse collection of stunning murals across various themes and styles.
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
              <GalleryGrid artworks={filteredArtworks} />
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