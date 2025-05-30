export interface Artwork {
  id: string;          // Auto-generated (can be empty if unused)
  title: string;       // Empty string allowed
  description?: string; // Optional (can omit)
  imageUrl: string;    // Only required field (from CSV's 'image' column)
  category: 'mural' | 'canvas' | 'single-canvas';
  subcategory: string;
  featured?: boolean;  // Optional
}