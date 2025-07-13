import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatINRSimple } from '../../utils/currencyFormatter';
import { Calendar, MapPin, Users, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookings = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const bookingId = searchParams.get('booking_id');

  const { data: bookingsData, isLoading, refetch } = useQuery(
    ['user-bookings'],
    () => bookingsAPI.getUserBookings(),
    {
      enabled: !!user
    }
  );

  useEffect(() => {
    if (success === 'true' && bookingId) {
      toast.success('Payment successful! Your booking is confirmed.');
      refetch();
    }
  }, [success, bookingId, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const bookings = bookingsData?.bookings || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (paymentStatus) => {
    return paymentStatus === 'paid' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">View and manage your travel bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
          <a
            href="/packages"
            className="btn-primary px-6 py-2 rounded text-white font-semibold"
          >
            Browse Packages
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={booking.Package?.primaryImage || '/placeholder-package.jpg'}
                    alt={booking.Package?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.Package?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Booking #{booking.bookingNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatINRSimple(booking.finalAmount)}
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    {getPaymentStatusIcon(booking.paymentStatus)}
                    <span className="ml-1 text-sm text-gray-500 capitalize">
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Travel: {new Date(booking.travelDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 capitalize">
                    {booking.paymentMethod || 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <div className="text-sm text-gray-500">
                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Special Requests:</h4>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings; 