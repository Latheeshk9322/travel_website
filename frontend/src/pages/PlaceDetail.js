import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { placesAPI, packagesAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Calendar, Users, Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatINRSimple } from '../utils/currencyFormatter';
import toast from 'react-hot-toast';

const PlaceDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const { data: place, isLoading: placeLoading } = useQuery(['place', id], () => placesAPI.getById(id));
  const { data: packages, isLoading: packagesLoading } = useQuery(['packages-by-place', id], () =>
    packagesAPI.getAll({ placeId: id, limit: 6 })
  );
  const { data: reviews, isLoading: reviewsLoading } = useQuery(['place-reviews', id], () =>
    reviewsAPI.getAll({ placeId: id, limit: 10 })
  );

  // Check if user has already reviewed this place
  const userReview = reviews?.reviews?.find(review => review.userId === user?.id);

  // Mutations
  const createReviewMutation = useMutation(
    (reviewData) => reviewsAPI.create({ ...reviewData, placeId: id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['place-reviews']);
        queryClient.invalidateQueries(['place', id]);
        toast.success('Review submitted successfully!');
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      }
    }
  );

  const updateReviewMutation = useMutation(
    ({ reviewId, reviewData }) => reviewsAPI.update(reviewId, reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['place-reviews']);
        queryClient.invalidateQueries(['place', id]);
        toast.success('Review updated successfully!');
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update review');
      }
    }
  );

  const deleteReviewMutation = useMutation(
    (reviewId) => reviewsAPI.delete(reviewId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['place-reviews']);
        queryClient.invalidateQueries(['place', id]);
        toast.success('Review deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete review');
      }
    }
  );

  const resetForm = () => {
    setReviewForm({
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

    const reviewData = {
      ...reviewForm,
      rating: parseInt(reviewForm.rating)
    };

    if (editingReview) {
      updateReviewMutation.mutate({ reviewId: editingReview.id, reviewData });
    } else {
      createReviewMutation.mutate(reviewData);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewForm({
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

  if (placeLoading || packagesLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Place Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{place.name}</h1>
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-1" />
            <span>{place.city}, {place.country}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-1 text-yellow-400 fill-current" />
            <span>{parseFloat(place.averageRating || 0).toFixed(1)} ({place.totalReviews} reviews)</span>
          </div>
        </div>
        <img 
          src={place.primaryImage} 
          alt={place.name} 
          className="w-full h-96 object-cover rounded-lg mb-6" 
        />
        <p className="text-gray-700 text-lg leading-relaxed">{place.description}</p>
      </div>

      {/* Reviews Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
          {isAuthenticated && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : reviews?.reviews?.length > 0 ? (
          <div className="space-y-6">
            {reviews.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {user?.id === review.userId && (
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
                  )}
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

                <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.helpful > 0 && (
                  <div className="text-sm text-gray-500">
                    {review.helpful} people found this helpful
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews yet. Be the first to review this place!</p>
          </div>
        )}
      </div>

      {/* Available Packages */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Available Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages?.packages?.map(pkg => (
            <Link to={`/packages/${pkg.id}`} key={pkg.id} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img 
                    src={pkg.primaryImage} 
                    alt={pkg.name} 
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
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
                      <span className="text-sm">{pkg.destinations?.length || 0} destinations</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {pkg.shortDescription}
                  </p>
                  <div className="text-xl font-bold text-primary-600">
                    {formatINRSimple(pkg.currentPrice)}
                    <span className="text-sm font-normal text-gray-500">
                      {pkg.pricing?.perPerson ? ' /person' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
