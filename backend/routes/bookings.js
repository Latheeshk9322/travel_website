const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { protect, admin } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = { userId: req.user.id };
    if (req.query.status) where.status = req.query.status;

    // Execute query
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: Package,
          attributes: ['id', 'name', 'primaryImage', 'duration', 'currentPrice']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, [
  body('packageId').isInt().withMessage('Package ID must be an integer'),
  body('numberOfPeople').isInt({ min: 1 }).withMessage('Number of people must be at least 1'),
  body('travelDate').isISO8601().withMessage('Travel date must be a valid date'),
  body('contactInfo').isObject().withMessage('Contact info is required'),
  body('contactInfo.name').notEmpty().withMessage('Contact name is required'),
  body('contactInfo.email').isEmail().withMessage('Contact email must be valid'),
  body('contactInfo.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Contact phone must be a valid 10-digit Indian mobile number'),
  body('specialRequests').optional().isString().withMessage('Special requests must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { packageId, numberOfPeople, travelDate, contactInfo, specialRequests } = req.body;

    // Check if package exists and is active
    const package = await Package.findByPk(packageId);
    if (!package || !package.isActive) {
      return res.status(404).json({ message: 'Package not found or inactive' });
    }

    // Calculate amounts
    const totalAmount = package.currentPrice * numberOfPeople;
    const discountAmount = 0; // Can be calculated based on seasonal discounts
    const finalAmount = totalAmount - discountAmount;

    // Generate booking number
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingNumber = `BK${timestamp}${random}`;

    // Create booking
    console.log('Creating booking with data:', {
      userId: req.user.id,
      packageId,
      bookingNumber,
      numberOfPeople,
      totalAmount,
      discountAmount,
      finalAmount,
      travelDate: new Date(travelDate),
      contactInfo,
      specialRequests
    });

    const bookingData = {
      userId: req.user.id,
      packageId,
      bookingNumber,
      numberOfPeople,
      totalAmount,
      discountAmount,
      finalAmount,
      travelDate: new Date(travelDate),
      contactInfo,
      specialRequests
    };

    console.log('Final booking data object:', bookingData);
    console.log('Booking number value:', bookingData.bookingNumber);
    console.log('Booking number type:', typeof bookingData.bookingNumber);

    const booking = await Booking.create(bookingData);

    console.log('Booking created successfully:', booking.id);

    res.status(201).json({
      success: true,
      booking,
      paymentUrl: `/api/bookings/${booking.id}/payment` // For payment gateway integration
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: Package,
          attributes: ['id', 'name', 'primaryImage', 'duration', 'currentPrice', 'description']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    await booking.update({ status: 'cancelled' });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/payment
// @desc    Process payment for booking
// @access  Private
router.post('/:id/payment', protect, [
  body('paymentMethod').isIn(['card', 'upi', 'netbanking']).withMessage('Invalid payment method'),
  body('paymentDetails').isObject().withMessage('Payment details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Simulate payment processing
    const { paymentMethod, paymentDetails } = req.body;
    
    // In a real application, integrate with payment gateway here
    // For now, simulate successful payment
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await booking.update({
      paymentStatus: 'paid',
      paymentMethod,
      paymentId,
      status: 'confirmed'
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      paymentId,
      booking
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stripe webhook to handle payment confirmations
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;
      
      try {
        const booking = await Booking.findByPk(bookingId);
        if (booking) {
          await booking.update({
            paymentStatus: 'paid',
            paymentMethod: 'card',
            paymentId: session.payment_intent,
            status: 'confirmed'
          });
          console.log(`Payment completed for booking ${bookingId}`);
        }
      } catch (error) {
        console.error('Error updating booking after payment:', error);
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Create Stripe payment intent for booking
router.post('/:id/stripe-payment-intent', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: Package,
          attributes: ['id', 'name', 'primaryImage']
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: booking.Package.name,
              images: [booking.Package.primaryImage],
            },
            unit_amount: Math.round(Number(booking.finalAmount) * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/bookings?success=true&booking_id=${booking.id}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/packages/${booking.packageId}?canceled=true`,
      metadata: {
        bookingId: booking.id.toString(),
        userId: req.user.id.toString(),
      },
      customer_email: req.user.email,
    });

    res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      bookingId: booking.id,
      amount: booking.finalAmount,
      currency: 'inr'
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ message: 'Failed to create Stripe payment session' });
  }
});

// Admin routes
// @route   GET /api/bookings/admin/all
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/admin/all', protect, admin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (req.query.status) where.status = req.query.status;

    // Execute query
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: require('../models/User'),
          attributes: ['id', 'name', 'email']
        },
        {
          model: Package,
          attributes: ['id', 'name', 'currentPrice']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/admin/:id/status
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/admin/:id/status', protect, admin, [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({ status: req.body.status });

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 