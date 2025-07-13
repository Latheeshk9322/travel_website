import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI, placesAPI } from '../services/api';
import { Star, Calendar, Users, Search, Grid, List, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatINRSimple } from '../utils/currencyFormatter';
import { getUserLocation, getLocationDisplayName } from '../utils/locationDetector';

const Packages = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const placeId = params.get('placeId');
  const [userLocation, setUserLocation] = useState('Karnataka');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Get user location on component mount
  useEffect(() => {
    const location = getUserLocation();
    setUserLocation(location);
  }, []);

  const getFilters = () => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') clean[key] = value;
    });
    return clean;
  };

  // Get place details if placeId is provided
  const { data: placeData } = useQuery(
    ['place', placeId],
    () => placesAPI.getById(placeId),
    { enabled: !!placeId }
  );

  // Get place packages if placeId is provided
  const { data: placePackagesData } = useQuery(
    ['place-packages', placeId, userLocation],
    () => placesAPI.getPackages(placeId, userLocation),
    { enabled: !!placeId }
  );

  // Get all packages or place-specific packages
  const { data: packagesData, isLoading, error } = useQuery(
    ['packages', filters, currentPage, placeId, userLocation],
    () => packagesAPI.getAll({ 
      ...getFilters(), 
      ...(placeId ? { placeId } : {}), 
      page: currentPage, 
      limit: 12,
      location: userLocation
    }),
    { enabled: !placeId } // Only fetch all packages if no placeId
  );

  // Use place packages if available, otherwise use all packages
  const displayData = placeId ? placePackagesData : packagesData;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      duration: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Packages</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {placeId && placeData ? (
            <div>
              <div className="flex items-center mb-4">
                <Link to="/places" className="text-blue-600 hover:text-blue-700 mr-2">
                  ← Back to Places
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Packages for {placeData.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{placeData.city}, {placeData.country}</span>
              </div>
              <p className="text-gray-600">
                Discover amazing travel experiences in {placeData.name}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Showing prices for: <span className="font-medium">{getLocationDisplayName(userLocation)}</span>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Packages</h1>
              <p className="text-gray-600">
                Discover curated travel experiences and adventures
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Showing prices for: <span className="font-medium">{getLocationDisplayName(userLocation)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="beach">Beach</option>
                <option value="city">City</option>
                <option value="nature">Nature</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="input"
              >
                <option value="">Any Duration</option>
                <option value="1-3">1-3 days</option>
                <option value="4-7">4-7 days</option>
                <option value="8-14">8-14 days</option>
                <option value="15+">15+ days</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input"
              />
            </div>

            {/* Max Price */}
            <div>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input"
              />
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
                className="input"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear all filters
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                Showing {displayData?.packages?.length || 0} of {displayData?.total || 0} packages
                {placeId && placeData && (
                  <span className="text-blue-600 ml-2">for {placeData.name}</span>
                )}
                {!displayData && <span className="text-orange-500 ml-2">(Using sample data)</span>}
              </p>
            </div>

            {/* Packages Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayData?.packages?.map((pkg) => (
                  <Link
                    key={pkg.id}
                    to={`/packages/${pkg.id}`}
                    className="card-hover group"
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={pkg.primaryImage || '/placeholder-package.jpg'}
                        alt={pkg.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="badge-primary capitalize">
                          {pkg.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {parseFloat(pkg.averageRating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">{pkg.duration} days</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{pkg.destinations.length} destinations</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary-600">
                          {formatINRSimple(pkg.currentPrice)}
                          <span className="text-sm font-normal text-gray-500">
                            {pkg.pricing.perPerson ? ' /person' : ''}
                          </span>
                        </div>
                        {pkg.originalPrice > pkg.currentPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatINRSimple(pkg.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayData?.packages?.map((pkg) => (
                  <Link
                    key={pkg.id}
                    to={`/packages/${pkg.id}`}
                    className="card-hover group bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-48 h-32 flex-shrink-0">
                        <img
                          src={pkg.primaryImage || '/placeholder-package.jpg'}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                              {pkg.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="text-sm">{pkg.duration} days</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span className="text-sm">{pkg.destinations.length} destinations</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {pkg.shortDescription}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {parseFloat(pkg.averageRating || 0).toFixed(1)}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-primary-600">
                              {formatINRSimple(pkg.currentPrice)}
                              <span className="text-sm font-normal text-gray-500">
                                {pkg.pricing.perPerson ? ' /person' : ''}
                              </span>
                            </div>
                            {pkg.originalPrice > pkg.currentPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatINRSimple(pkg.originalPrice)}
                              </div>
                            )}
                            <span className="badge-primary capitalize text-xs mt-2">
                              {pkg.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {displayData?.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, displayData.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(displayData.totalPages, prev + 1))}
                    disabled={currentPage === displayData.totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Packages; 