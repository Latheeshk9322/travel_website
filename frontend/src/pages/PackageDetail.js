import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatINRSimple } from '../utils/currencyFormatter';
import { getUserLocation, getLocationDisplayName } from '../utils/locationDetector';
import toast from 'react-hot-toast';

const PackageDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState('Karnataka');

  // Get user location on component mount
  useEffect(() => {
    const location = getUserLocation();
    setUserLocation(location);
  }, []);

  const { data: pkg, isLoading } = useQuery(
    ['package', id, userLocation], 
    () => packagesAPI.getById(id, userLocation)
  );

  // Booking form state
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [specialRequests, setSpecialRequests] = useState('');
  const [booking, setBooking] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{pkg.name}</h1>
      <img src={pkg.primaryImage} alt={pkg.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <p className="text-gray-600 mb-4">{pkg.description}</p>
      
      {/* Location-based pricing indicator */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-700">
          <span className="font-medium">Pricing for:</span> {getLocationDisplayName(userLocation)}
          {pkg.locationBasedPricing && pkg.locationBasedPricing[userLocation] && (
            <span className="ml-2 text-xs">
              (Multiplier: {pkg.locationBasedPricing[userLocation]}x)
            </span>
          )}
        </div>
      </div>
      
      <div className="text-lg text-primary-600 font-semibold">
        Price: {formatINRSimple(pkg.currentPrice)} {pkg.pricing.perPerson && <span>/person</span>}
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

      {/* Admin Notice */}
      {isAdmin && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
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
