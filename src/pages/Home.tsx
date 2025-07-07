import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getHighlightedArtworks } from '../utils/artworkService';
import { Artwork } from '../types';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load featured artworks
    const loadArtworks = async () => {
      const featuredArtworks = await getHighlightedArtworks();
      setArtworks(featuredArtworks);
    };
    
    loadArtworks();
    
    // Auto-rotate slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (artworks.length || 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [artworks.length]);

  // Generate responsive image URLs
  const getResponsiveImageUrls = (url: string) => {
    if (url.includes('postimg.cc')) {
      const baseUrl = url.replace(/\.(jpg|jpeg|png)/, '');
      return {
        webp: `${baseUrl}.webp`,
        small: url.replace(/\/([^/]+)$/, '/thumb/$1'),
        medium: url,
        large: url.replace(/\/([^/]+)$/, '/orig/$1')
      };
    }
    
    return {
      webp: url,
      small: url,
      medium: url,
      large: url
    };
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Slideshow */}
        <div className="absolute inset-0 bg-black">
          {artworks.map((artwork, index) => {
            const imageUrls = getResponsiveImageUrls(artwork.imageUrl);
            
            return (
              <div 
                key={artwork.id} 
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <picture>
                  <source 
                    type="image/webp" 
                    srcSet={`
                      ${imageUrls.small} 768w,
                      ${imageUrls.medium} 1024w,
                      ${imageUrls.large} 1920w
                    `}
                    sizes="100vw"
                  />
                  <img 
                    src={isMobile ? imageUrls.small : imageUrls.large} 
                    alt={artwork.title} 
                    className="absolute w-full h-full object-cover opacity-70"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </picture>
              </div>
            );
          })}
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

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-amber-500 w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 text-indigo-900">
            Our Gallery Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mural Gallery Card */}
            <GalleryCard 
              title="Mural Gallery"
              description="Explore breathtaking murals across various themes - from abstract designs to cultural expressions and beyond."
              imageUrl="https://bat.com.np/wp-content/uploads/2025/04/Design-30.jpg"
              linkTo="/murals"
              isMobile={isMobile}
            />
            
            {/* Canvas Gallery Card */}
            <GalleryCard 
              title="Canvas Gallery"
              description="Discover exquisite canvas artworks showcasing diverse styles, subjects, and artistic interpretations."
              imageUrl="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              linkTo="/canvas"
              isMobile={isMobile}
            />
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.slice(0, isMobile ? 3 : 6).map((artwork, index) => {
              const imageUrls = getResponsiveImageUrls(artwork.imageUrl);
              
              return (
                <div 
                  key={artwork.id}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <picture>
                    <source 
                      type="image/webp" 
                      srcSet={`
                        ${imageUrls.small} 300w,
                        ${imageUrls.medium} 600w
                      `}
                      sizes={isMobile ? "100vw" : "(max-width: 768px) 50vw, 33vw"}
                    />
                    <img 
                      src={isMobile ? imageUrls.small : imageUrls.medium} 
                      alt={artwork.title}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-bold">{artwork.title}</h3>
                    <p className="text-gray-300 mt-2">{artwork.category}</p>
                  </div>
                </div>
              );
            })}
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
  isMobile: boolean;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ title, description, imageUrl, linkTo, isMobile }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg h-96">
      <picture>
        <source 
          type="image/webp" 
          srcSet={imageUrl.replace(/\.(jpg|jpeg|png)/, '.webp')}
        />
        <img 
          src={imageUrl} 
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </picture>
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