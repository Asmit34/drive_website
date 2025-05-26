import { Artwork } from '../types';

// Categories
const muralCategories = [
  'traditional-and-cultural-nepali-design',
  'national-and-cultural',
  'abstract-design',
  'religious',
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

let mockArtworks: Artwork[] = [];

async function loadArtworkData() {
  try {
    console.log('[ArtworkService] Loading artwork data...');

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
        
        imageUrls.forEach((url, index) => {
          if (!url) return;
          
          const fullUrl = url.startsWith('http') ? url : 
                         url.startsWith('/') ? url : `/${url}`;
          
          mockArtworks.push({
            id: `m-${subcategory}-${index}`,
            title: '',
            description: '',
            imageUrl: fullUrl,
            category: 'mural',
            subcategory,
            featured: index < 3
          });
          
          console.log(`[ArtworkService] Added mural: ${fullUrl}`);
        });
      } catch (e) {
        console.error(`[ArtworkService] Error loading ${subcategory}:`, e);
      }
    }

    // Load CANVAS
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
        
        imageUrls.forEach((url, index) => {
          if (!url) return;
          
          const fullUrl = url.startsWith('http') ? url : 
                         url.startsWith('/') ? url : `/${url}`;
          
          mockArtworks.push({
            id: `c-${subcategory}-${index}`,
            title: '',
            description: '',
            imageUrl: fullUrl,
            category: 'canvas',
            subcategory,
            featured: index < 3
          });
          
          console.log(`[ArtworkService] Added canvas: ${fullUrl}`);
        });
      } catch (e) {
        console.error(`[ArtworkService] Error loading ${subcategory}:`, e);
      }
    }

    console.log('[ArtworkService] Loaded artworks:', mockArtworks.length);
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

// Service functions
export const getMuralCategories = async (): Promise<string[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...muralCategories]), 300);
  });
};

export const getCanvasCategories = async (): Promise<string[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...canvasCategories]), 300);
  });
};

export const getMuralArtworks = async (): Promise<Artwork[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const murals = mockArtworks.filter(a => a.category === 'mural');
      console.log('[ArtworkService] Returning mural artworks:', murals.length);
      resolve([...murals]);
    }, 800);
  });
};

export const getCanvasArtworks = async (): Promise<Artwork[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const canvases = mockArtworks.filter(a => a.category === 'canvas');
      console.log('[ArtworkService] Returning canvas artworks:', canvases.length);
      resolve([...canvases]);
    }, 800);
  });
};

export const getHighlightedArtworks = async (): Promise<Artwork[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const featured = mockArtworks.filter(a => a.featured);
      console.log('[ArtworkService] Returning featured artworks:', featured.length);
      resolve([...featured]);
    }, 500);
  });
};