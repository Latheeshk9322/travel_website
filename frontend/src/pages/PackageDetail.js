import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { packagesAPI, bookingsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Star, Calendar, Users, Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatINRSimple } from '../utils/currencyFormatter';
import { getUserLocation, getLocationDisplayName } from '../utils/locationDetector';
import toast from 'react-hot-toast';

const PackageDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [userLocation, setUserLocation] = useState('Karnataka');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Get user location on component mount
  useEffect(() => {
    const location = getUserLocation();
    setUserLocation(location);
  }, []);

  const { data: pkg, isLoading } = useQuery(
    ['package', id, userLocation], 
    () => packagesAPI.getById(id, userLocation)
  );

  const { data: reviews, isLoading: reviewsLoading } = useQuery(
    ['package-reviews', id], 
    () => reviewsAPI.getAll({ packageId: id, limit: 10 })
  );

  // Check if user has already reviewed this package
  const userReview = reviews?.reviews?.find(review => review.userId === user?.id);

  // Booking form state
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [specialRequests, setSpecialRequests] = useState('');
  const [booking, setBooking] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Review mutations
  const createReviewMutation = useMutation(
    (reviewData) => reviewsAPI.create({ ...reviewData, packageId: id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['package-reviews']);
        queryClient.invalidateQueries(['package', id]);
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
        queryClient.invalidateQueries(['package-reviews']);
        queryClient.invalidateQueries(['package', id]);
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
        queryClient.invalidateQueries(['package-reviews']);
        queryClient.invalidateQueries(['package', id]);
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

  const handleReviewSubmit = (e) => {
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

  if (isLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!contactInfo.name.trim()) {
      toast.error('Contact name is required');
      return;
    }
    
    if (!contactInfo.email.trim()) {
      toast.error('Contact email is required');
      return;
    }
    
    if (!contactInfo.phone.trim()) {
      toast.error('Contact phone is required');
      return;
    }
    
    // Validate phone number (Indian mobile number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contactInfo.phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    
    if (!travelDate) {
      toast.error('Travel date is required');
      return;
    }
    
    // Check if travel date is in the future
    const selectedDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      toast.error('Travel date must be in the future');
      return;
    }
    
    setIsBooking(true);
    try {
      const data = {
        packageId: pkg.id,
        numberOfPeople,
        travelDate,
        contactInfo,
        specialRequests,
      };
      console.log('Submitting booking data:', data);
      const result = await bookingsAPI.createBooking(data);
      setBooking(result.booking);
      toast.success('Booking created! Please proceed to payment.');
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.errors?.[0]?.msg ||
                          'Booking failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  const handleStripePayment = async () => {
    setIsPaying(true);
    try {
      // Create Stripe payment intent
      const paymentIntent = await bookingsAPI.createStripePaymentIntent(booking.id);
      
      // Redirect to Stripe Checkout
      window.location.href = paymentIntent.checkoutUrl;
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment initiation failed');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Package Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{pkg.name}</h1>
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-1 text-yellow-400 fill-current" />
            <span>{parseFloat(pkg.averageRating || 0).toFixed(1)} ({pkg.totalReviews || 0} reviews)</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-1" />
            <span>{pkg.duration} days</span>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-1" />
            <span>{pkg.destinations?.length || 0} destinations</span>
          </div>
        </div>
        <img 
          src={pkg.primaryImage} 
          alt={pkg.name} 
          className="w-full h-96 object-cover rounded-lg mb-6" 
        />
        <p className="text-gray-700 text-lg leading-relaxed mb-6">{pkg.description}</p>
        
        {/* Location-based pricing indicator */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            <span className="font-medium">Pricing for:</span> {getLocationDisplayName(userLocation)}
            {pkg.locationBasedPricing && pkg.locationBasedPricing[userLocation] && (
              <span className="ml-2 text-xs">
                (Multiplier: {pkg.locationBasedPricing[userLocation]}x)
              </span>
            )}
          </div>
        </div>
        
        <div className="text-2xl text-primary-600 font-semibold mb-4">
          Price: {formatINRSimple(pkg.currentPrice)} {pkg.pricing?.perPerson && <span>/person</span>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Details</h3>
            <div className="space-y-2 text-gray-600">
              <div><strong>Duration:</strong> {pkg.duration} days</div>
              <div><strong>Category:</strong> <span className="capitalize">{pkg.category}</span></div>
              <div><strong>Total Reviews:</strong> {pkg.totalReviews || 0}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Included Destinations</h3>
            <ul className="list-disc ml-6 text-gray-600">
              {pkg.destinations?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
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
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
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
            <p className="text-gray-600">No reviews yet. Be the first to review this package!</p>
          </div>
        )}
      </div>

      {/* Admin Notice */}
      {isAdmin && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Admin Notice</h3>
          <p className="text-blue-700">
            As an admin, you can manage this package from the admin dashboard. 
            Booking functionality is disabled for admin users.
          </p>
          <div className="mt-3">
            <a 
              href="/admin/packages" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Package Management →
            </a>
          </div>
        </div>
      )}

      {/* Booking Form - Only for regular users */}
      {!isAdmin && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Book this Package</h2>
          
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Please login to book this package</p>
              <a href="/login" className="btn-primary px-6 py-2 rounded text-white font-semibold">
                Login to Book
              </a>
            </div>
          ) : booking ? (
            <div>
              <div className="mb-4">
                <div><strong>Booking Number:</strong> {booking.bookingNumber}</div>
                <div><strong>Status:</strong> {booking.status}</div>
                <div><strong>Payment Status:</strong> {booking.paymentStatus}</div>
                <div><strong>Total Amount:</strong> {formatINRSimple(booking.finalAmount)}</div>
              </div>
              {booking.paymentStatus !== 'paid' && (
                <button
                  className="btn-primary px-6 py-2 rounded text-white font-semibold"
                  onClick={handleStripePayment}
                  disabled={isPaying}
                >
                  {isPaying ? 'Processing...' : 'Pay with Stripe'}
                </button>
              )}
              {booking.paymentStatus === 'paid' && (
                <div className="text-green-600 font-semibold mt-4">Payment completed! Your booking is confirmed.</div>
              )}
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Number of People</label>
                <input
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={e => setNumberOfPeople(Number(e.target.value))}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={e => setTravelDate(e.target.value)}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })}
                  className="input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="input"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={e => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    // Limit to 10 digits
                    if (value.length <= 10) {
                      setContactInfo({ ...contactInfo, phone: value });
                    }
                  }}
                  className="input"
                  placeholder="Enter 10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  maxLength="10"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Enter a valid 10-digit Indian mobile number</p>
              </div>
              <div>
                <label className="block font-medium mb-1">Special Requests</label>
                <textarea
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="input"
                  rows={2}
                  placeholder="Any special requests?"
                />
              </div>
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded text-white font-semibold"
                disabled={isBooking}
              >
                {isBooking ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageDetail;
