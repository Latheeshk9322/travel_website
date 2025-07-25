import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { placesAPI, packagesAPI } from '../services/api';
import { ArrowRight, Star, MapPin, Calendar, Users } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatINRSimple } from '../utils/currencyFormatter';

const Home = () => {
  const { data: featuredPlaces, isLoading: placesLoading } = useQuery(
    'featured-places',
    () => placesAPI.getFeatured()
  );

  const { data: featuredPackages, isLoading: packagesLoading } = useQuery(
    'featured-packages',
    () => packagesAPI.getFeatured()
  );

  // Add a mapping from place names to local image files
  const placeImageMap = {
    'Taj Mahal': '/images/taj-mahal.jpg',
    'Goa Beaches': '/images/goa-beach.jpg',
    'Kerala Backwaters': '/images/kerala-backwaters.jpg',
    'Udaipur Lake Palace': '/images/udaipur-palace.jpg',
    'Rishikesh Adventure': '/images/rishikesh-adventure.jpg',
    'Meenakshi Temple': '/images/meenakshi-temple.jpg',
    'Mysore Palace': '/images/mysore-palace.jpg',
    'Ajanta Caves': '/images/ajanta-caves.jpg',
    // Add more mappings as needed
  };

  // Add a mapping from package names to local image files
  const packageImageMap = {
    'Mysore Heritage Tour': '/images/mysore-heritage.jpg',
    'Hampi Heritage Walk': '/images/hampi-heritage.jpg',
    'Coorg Coffee Trail': '/images/coorg-coffee.jpg',
    'Gokarna Beach Retreat': '/images/gokarna-beach.jpg',
    'Mumbai City Explorer': '/images/mumbai-city.jpg',
    'Ajanta Ellora Heritage': '/images/ajanta-ellora.jpg',
    'Madurai Temple Tour': '/images/madurai-temple.jpg',
    'Ooty Tea Gardens': '/images/ooty-tea.jpg',
    'Kerala Backwaters Cruise': '/images/kerala-backwaters.jpg',
    'Munnar Tea Experience': '/images/munnar-tea.jpg',
    'Luxury Rajasthan Tour': '/images/rajasthan-luxury.jpg',
    'Jaisalmer Desert Safari': '/images/jaisalmer-desert.jpg',
    'Golden Triangle Tour': '/images/golden-triangle.jpg',
    'Varanasi Spiritual Journey': '/images/varanasi-journey.jpg',
    'Goa Beach Paradise': '/images/goa-beach.jpg',
    'Rishikesh Adventure Package': '/images/rishikesh-adventure.jpg',
    // Add more mappings as needed
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-accent-300">Destinations</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Explore the world's most beautiful places and book unforgettable travel experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/places"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Explore Places
              </Link>
              <Link
                to="/packages"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Places */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover handpicked destinations that will inspire your next adventure
            </p>
          </div>

          {placesLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPlaces?.places?.map((place) => (
                <Link
                  key={place.id}
                  to={`/places/${place.id}`}
                  className="card-hover group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={placeImageMap[place.name] || ''}
                      alt={place.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="badge-primary capitalize">
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {place.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {place.location.city}, {place.location.country}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {place.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {place.totalReviews} reviews
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/places"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All Places</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Travel Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Curated travel experiences that combine multiple destinations for the perfect trip
            </p>
          </div>

          {packagesLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages?.packages?.map((pkg) => (
                <Link
                  key={pkg.id}
                  to={`/packages/${pkg.id}`}
                  className="card-hover group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={packageImageMap[pkg.name] || ''}
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
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
                      <div className="text-2xl font-bold text-primary-600">
                        {formatINRSimple(pkg.currentPrice)}
                        <span className="text-sm font-normal text-gray-500">
                          {pkg.pricing.perPerson ? ' /person' : ''}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/packages"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered amazing destinations with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 