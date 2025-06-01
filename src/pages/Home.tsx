import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getHighlightedArtworks } from '../utils/artworkService';
import { Artwork } from '../types';

const Home: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const videoUrl = "https://bat.com.np/wp-content/uploads/2025/05/Untitled-design-1.mp4";

  useEffect(() => {
    // Load featured artworks
    const loadArtworks = async () => {
      const featuredArtworks = await getHighlightedArtworks();
      setArtworks(featuredArtworks);
    };
    
    loadArtworks();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section with Video */}
      <section className="relative min-h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 bg-black overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover opacity-70"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 flex flex-col justify-center items-center min-h-screen text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 max-w-4xl">
            Celebrating Art That Speaks
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mb-8">
            Discover the beauty of murals and canvas artworks that transform spaces and inspire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/murals"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors font-medium text-lg"
            >
              Explore Murals
            </Link>
            <Link
              to="/canvas"
              className="px-8 py-3 bg-transparent hover:bg-white/10 border-2 border-white text-white rounded-md transition-colors font-medium text-lg"
            >
              View Canvas Art
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 text-indigo-900">
            Our Gallery Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mural Gallery Card (unchanged) */}
            <GalleryCard 
              title="Mural Gallery"
              description="Explore breathtaking murals across various themes - from abstract designs to cultural expressions and beyond."
              imageUrl="https://bat.com.np/wp-content/uploads/2025/02/12018619.jpg"
              linkTo="/murals"
            />
            
            {/* Modified Canvas Gallery Card */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg h-96">
              <div className="relative w-full h-full">
                <img 
                  src="https://bat.com.np/wp-content/uploads/2025/02/Pink-Flowers.jpg" 
                  alt="Canvas Gallery"
                  className="absolute top-0 left-0 w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-serif font-bold mb-2">Canvas Gallery</h3>
                <p className="text-gray-200 mb-4">
                  Discover exquisite canvas artworks showcasing diverse styles, subjects, and artistic interpretations.
                </p>
                <Link
                  to="/canvas"
                  className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium"
                >
                  Explore Gallery <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artwork Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-indigo-900">
            Featured Artworks
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
            Explore some of our most captivating pieces that showcase the depth and diversity of our collection.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.slice(0, 6).map((artwork) => (
              <div 
                key={artwork.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold">{artwork.title}</h3>
                  <p className="text-gray-300 mt-2">{artwork.category}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to={artworks[0]?.category === 'mural' ? '/murals' : '/canvas'}
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-lg"
            >
              View more artworks
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface GalleryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  linkTo: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ title, description, imageUrl, linkTo }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg h-96">
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
        <h3 className="text-white text-2xl font-serif font-bold mb-2">{title}</h3>
        <p className="text-gray-200 mb-4">{description}</p>
        <Link
          to={linkTo}
          className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium"
        >
          Explore Gallery <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Home;