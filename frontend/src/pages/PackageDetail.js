import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PackageDetail = () => {
  const { id } = useParams();

  const { data: pkg, isLoading } = useQuery(['package', id], () => packagesAPI.getById(id));

  if (isLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{pkg.name}</h1>
      <img src={pkg.primaryImage} alt={pkg.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <p className="text-gray-600 mb-4">{pkg.description}</p>
      <div className="text-lg text-primary-600 font-semibold">
        Price: ${pkg.currentPrice} {pkg.pricing.perPerson && <span>/person</span>}
      </div>
      <div className="mt-4">
        <strong>Duration:</strong> {pkg.duration} days
      </div>
      <div className="mt-4">
        <strong>Included Destinations:</strong>
        <ul className="list-disc ml-6">
          {pkg.destinations.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PackageDetail;
