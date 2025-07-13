import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Eye, Search, Filter, Package } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatINRSimple } from '../../utils/currencyFormatter';
import toast from 'react-hot-toast';

const Packages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const queryClient = useQueryClient();

  const { data: packagesData, isLoading, error } = useQuery(
    ['admin-packages', searchTerm, categoryFilter],
    () => adminAPI.getPackages({ search: searchTerm, category: categoryFilter }),
    {
      retry: 1,
      onError: (error) => {
        console.error('Packages API Error:', error);
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => adminAPI.deletePackage(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-packages']);
        toast.success('Package deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete package');
      }
    }
  );

  const toggleFeatureMutation = useMutation(
    (id) => adminAPI.togglePackageFeature(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-packages']);
        toast.success('Package feature status updated');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update package');
      }
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleFeature = (id) => {
    toggleFeatureMutation.mutate(id);
  };

  const filteredPackages = packagesData?.packages || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Packages</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage travel packages</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredPackages.length} packages found
            </span>
          </div>
        </div>
      </div>

      {/* Packages Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Packages</h2>
          <p className="text-red-600 mb-4">
            {error.response?.data?.message || error.message || 'Failed to load packages'}
          </p>
          <div className="text-sm text-red-500">
            <p>Status: {error.response?.status}</p>
            <p>URL: {error.config?.url}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={pkg.primaryImage || '/placeholder-package.jpg'}
                          alt={pkg.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                          <div className="text-sm text-gray-500">{pkg.destinations?.length || 0} destinations</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge-primary capitalize">{pkg.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pkg.duration} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatINRSimple(pkg.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingPackage(pkg)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleFeature(pkg.id)}
                          className={`${pkg.isFeatured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-gray-600'}`}
                          title={pkg.isFeatured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPackages.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No packages found.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </h2>
            <PackageForm
              package={editingPackage}
              onClose={() => {
                setShowAddModal(false);
                setEditingPackage(null);
              }}
              onSuccess={() => {
                setShowAddModal(false);
                setEditingPackage(null);
                queryClient.invalidateQueries(['admin-packages']);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Package Form Component
const PackageForm = ({ package: pkg, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    shortDescription: pkg?.shortDescription || '',
    category: pkg?.category || 'adventure',
    duration: pkg?.duration || 1,
    currentPrice: pkg?.currentPrice || '',
    originalPrice: pkg?.originalPrice || '',
    destinations: pkg?.destinations || [],
    primaryImage: pkg?.primaryImage || '',
    isActive: pkg?.isActive ?? true,
    isFeatured: pkg?.isFeatured ?? false
  });

  const [newDestination, setNewDestination] = useState('');

  const mutation = useMutation(
    (data) => pkg ? adminAPI.updatePackage(pkg.id, data) : adminAPI.createPackage(data),
    {
      onSuccess: () => {
        toast.success(pkg ? 'Package updated successfully' : 'Package created successfully');
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to save package');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addDestination = () => {
    if (newDestination.trim()) {
      setFormData(prev => ({
        ...prev,
        destinations: [...prev.destinations, newDestination.trim()]
      }));
      setNewDestination('');
    }
  };

  const removeDestination = (index) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input"
            required
          >
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="beach">Beach</option>
            <option value="city">City</option>
            <option value="nature">Nature</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
          <input
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Price (₹)</label>
          <input
            type="number"
            min="0"
            value={formData.currentPrice}
            onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
            className="input"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          className="input"
          rows="2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL</label>
        <input
          type="url"
          value={formData.primaryImage}
          onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
          className="input"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Destinations</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            className="input flex-1"
            placeholder="Add destination"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDestination())}
          />
          <button
            type="button"
            onClick={addDestination}
            className="btn-secondary"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.destinations.map((dest, index) => (
            <span
              key={index}
              className="badge-primary flex items-center space-x-1"
            >
              <span>{dest}</span>
              <button
                type="button"
                onClick={() => removeDestination(index)}
                className="text-primary-800 hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="btn-primary"
        >
          {mutation.isLoading ? 'Saving...' : (pkg ? 'Update Package' : 'Create Package')}
        </button>
      </div>
    </form>
  );
};

export default Packages; 