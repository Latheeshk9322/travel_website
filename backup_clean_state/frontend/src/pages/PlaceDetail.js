import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { placesAPI, packagesAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PlaceDetail = () => {
  const { id } = useParams();

  const { data: place, isLoading: placeLoading } = useQuery(['place', id], () => placesAPI.getById(id));
  const { data: packages, isLoading: packagesLoading } = useQuery(['packages-by-place', id], () =>
    packagesAPI.getAll({ placeId: id, limit: 6 })
  );

  if (placeLoading || packagesLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
      <img src={place.primaryImage} alt={place.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <p className="text-gray-700 mb-8">{place.description}</p>

      <h2 className="text-2xl font-semibold mb-4">Available Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packages.packages.map(pkg => (
          <Link to={`/packages/${pkg.id}`} key={pkg.id} className="border rounded-lg p-4 hover:shadow">
            <img src={pkg.primaryImage} alt={pkg.name} className="h-40 w-full object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{pkg.name}</h3>
            <p className="text-sm text-gray-600">{pkg.shortDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlaceDetail;
