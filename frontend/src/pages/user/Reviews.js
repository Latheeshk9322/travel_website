import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { reviewsAPI, placesAPI, packagesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Star, Edit, Trash2, Plus, MapPin, Package, Calendar, User } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    placeId: '',
    packageId: '',
    rating: 5,
    title: '',
    comment: ''
  });

  // Fetch user's reviews
  const { data: reviewsData, isLoading } = useQuery(
    ['user-reviews', user?.id],
    () => reviewsAPI.getByUser(user?.id),
    { enabled: !!user?.id }
  );

  // Fetch places and packages for review form
  const { data: placesData } = useQuery(
    ['places-for-reviews'],
    () => placesAPI.getAll({ limit: 100 })
  );

  const { data: packagesData } = useQuery(
    ['packages-for-reviews'],
    () => packagesAPI.getAll({ limit: 100 })
  );

  // Mutations
  const createReviewMutation = useMutation(
    (reviewData) => reviewsAPI.create(reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-reviews']);
        toast.success('Review submitted successfully!');
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      }
    }
  );

  const updateReviewMutation = useMutation(
    ({ id, reviewData }) => reviewsAPI.update(id, reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-reviews']);
        toast.success('Review updated successfully!');
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update review');
      }
    }
  );

  const deleteReviewMutation = useMutation(
    (id) => reviewsAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-reviews']);
        toast.success('Review deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete review');
      }
    }
  );

  const resetForm = () => {
    setReviewForm({
      placeId: '',
      packageId: '',
      rating: 5,
      title: '',
      comment: ''
    });
    setEditingReview(null);
    setShowReviewForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reviewForm.title.trim()) {
      toast.error('Review title is required');
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      toast.error('Review comment is required');
      return;
    }
    
    if (!reviewForm.placeId && !reviewForm.packageId) {
      toast.error('Please select a place or package to review');
      return;
    }

    const reviewData = {
      ...reviewForm,
      rating: parseInt(reviewForm.rating)
    };

    if (editingReview) {
      updateReviewMutation.mutate({ id: editingReview.id, reviewData });
    } else {
      createReviewMutation.mutate(reviewData);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewForm({
      placeId: review.placeId || '',
      packageId: review.packageId || '',
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setShowReviewForm(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const getItemName = (review) => {
    if (review.place) return review.place.name;
    if (review.package) return review.package.name;
    return 'Unknown Item';
  };

  const getItemType = (review) => {
    if (review.place) return 'Place';
    if (review.package) return 'Package';
    return 'Unknown';
  };

  const getItemIcon = (review) => {
    if (review.place) return <MapPin className="w-4 h-4" />;
    if (review.package) return <Package className="w-4 h-4" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-600">Manage your reviews for places and packages you've visited</p>
      </div>

      {/* Add Review Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowReviewForm(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Select Place</label>
                <select
                  value={reviewForm.placeId}
                  onChange={(e) => setReviewForm({ ...reviewForm, placeId: e.target.value, packageId: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose a place...</option>
                  {placesData?.places?.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-medium mb-2">Select Package</label>
                <select
                  value={reviewForm.packageId}
                  onChange={(e) => setReviewForm({ ...reviewForm, packageId: e.target.value, placeId: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose a package...</option>
                  {packagesData?.packages?.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block font-medium mb-2">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`p-1 rounded ${
                      reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {reviewForm.rating} out of 5
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium mb-2">Review Title</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Write a brief title for your review"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block font-medium mb-2">Review Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Share your experience and recommendations..."
                maxLength={1000}
              />
              <div className="text-sm text-gray-500 mt-1">
                {reviewForm.comment.length}/1000 characters
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={createReviewMutation.isLoading || updateReviewMutation.isLoading}
                className="btn-primary"
              >
                {createReviewMutation.isLoading || updateReviewMutation.isLoading
                  ? 'Submitting...'
                  : editingReview
                  ? 'Update Review'
                  : 'Submit Review'
                }
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewsData?.reviews?.length > 0 ? (
          reviewsData.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getItemIcon(review)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getItemName(review)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getItemType(review)} • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        review.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{review.rating}/5</span>
                {review.isVerified && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Status: {review.status}</span>
                {review.helpful > 0 && (
                  <span>{review.helpful} people found this helpful</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">
              Start sharing your travel experiences by writing reviews for places and packages you've visited.
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write Your First Review</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews; 