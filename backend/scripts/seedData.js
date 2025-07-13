const { sequelize } = require('../server');
const User = require('../models/User');
const Place = require('../models/Place');
const Package = require('../models/Package');

const seedData = async () => {
  try {
    // Sync models with database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@travelindia.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210'
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      phone: '+91-9876543211'
    });

    console.log('Users created:', { admin: adminUser.email, user: regularUser.email });

    // Sample places in India
    const places = await Place.bulkCreate([
      {
        name: 'Taj Mahal',
        description: 'The iconic white marble mausoleum in Agra, a UNESCO World Heritage site and one of the Seven Wonders of the World.',
        shortDescription: 'Experience the eternal symbol of love in all its grandeur.',
        location: 'Agra, Uttar Pradesh',
        country: 'India',
        city: 'Agra',
        category: 'historical',
        rating: 4.8,
        averageRating: 4.8,
        totalReviews: 2500,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        featured: true,
        isActive: true
      },
      {
        name: 'Goa Beaches',
        description: 'Famous for its pristine beaches, vibrant nightlife, and Portuguese colonial architecture.',
        shortDescription: 'Sun, sand, and sea in India\'s party capital.',
        location: 'Goa',
        country: 'India',
        city: 'Panaji',
        category: 'beach',
        rating: 4.5,
        averageRating: 4.5,
        totalReviews: 1800,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        featured: true,
        isActive: true
      },
      {
        name: 'Kerala Backwaters',
        description: 'Serene network of lagoons, lakes, and canals perfect for houseboat cruises.',
        shortDescription: 'Cruise through the tranquil backwaters of God\'s Own Country.',
        location: 'Kerala',
        country: 'India',
        city: 'Alleppey',
        category: 'nature',
        rating: 4.6,
        averageRating: 4.6,
        totalReviews: 1200,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        featured: true,
        isActive: true
      },
      {
        name: 'Jaipur Palace',
        description: 'The Pink City\'s magnificent palace complex showcasing Rajput architecture.',
        shortDescription: 'Explore the royal heritage of Rajasthan\'s Pink City.',
        location: 'Jaipur, Rajasthan',
        country: 'India',
        city: 'Jaipur',
        category: 'historical',
        rating: 4.4,
        averageRating: 4.4,
        totalReviews: 1600,
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800',
        featured: true,
        isActive: true
      },
      {
        name: 'Rishikesh Adventure',
        description: 'Adventure capital of India with white water rafting, yoga, and spiritual experiences.',
        shortDescription: 'Get your adrenaline fix in the yoga capital of the world.',
        location: 'Rishikesh, Uttarakhand',
        country: 'India',
        city: 'Rishikesh',
        category: 'adventure',
        rating: 4.7,
        averageRating: 4.7,
        totalReviews: 900,
        primaryImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        featured: true,
        isActive: true
      },
      {
        name: 'Varanasi Ghats',
        description: 'Spiritual capital of India with ancient ghats along the sacred Ganges River.',
        shortDescription: 'Experience the spiritual essence of India\'s holiest city.',
        location: 'Varanasi, Uttar Pradesh',
        country: 'India',
        city: 'Varanasi',
        category: 'cultural',
        rating: 4.3,
        averageRating: 4.3,
        totalReviews: 1400,
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800',
        featured: true,
        isActive: true
      }
    ]);

    console.log('Places created:', places.length);

    // Sample packages in India
    const packages = await Package.bulkCreate([
      {
        name: 'Golden Triangle Tour',
        description: 'Explore Delhi, Agra, and Jaipur - the perfect introduction to India\'s rich history.',
        shortDescription: 'Discover the heart of India through its most iconic cities.',
        price: 29999,
        currentPrice: 29999,
        originalPrice: 34999,
        duration: 7,
        destinations: ['Delhi', 'Agra', 'Jaipur'],
        category: 'cultural',
        rating: 4.6,
        averageRating: 4.6,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Transport', 'Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        isActive: true,
        featured: true
      },
      {
        name: 'Goa Beach Paradise',
        description: '7 days of relaxation on beautiful Goa beaches with luxury accommodation.',
        shortDescription: 'Unwind in paradise with this perfect beach vacation package.',
        price: 15999,
        currentPrice: 15999,
        originalPrice: 18999,
        duration: 7,
        destinations: ['Panaji', 'Calangute', 'Baga'],
        category: 'beach',
        rating: 4.5,
        averageRating: 4.5,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Airport Transfer'],
          excludes: ['Flights', 'Personal Expenses']
        },
        isActive: true,
        featured: true
      },
      {
        name: 'Kerala Backwaters Cruise',
        description: '5 days exploring the serene backwaters of Kerala on a traditional houseboat.',
        shortDescription: 'Cruise through the tranquil backwaters of God\'s Own Country.',
        price: 12999,
        currentPrice: 12999,
        originalPrice: 14999,
        duration: 5,
        destinations: ['Alleppey', 'Kumarakom', 'Kochi'],
        category: 'nature',
        rating: 4.7,
        averageRating: 4.7,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        pricing: {
          perPerson: true,
          includes: ['Houseboat', 'Meals', 'Local Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        isActive: true,
        featured: true
      },
      {
        name: 'Rishikesh Adventure Package',
        description: '6 days of thrilling adventures including white water rafting and yoga.',
        shortDescription: 'Get your adrenaline fix in the yoga capital of the world.',
        price: 8999,
        currentPrice: 8999,
        originalPrice: 10999,
        duration: 6,
        destinations: ['Rishikesh', 'Haridwar'],
        category: 'adventure',
        rating: 4.8,
        averageRating: 4.8,
        primaryImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Adventure Activities', 'Yoga Classes'],
          excludes: ['Flights', 'Meals', 'Personal Expenses']
        },
        isActive: true,
        featured: true
      },
      {
        name: 'Varanasi Spiritual Journey',
        description: '4 days immersing in the spiritual essence of India\'s holiest city.',
        shortDescription: 'Experience the spiritual essence of India\'s holiest city.',
        price: 6999,
        currentPrice: 6999,
        originalPrice: 7999,
        duration: 4,
        destinations: ['Varanasi', 'Sarnath'],
        category: 'cultural',
        rating: 4.4,
        averageRating: 4.4,
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Ganga Aarti', 'Local Guide'],
          excludes: ['Flights', 'Meals', 'Personal Expenses']
        },
        isActive: true,
        featured: true
      },
      {
        name: 'Luxury Rajasthan Tour',
        description: '10 days exploring the royal heritage of Rajasthan with luxury accommodation.',
        shortDescription: 'Experience the royal heritage of Rajasthan in luxury.',
        price: 49999,
        currentPrice: 49999,
        originalPrice: 59999,
        duration: 10,
        destinations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
        category: 'luxury',
        rating: 4.9,
        averageRating: 4.9,
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800',
        pricing: {
          perPerson: true,
          includes: ['Luxury Accommodation', 'All Meals', 'Private Transport', 'Expert Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        isActive: true,
        featured: true
      }
    ]);

    console.log('Packages created:', packages.length);
    console.log('Sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData(); 