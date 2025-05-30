// import React, { useState, useEffect } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { getSingleCanvasArtworks, getSingleCanvasCategories } from '../utils/artworkService';
// import GalleryGrid from '../components/GalleryGrid';
// import CategoryFilter from '../components/CategoryFilter';
// import { Artwork } from '../types';
// import { ArrowRight } from 'lucide-react';

// const SingleCanvasGallery: React.FC = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [artworks, setArtworks] = useState<Artwork[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       const singleCanvasCategories = await getSingleCanvasCategories();
//       setCategories(singleCanvasCategories);

//       const singleCanvasArtworks = await getSingleCanvasArtworks();
//       setArtworks(singleCanvasArtworks);
//       setIsLoading(false);
//     };

//     loadData();
//   }, []);

//   const handleCategoryChange = (category: string) => {
//     setActiveCategory(category);
//     if (category === 'all') {
//       searchParams.delete('category');
//     } else {
//       searchParams.set('category', category);
//     }
//     setSearchParams(searchParams);
//   };

//   const filteredArtworks = activeCategory === 'all'
//     ? artworks
//     : artworks.filter(artwork => artwork.subcategory === activeCategory);

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative h-[50vh] flex items-center justify-center">
//         <div className="absolute inset-0">
//           <img 
//             src="https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg" // Single-panel themed image
//             alt="Single Panel Canvas Gallery"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-indigo-900/60" />
//         </div>
        
//         <div className="relative text-center text-white mx-4">
//           <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Single Panel Canvas</h1>
//           <p className="text-xl max-w-2xl mx-auto">
//             Elegant standalone canvas artworks perfect for focused displays.
//           </p>
//         </div>

//         {/* Gallery Navigation */}
//         <Link
//           to="/canvas"
//           className="absolute bottom-8 right-8 group bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg p-6 transition-all duration-500 flex flex-col items-center transform hover:scale-105 hover:-translate-y-1 animate-pulse hover:animate-none shadow-xl hover:shadow-2xl ring-2 ring-white/30 hover:ring-white/50"
//         >
//           <div className="relative overflow-hidden rounded-lg mb-3">
//             <img 
//               src="https://i.postimg.cc/brYKksFr/ganesh-5.jpg" // 5-panel preview
//               alt="5 Panel Canvas Gallery"
//               className="w-50 h-50 object-cover group-hover:scale-110 transition-transform duration-500 shadow-lg brightness-110"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
//           </div>
//           <span className="text-white flex items-center gap-2 text-lg font-medium drop-shadow-lg">
//             View 5 Panel Gallery
//             <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
//           </span>
//         </Link>
//       </section>

//       {/* Gallery Section */}
//       <section className="py-16 container mx-auto px-4">
//         <CategoryFilter 
//           categories={categories}
//           activeCategory={activeCategory}
//           onCategoryChange={handleCategoryChange}
//         />

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
//           </div>
//         ) : (
//           <>
//             {filteredArtworks.length > 0 ? (
//               <GalleryGrid artworks={filteredArtworks} />
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-600 text-lg">
//                   No artworks found in this category.
//                 </p>
//               </div>
//             )}
//           </>
//         )}
//       </section>
//     </div>
//   );
// };

// export default SingleCanvasGallery;