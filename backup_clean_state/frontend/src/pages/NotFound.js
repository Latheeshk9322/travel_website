import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">404</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 