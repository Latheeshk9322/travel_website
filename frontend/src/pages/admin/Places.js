import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminAPI } from '../../services/api';
import { Plus, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const PlaceForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    location: '',
    country: '',
    city: '',
    category: 'cultural',
    rating: 4.0,
    primaryImage: '',
    featured: false,
    isActive: true
  });

  const mutation = useMutation(
    (data) => adminAPI.createPlace ? adminAPI.createPlace(data) : adminAPI.createPlace(data),
    {
      onSuccess: () => {
        toast.success('Place created successfully');
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to save place');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure all required fields for the Place model are present and valid
    const payload = {
      ...formData,
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || 'cultural',
      location: formData.location || '',
      country: formData.country || '',
      city: formData.city || '',
      shortDescription: formData.shortDescription || '',
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      featured: formData.featured !== undefined ? formData.featured : false,
      primaryImage: formData.primaryImage || '',
      rating: formData.rating || 0,
    };
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input" required>
            <option value="cultural">Cultural</option>
            <option value="beach">Beach</option>
            <option value="nature">Nature</option>
            <option value="adventure">Adventure</option>
            <option value="city">City</option>
            <option value="historical">Historical</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="input" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <textarea value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="input" rows="2" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Full Description</label>
        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input" rows="4" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Primary Image URL</label>
        <input type="url" value={formData.primaryImage} onChange={e => setFormData({ ...formData, primaryImage: e.target.value })} className="input" placeholder="https://example.com/image.jpg" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="mr-2" />
          <span className="text-sm">Featured</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="mr-2" />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
        <button type="submit" className="btn-primary">Save Place</button>
      </div>
    </form>
  );
};

const Places = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: placesData, isLoading, error, refetch } = useQuery(
    ['admin-places'],
    () => adminAPI.getPlaces(),
    {
      retry: 1,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to load places');
      }
    }
  );

  const handleSuccess = () => {
    setShowAddModal(false);
    queryClient.invalidateQueries(['admin-places']);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Places</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage travel places</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Place</span>
          </button>
          <button onClick={() => refetch()} className="btn-outline flex items-center space-x-2" title="Refresh">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Places</h2>
          <p className="text-red-600 mb-4">{error.response?.data?.message || error.message || 'Failed to load places'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {placesData?.places?.map((place) => (
                  <tr key={place.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={place.primaryImage || '/placeholder-place.jpg'} alt={place.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{place.name}</div>
                          <div className="text-sm text-gray-500">{place.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{place.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{place.city}, {place.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${place.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{place.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Add Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Add New Place</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <PlaceForm onClose={() => setShowAddModal(false)} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Places; 