import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-serif font-bold text-indigo-900 mb-6">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. It may have been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 transition-colors"
        >
          <Home size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;