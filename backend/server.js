const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

// Database connection
const { Sequelize } = require('sequelize');

// Create Sequelize instance with SQLite configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'travel_app.db'),
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Export sequelize for use in models
module.exports = { sequelize };

// Test the connection and initialize models
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite database connection established successfully.');
    
    // Import models after connection is established
    const User = require('./models/User');
    const Place = require('./models/Place');
    const Package = require('./models/Package');
    const Review = require('./models/Review');
    const Booking = require('./models/Booking');

    // Set up associations
    User.hasMany(Review, { foreignKey: 'userId' });
    User.hasMany(Booking, { foreignKey: 'userId' });

    Place.hasMany(Review, { foreignKey: 'placeId' });
    Place.hasMany(Package, { foreignKey: 'placeId' }); // One place can have many packages

    Package.hasMany(Review, { foreignKey: 'packageId' });
    Package.hasMany(Booking, { foreignKey: 'packageId' });
    Package.belongsTo(Place, { foreignKey: 'placeId' }); // Package belongs to a place
    
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');
    
  } catch (error) {
    console.error('❌ SQLite database connection error:', error.message);
    console.log('Please check your database configuration');
  }
})();

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(hpp());

// Rate limiting - disabled for development
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
// app.use(limiter); // Disabled for development to prevent 'Too many requests' errors

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/places', require('./routes/places'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 