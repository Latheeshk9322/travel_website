const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const { sequelize } = require('../server');
const User = require('../models/User');
const Place = require('../models/Place');
const Package = require('../models/Package');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database first
    await sequelize.sync({ force: true });
    console.log('🗃️ Database synced successfully');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@travelexplorer.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      address: {
        street: '123 Admin Street',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India'
      }
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'John Traveler',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      phone: '+91 9876543211',
      address: {
        street: '456 User Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    });

    console.log('👥 Users created successfully');

    // Create places
    const places = await Place.bulkCreate([
      {
        name: 'Goa Beach Paradise',
        description: 'Experience the pristine beaches, vibrant nightlife, and Portuguese heritage of Goa.',
        location: 'Goa, India',
        country: 'India',
        city: 'Panaji',
        category: 'beach',
        image: 'goa_beach.jpg',
        images: ['goa_beach.jpg', 'goa_bech.jpg'],
        coordinates: { lat: 15.2993, lng: 74.1240 },
        featured: true,
        rating: 4.5,
        isActive: true
      },
      {
        name: 'Kerala Backwaters',
        description: 'Cruise through the serene backwaters of Kerala and experience Gods Own Country.',
        location: 'Kerala, India',
        country: 'India',
        city: 'Alleppey',
        category: 'nature',
        image: 'kerala.webp',
        images: ['kerala.webp', 'kovalam.jpg'],
        coordinates: { lat: 10.8505, lng: 76.2711 },
        featured: true,
        rating: 4.7,
        isActive: true
      },
      {
        name: 'Rajasthan Heritage',
        description: 'Explore the royal palaces, forts, and rich cultural heritage of Rajasthan.',
        location: 'Rajasthan, India',
        country: 'India',
        city: 'Jaipur',
        category: 'cultural',
        image: 'jaipur.jpg',
        images: ['jaipur.jpg', 'jaislamer_fort.jpg'],
        coordinates: { lat: 27.0238, lng: 74.2179 },
        featured: true,
        rating: 4.6,
        isActive: true
      },
      {
        name: 'Hampi Heritage',
        description: 'Step back in time at the ancient ruins of Hampi, a UNESCO World Heritage Site.',
        location: 'Karnataka, India',
        country: 'India',
        city: 'Hampi',
        category: 'cultural',
        image: 'hampi.jpg',
        images: ['hampi.jpg'],
        coordinates: { lat: 15.3350, lng: 76.4600 },
        featured: false,
        rating: 4.4,
        isActive: true
      },
      {
        name: 'Coorg Coffee Estates',
        description: 'Discover the misty hills and aromatic coffee plantations of Coorg.',
        location: 'Karnataka, India',
        country: 'India',
        city: 'Madikeri',
        category: 'nature',
        image: 'coorg_estate.jpg',
        images: ['coorg_estate.jpg', 'coffee_estate.jpg'],
        coordinates: { lat: 12.3375, lng: 75.8069 },
        featured: false,
        rating: 4.3,
        isActive: true
      }
    ]);

    console.log('🏞️ Places created successfully');

    // Create packages
    const packages = await Package.bulkCreate([
      {
        name: 'Goa Beach Paradise Package',
        description: 'A complete 5-day Goa experience with beach activities, sightseeing, and nightlife.',
        shortDescription: 'Enjoy pristine beaches, water sports, and vibrant nightlife in Goa.',
        price: 15000,
        currentPrice: 12000,
        originalPrice: 15000,
        duration: 5,
        destinations: ['North Goa', 'South Goa', 'Panaji'],
        category: 'beach',
        primaryImage: 'goa_beach_paradise.jpg',
        images: ['goa_beach_paradise.jpg'],
        featured: true,
        rating: 4.5,
        averageRating: 4.5,
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Breakfast', 'Airport Transfer', 'Sightseeing'],
          excludes: ['Lunch', 'Dinner', 'Personal Expenses']
        },
        placeId: places[0].id
      },
      {
        name: 'Kerala Backwaters Cruise',
        description: 'Experience the tranquil backwaters of Kerala with houseboat stays and local cuisine.',
        shortDescription: 'Cruise through serene backwaters with houseboat accommodation.',
        price: 18000,
        currentPrice: 16000,
        originalPrice: 18000,
        duration: 4,
        destinations: ['Alleppey', 'Kumarakom', 'Cochin'],
        category: 'nature',
        primaryImage: 'kerala_backwaters_cruise.jpg',
        images: ['kerala_backwaters_cruise.jpg'],
        featured: true,
        rating: 4.7,
        averageRating: 4.7,
        pricing: {
          perPerson: true,
          includes: ['Houseboat Stay', 'All Meals', 'Transfer', 'Guide'],
          excludes: ['Airfare', 'Personal Expenses', 'Insurance']
        },
        placeId: places[1].id
      },
      {
        name: 'Golden Triangle Tour',
        description: 'Explore Delhi, Agra, and Jaipur - the golden triangle of Indian tourism.',
        shortDescription: 'Visit iconic monuments including Taj Mahal and Red Fort.',
        price: 25000,
        currentPrice: 22000,
        originalPrice: 25000,
        duration: 7,
        destinations: ['Delhi', 'Agra', 'Jaipur'],
        category: 'cultural',
        primaryImage: 'golden_triangle_tour.jpg',
        images: ['golden_triangle_tour.jpg', 'taj_mahal.jpg'],
        featured: true,
        rating: 4.6,
        averageRating: 4.6,
        pricing: {
          perPerson: true,
          includes: ['Hotel Stay', 'Breakfast', 'Transport', 'Guide', 'Monument Tickets'],
          excludes: ['Airfare', 'Lunch', 'Dinner', 'Personal Expenses']
        },
        placeId: places[2].id
      },
      {
        name: 'Hampi Heritage Walk',
        description: 'Discover the ancient ruins and rich history of the Vijayanagara Empire.',
        shortDescription: 'Explore UNESCO World Heritage ruins at Hampi.',
        price: 8000,
        currentPrice: 7000,
        originalPrice: 8000,
        duration: 3,
        destinations: ['Hampi', 'Hospet'],
        category: 'cultural',
        primaryImage: 'hampi_heritage_walk.jpg',
        images: ['hampi_heritage_walk.jpg'],
        featured: false,
        rating: 4.4,
        averageRating: 4.4,
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Breakfast', 'Guide', 'Entry Tickets'],
          excludes: ['Transport to Hampi', 'Meals', 'Personal Expenses']
        },
        placeId: places[3].id
      },
      {
        name: 'Coorg Coffee Trail',
        description: 'Experience the coffee culture and natural beauty of Coorg with plantation visits.',
        shortDescription: 'Coffee plantation tour with nature walks and local cuisine.',
        price: 10000,
        currentPrice: 9000,
        originalPrice: 10000,
        duration: 3,
        destinations: ['Madikeri', 'Kushalnagar', 'Abbey Falls'],
        category: 'nature',
        primaryImage: 'coorg_coffee_trail.jpg',
        images: ['coorg_coffee_trail.jpg'],
        featured: false,
        rating: 4.3,
        averageRating: 4.3,
        pricing: {
          perPerson: true,
          includes: ['Resort Stay', 'All Meals', 'Plantation Tour', 'Transport'],
          excludes: ['Airfare', 'Personal Expenses', 'Adventure Activities']
        },
        placeId: places[4].id
      }
    ]);

    console.log('📦 Packages created successfully');

    // Create sample reviews
    await Review.bulkCreate([
      {
        userId: regularUser.id,
        packageId: packages[0].id,
        placeId: places[0].id,
        rating: 5,
        title: 'Amazing Goa Experience!',
        comment: 'Amazing experience in Goa! The beaches were pristine and the accommodation was excellent.',
        isApproved: true,
        helpful: 12
      },
      {
        userId: regularUser.id,
        packageId: packages[1].id,
        placeId: places[1].id,
        rating: 5,
        title: 'Magical Backwater Cruise',
        comment: 'The backwater cruise was absolutely magical. Highly recommend this package!',
        isApproved: true,
        helpful: 8
      },
      {
        userId: adminUser.id,
        packageId: packages[2].id,
        placeId: places[2].id,
        rating: 4,
        title: 'Great Historical Tour',
        comment: 'Great historical tour covering all major monuments. Guide was very knowledgeable.',
        isApproved: true,
        helpful: 15
      }
    ]);

    console.log('⭐ Reviews created successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${await User.count()}`);
    console.log(`🏞️ Places: ${await Place.count()}`);
    console.log(`📦 Packages: ${await Package.count()}`);
    console.log(`⭐ Reviews: ${await Review.count()}`);
    
    console.log('\n🔑 Admin Credentials:');
    console.log('Email: admin@travelexplorer.com');
    console.log('Password: admin123');
    
    console.log('\n🔑 User Credentials:');
    console.log('Email: john@example.com');
    console.log('Password: user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

// Run the seed function
if (require.main === module) {
  seedData();
}

module.exports = seedData; 