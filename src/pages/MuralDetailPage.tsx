// src/pages/MuralDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Artwork } from '../types'; // Make sure your types.ts is correct and accessible
import { getMuralArtworks } from '../utils/artworkService'; // Make sure this path and function exist
import { ArrowLeft } from 'lucide-react'; // Make sure lucide-react is installed: npm install lucide-react

const MuralDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the artwork ID from the URL
  const navigate = useNavigate(); // For programmatic navigation (e.g., back button)
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW CODE ADDED HERE ---
  useEffect(() => {
    // Scroll to the top of the window when the component mounts or id changes
    window.scrollTo(0, 0);
  }, [id]); // Depend on 'id' to ensure it scrolls for fresh loads or id changes
  // --- END NEW CODE ---

  useEffect(() => {
    const fetchArtwork = async () => {
      setIsLoading(true);
      try {
        // In a real application, it's more efficient to have a getArtworkById function
        // that fetches only the specific artwork. For now, we'll fetch all and find it.
        const allMurals = await getMuralArtworks(); // This needs to return all murals
        const foundArtwork = allMurals.find(a => a.id === id);
        setArtwork(foundArtwork || null);
      } catch (error) {
        console.error("Failed to fetch artwork:", error);
        setArtwork(null); // Ensure artwork is null on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtwork();
  }, [id]); // Dependency array includes 'id' to re-fetch if URL parameter changes

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="text-center py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Artwork Not Found</h2>
        <p className="text-gray-600 text-lg mb-8">The mural you are looking for does not exist or could not be loaded.</p>
        <button
          onClick={() => navigate('/murals')} // Go back to the murals gallery
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Murals
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-start mb-6">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-auto object-contain max-h-[80vh]" // Use max-h for responsiveness
          loading="eager" // Load this critical image immediately
        />
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-indigo-900 mb-4">
            {artwork.title}
          </h1>
          {artwork.artist && (
            <p className="text-gray-700 text-lg mb-2">
              <span className="font-semibold">Artist:</span> {artwork.artist}
            </p>
          )}
          {artwork.category && (
            <p className="text-gray-600 text-base mb-2">
              <span className="font-semibold">Category:</span> {artwork.category}
            </p>
          )}
          {artwork.subcategory && (
            <p className="text-gray-600 text-base mb-4">
              <span className="font-semibold">Subcategory:</span> {artwork.subcategory.split('-').join(' ')}
            </p>
          )}
          {artwork.description && (
            <p className="text-gray-800 leading-relaxed mt-4">
              {artwork.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuralDetailPage;