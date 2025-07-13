import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Package } from 'lucide-react';
import { useQuery } from 'react-query';
import { placesAPI, packagesAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('places');

  const { data: placesData } = useQuery(
    ['places', 'search', query],
    () => placesAPI.getAll({ search: query, limit: 5 }),
    { enabled: !!query && activeTab === 'places' }
  );

  const { data: packagesData } = useQuery(
    ['packages', 'search', query],
    () => packagesAPI.getAll({ search: query, limit: 5 }),
    { enabled: !!query && activeTab === 'packages' }
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Search</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search places, packages, destinations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                autoFocus
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab('places')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'places'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Places</span>
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'packages'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Packages</span>
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {!query ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Start typing to search for places and packages</p>
                </div>
              ) : activeTab === 'places' ? (
                <div>
                  {placesData?.places?.length > 0 ? (
                    <div className="space-y-3">
                      {placesData.places.map((place) => (
                        <Link
                          key={place.id}
                          to={`/places/${place.id}`}
                          onClick={onClose}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            {place.primaryImage && (
                              <img
                                src={place.primaryImage}
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{place.name}</h4>
                            <p className="text-sm text-gray-500">
                              {place.location.city}, {place.location.country}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600">
                                {place.averageRating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No places found for "{query}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {packagesData?.packages?.length > 0 ? (
                    <div className="space-y-3">
                      {packagesData.packages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          to={`/packages/${pkg.id}`}
                          onClick={onClose}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            {pkg.primaryImage && (
                              <img
                                src={pkg.primaryImage}
                                alt={pkg.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            <p className="text-sm text-gray-500">
                              {pkg.duration} days • {pkg.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-primary-600">
                              ${pkg.currentPrice}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600">
                                {pkg.averageRating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No packages found for "{query}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 