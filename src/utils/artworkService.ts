import { Artwork } from '../types';

// Categories
const muralCategories = [
  'traditional-and-cultural-nepali-design',
  'national-and-cultural',
  'abstract-design',
  'religious',
  'beauty-and-parlor', 
  'Gym',
  '3d-mural',
  'beach-and-underwater',
  'birds-and-animals',
  'ceiling',
  'hotel-and-restaurant',
  'luxurious',
  'music-and-bar',
  'nature',
];

const canvasCategories = [
  'national-and-cultural',
  'religious',
  'birds-and-animals',
  'ganesh',
  'music-and-beauty',
  'nature',
  'arts-and-painting',
  'buddha',
  'food-and-beverage',
  'games-and-cartoon',
  'mountain',
  'sports'
];

const singleCanvasCategories = [
  'traditional-and-cultural-nepali-design',
  'religious',
];

// Use a Map for better performance
const artworkCache = new Map<string, Artwork[]>();

// Function to check if an image URL is accessible with timeout
async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

async function loadArtworkData() {
  if (artworkCache.size > 0) return; // Use cached data if available

  try {
    console.log('[ArtworkService] Loading artwork data...');
    const muralArtworks: Artwork[] = [];
    const canvasArtworks: Artwork[] = [];
    const singleCanvasArtworks: Artwork[] = [];

    // Load MURALS
    for (const subcategory of muralCategories) {
      try {
        const csvPath = `/data/murals/${subcategory}.csv`;
        console.log(`[ArtworkService] Loading ${csvPath}`);
        
        const response = await fetch(csvPath);
        if (!response.ok) {
          console.warn(`[ArtworkService] CSV not found: ${csvPath}`);
          continue;
        }

        const csvText = await response.text();
        const imageUrls = parseImageCSV(csvText);
        
        for (const url of imageUrls) {
          if (!url) continue;
          
          const fullUrl = url.startsWith('http') ? url : 
                         url.startsWith('/') ? url : `/${url}`;
          
          // Add to cache immediately without checking accessibility
          muralArtworks.push({
            id: `m-${subcategory}-${muralArtworks.length}`,
            title: '',
            description: '',
            imageUrl: fullUrl,
            category: 'mural',
            subcategory,
            featured: muralArtworks.length < 3
          });
        }
      } catch (e) {
        console.error(`[ArtworkService] Error loading ${subcategory}:`, e);
      }
    }

    // Load 5-PANEL CANVAS
    for (const subcategory of canvasCategories) {
      try {
        const csvPath = `/data/canvas/${subcategory}.csv`;
        console.log(`[ArtworkService] Loading ${csvPath}`);
        
        const response = await fetch(csvPath);
        if (!response.ok) {
          console.warn(`[ArtworkService] CSV not found: ${csvPath}`);
          continue;
        }

        const csvText = await response.text();
        const imageUrls = parseImageCSV(csvText);
        
        for (const url of imageUrls) {
          if (!url) continue;
          
          const fullUrl = url.startsWith('http') ? url : 
                         url.startsWith('/') ? url : `/${url}`;
          
          canvasArtworks.push({
            id: `c-${subcategory}-${canvasArtworks.length}`,
            title: '',
            description: '',
            imageUrl: fullUrl,
            category: 'canvas',
            subcategory,
            featured: canvasArtworks.length < 3
          });
        }
      } catch (e) {
        console.error(`[ArtworkService] Error loading ${subcategory}:`, e);
      }
    }

    // Load SINGLE PANEL CANVAS
    for (const subcategory of singleCanvasCategories) {
      try {
        const csvPath = `/data/single-canvas/${subcategory}.csv`;
        console.log(`[ArtworkService] Loading ${csvPath}`);
        
        const response = await fetch(csvPath);
        if (!response.ok) {
          console.warn(`[ArtworkService] CSV not found: ${csvPath}`);
          continue;
        }

        const csvText = await response.text();
        const imageUrls = parseImageCSV(csvText);
        
        for (const url of imageUrls) {
          if (!url) continue;
          
          const fullUrl = url.startsWith('http') ? url : 
                         url.startsWith('/') ? url : `/${url}`;
          
          singleCanvasArtworks.push({
            id: `sc-${subcategory}-${singleCanvasArtworks.length}`,
            title: '',
            description: '',
            imageUrl: fullUrl,
            category: 'single-canvas',
            subcategory,
            featured: singleCanvasArtworks.length < 3
          });
        }
      } catch (e) {
        console.error(`[ArtworkService] Error loading ${subcategory}:`, e);
      }
    }

    // Cache the results
    artworkCache.set('murals', muralArtworks);
    artworkCache.set('canvas', canvasArtworks);
    artworkCache.set('single-canvas', singleCanvasArtworks);

    console.log('[ArtworkService] Loaded artworks:', 
      muralArtworks.length + canvasArtworks.length + singleCanvasArtworks.length
    );
  } catch (error) {
    console.error('[ArtworkService] Initialization failed:', error);
  }
}

function parseImageCSV(csvText: string): string[] {
  return csvText
    .split('\n')
    .slice(1) // Skip header
    .map(line => {
      // Extract URL even if quoted or has commas
      const match = line.match(/(?:https?:\/\/[^\s,]+)|(?:"([^"]+)")|([^,\s]+)/);
      return match?.[0]?.trim() || '';
    })
    .filter(url => url.length > 0);
}

// Initialize
loadArtworkData();

// Service functions with improved caching
export const getMuralCategories = async (): Promise<string[]> => {
  return Promise.resolve([...muralCategories]);
};

export const getCanvasCategories = async (): Promise<string[]> => {
  return Promise.resolve([...canvasCategories]);
};

export const getSingleCanvasCategories = async (): Promise<string[]> => {
  return Promise.resolve([...singleCanvasCategories]);
};

export const getMuralArtworks = async (): Promise<Artwork[]> => {
  await loadArtworkData();
  return Promise.resolve(artworkCache.get('murals') || []);
};

export const getCanvasArtworks = async (): Promise<Artwork[]> => {
  await loadArtworkData();
  return Promise.resolve(artworkCache.get('canvas') || []);
};

export const getSingleCanvasArtworks = async (): Promise<Artwork[]> => {
  await loadArtworkData();
  return Promise.resolve(artworkCache.get('single-canvas') || []);
};

export const getHighlightedArtworks = async (): Promise<Artwork[]> => {
  await loadArtworkData(); 
  const allArtworks = [
    ...(artworkCache.get('murals') || []),
    ...(artworkCache.get('canvas') || []),
    ...(artworkCache.get('single-canvas') || [])
  ];
  return Promise.resolve(allArtworks.filter(a => a.featured));
};