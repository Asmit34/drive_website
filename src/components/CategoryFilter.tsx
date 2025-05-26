import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        className={`px-4 py-2 rounded-md transition-colors ${
          activeCategory === 'all' 
            ? 'bg-indigo-900 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onCategoryChange('all')}
      >
        All
      </button>
      
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeCategory === category 
              ? 'bg-indigo-900 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {formatCategoryName(category)}
        </button>
      ))}
    </div>
  );
};

export const formatCategoryName = (category: string): string => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default CategoryFilter;