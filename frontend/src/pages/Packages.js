import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI, placesAPI } from '../services/api';
import { Star, Calendar, Users, Search, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatINRSimple } from '../utils/currencyFormatter';
import { getUserLocation } from '../utils/locationDetector';
// Add more imports as needed

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
  const [itemsPerPage] = useState(12);
  const [showAllFilters, setShowAllFilters] = useState(false);

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
  )

  // Get all packages or place-specific packages
  const { data: packagesData, isLoading, error } = useQuery(
    ['packages', filters, currentPage, placeId, userLocation],
    () => packagesAPI.getAll({ 
      ...getFilters(), 
      ...(placeId ? { placeId } : {}), 
      page: currentPage, 
      limit: itemsPerPage,
      location: userLocation
    }),
    { enabled: !placeId } // Only fetch all packages if no placeId
  );

  // Use place packages if available, otherwise use all packages
  const displayData = placeId ? placePackagesData : packagesData;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
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

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMorePages = displayData && currentPage < displayData.totalPages;

  // Add a mapping from package names to local image files
  const packageImageMap = {
    ajanta_ellora_heritage: '/images/packages/ajanta_ellora_heritage.jpg',
    coorg_coffee_trail: '/images/packages/coorg_coffee_trail.jpg',
    goa_beach_paradise: '/images/packages/goa_beach_paradise.jpg',
    gokarna_beach_retreat: '/images/packages/gokarna_beach_retreat.jpg',
    golden_triangle_tour: '/images/packages/golden_triangle_tour.jpg',
    hampi_heritage_walk: '/images/packages/hampi_heritage_walk.jpg',
    jaisalmer_desert_safari: '/images/packages/jaisalmer_desert_safari.avif',
    kerala_backwaters_cruise: '/images/packages/kerala_backwaters_cruise.jpg',
    luxury_rajasthan_tour: '/images/packages/luxury_rajasthan_tour.jpg',
    madurai_temple_tour: '/images/packages/madurai_temple_tour.avif',
    mumbai_city_explorer: '/images/packages/mumbai_city_explorer.jpg',
    kudla: '/images/packages/kudla.jpg',
    mysore_heritage_tour: '/images/packages/mysore_heritage_tour.jpg',
    varanasi_spiritual_journey: '/images/packages/varanasi_spiritual_journey.jpg',
    munnar_tea_experience: '/images/packages/munnar_tea_experience.jpg',
    ooty_tea_gardens: '/images/packages/ooty_tea_gardens.avif',
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
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {placeId && placeData ? `Packages for ${placeData.name}` : 'Travel Packages'}
        </h1>
        <p className="text-gray-600">
          {placeId && placeData 
            ? `Discover amazing travel experiences in ${placeData.name}`
            : 'Explore curated travel experiences and book your next adventure'
          }
        </p>
        {placeId && placeData && (
          <div className="mt-4">
            <Link
              to="/packages"
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              ← View All Packages
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search packages..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

          {/* Duration */}
          <div>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Any Duration</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="8-14">8-14 days</option>
              <option value="15+">15+ days</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
          >
            {showAllFilters ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Advanced Filters</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show Advanced Filters</span>
              </>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAllFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="duration-asc">Shortest Duration</option>
                  <option value="duration-desc">Longest Duration</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
      {isLoading && currentPage === 1 ? (
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
                      src={packageImageMap[pkg.name.toLowerCase().replace(/\s/g, '_')] || ''}
                      alt={pkg.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
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
                        <span className="text-sm">{pkg.destinations?.length || 0} destinations</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-primary-600">
                        {formatINRSimple(pkg.currentPrice)}
                        <span className="text-sm font-normal text-gray-500">
                          {pkg.pricing?.perPerson ? ' /person' : ''}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {pkg.totalReviews || 0} reviews
                      </div>
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
                  className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={packageImageMap[pkg.name.toLowerCase().replace(/\s/g, '_')] || ''}
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
                              <span className="text-sm">{pkg.destinations?.length || 0} destinations</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                              <span className="text-sm">{parseFloat(pkg.averageRating || 0).toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {pkg.shortDescription}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-primary-600 mb-1">
                            {formatINRSimple(pkg.currentPrice)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pkg.pricing?.perPerson ? 'per person' : 'total'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMorePages && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="btn-primary inline-flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>See More Packages</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* No More Results */}
          {/* {!hasMorePages && displayData?.packages?.length > 0 && (
            <div className="text-center mt-8 py-4">
              <p className="text-gray-500">You've seen all available packages!</p>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default Packages; 