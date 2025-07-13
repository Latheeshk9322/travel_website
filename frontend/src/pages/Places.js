import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { placesAPI } from '../services/api';
import { Star, MapPin, Search, Grid, List } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Places = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    country: '',
    minRating: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [viewMode, setViewMode] = useState('grid');

  const getFilters = () => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') clean[key] = value;
    });
    return clean;
  };

  const { data: placesData, isLoading, error } = useQuery(
    ['places', filters],
    () => placesAPI.getAll({ ...getFilters() }),
    {
      retry: 3,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Places API Error:', error);
      }
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      country: '',
      minRating: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  // Fallback data if API fails
  const fallbackPlaces = [
    {
      id: 1,
      name: "Taj Mahal",
      category: "historical",
      location: { city: "Agra", country: "India" },
      primaryImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      shortDescription: "Experience the eternal symbol of love in all its grandeur.",
      averageRating: 4.8
    },
    {
      id: 2,
      name: "Goa Beaches",
      category: "beach",
      location: { city: "Panaji", country: "India" },
      primaryImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      shortDescription: "Sun, sand, and sea in India's party capital.",
      averageRating: 4.5
    },
    {
      id: 3,
      name: "Kerala Backwaters",
      category: "nature",
      location: { city: "Alleppey", country: "India" },
      primaryImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      shortDescription: "Cruise through the tranquil backwaters of God's Own Country.",
      averageRating: 4.6
    }
  ];

  // Use real data from API or fallback
  const displayData = placesData || { 
    places: fallbackPlaces, 
    total: fallbackPlaces.length, 
    totalPages: 1 
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Places</h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Unable to connect to the server. Please check your backend connection.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
          <p className="text-gray-600">
            Discover amazing places around the world
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search places..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
                <option value="historical">Historical</option>
                <option value="nature">Nature</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Japan">Japan</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                <option value="Greece">Greece</option>
                <option value="Peru">Peru</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Switzerland">Switzerland</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing all {displayData?.places?.length || 0} places
                {!placesData && <span className="text-orange-500 ml-2">(Using sample data)</span>}
              </p>
            </div>

            {/* Places Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayData?.places?.map((place) => (
                  <div key={place.id} className="relative">
                    <Link
                      to={`/places/${place.id}`}
                      className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={place.primaryImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'}
                          alt={place.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                            {place.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">
                              {parseFloat(place.averageRating || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                          {place.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {place.location?.city}, {place.location?.country}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {place.shortDescription}
                        </p>
                      </div>
                    </Link>
                    <div className="absolute bottom-4 right-4">
                      <Link
                        to={`/packages?placeId=${place.id}`}
                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Packages
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayData?.places?.map((place) => (
                  <Link
                    key={place.id}
                    to={`/places/${place.id}`}
                    className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="flex">
                      <div className="w-48 h-32 flex-shrink-0">
                        <img
                          src={place.primaryImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {place.name}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {place.location?.city}, {place.location?.country}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {place.shortDescription}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {parseFloat(place.averageRating || 0).toFixed(1)}
                              </span>
                            </div>
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                              {place.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}


          </>
        )}
      </div>
    </div>
  );
};

export default Places;