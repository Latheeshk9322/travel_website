const { sequelize } = require('../server');
const User = require('../models/User');
const Place = require('../models/Place');
const Package = require('../models/Package');
const Review = require('../models/Review');

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

    // Sample places in India - Expanded list
    const places = await Place.bulkCreate([
      // Karnataka Places
      {
        name: 'Mysore Palace',
        description: 'The magnificent palace of the Wadiyar dynasty, a stunning example of Indo-Saracenic architecture.',
        shortDescription: 'Experience the grandeur of Karnataka\'s royal heritage.',
        location: 'Mysore, Karnataka',
        country: 'India',
        city: 'Mysore',
        category: 'cultural',
        rating: 4.7,
        averageRating: 4.7,
        totalReviews: 2100,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Hampi Ruins',
        description: 'Ancient ruins of the Vijayanagara Empire, a UNESCO World Heritage site.',
        shortDescription: 'Explore the fascinating ruins of a once-great empire.',
        location: 'Hampi, Karnataka',
        country: 'India',
        city: 'Hampi',
        category: 'cultural',
        rating: 4.6,
        averageRating: 4.6,
        totalReviews: 1800,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Coorg Coffee Estates',
        description: 'Scenic hill station known for coffee plantations and misty mountains.',
        shortDescription: 'Discover the coffee capital of India in the Western Ghats.',
        location: 'Coorg, Karnataka',
        country: 'India',
        city: 'Madikeri',
        category: 'nature',
        rating: 4.5,
        averageRating: 4.5,
        totalReviews: 1500,
        primaryImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Gokarna Beaches',
        description: 'Pristine beaches and spiritual vibes in this coastal town.',
        shortDescription: 'Peaceful beaches and spiritual experiences in coastal Karnataka.',
        location: 'Gokarna, Karnataka',
        country: 'India',
        city: 'Gokarna',
        category: 'beach',
        rating: 4.4,
        averageRating: 4.4,
        totalReviews: 1200,
        primaryImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Maharashtra Places
      {
        name: 'Gateway of India',
        description: 'Iconic monument and popular tourist attraction in Mumbai.',
        shortDescription: 'The grand entrance to Mumbai and symbol of the city.',
        location: 'Mumbai, Maharashtra',
        country: 'India',
        city: 'Mumbai',
        category: 'cultural',
        rating: 4.3,
        averageRating: 4.3,
        totalReviews: 3000,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Ajanta Caves',
        description: 'Ancient Buddhist cave monuments with stunning rock-cut architecture.',
        shortDescription: 'Marvel at ancient Buddhist art and architecture.',
        location: 'Aurangabad, Maharashtra',
        country: 'India',
        city: 'Aurangabad',
        category: 'cultural',
        rating: 4.6,
        averageRating: 4.6,
        totalReviews: 1400,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Lonavala Hills',
        description: 'Popular hill station with scenic viewpoints and adventure activities.',
        shortDescription: 'Escape to the scenic Western Ghats near Mumbai.',
        location: 'Lonavala, Maharashtra',
        country: 'India',
        city: 'Lonavala',
        category: 'nature',
        rating: 4.4,
        averageRating: 4.4,
        totalReviews: 1600,
        primaryImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Tamil Nadu Places
      {
        name: 'Meenakshi Temple',
        description: 'Magnificent temple complex dedicated to Goddess Meenakshi in Madurai.',
        shortDescription: 'Experience the grandeur of South Indian temple architecture.',
        location: 'Madurai, Tamil Nadu',
        country: 'India',
        city: 'Madurai',
        category: 'cultural',
        rating: 4.7,
        averageRating: 4.7,
        totalReviews: 2200,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Ooty Hill Station',
        description: 'Queen of Hill Stations with tea gardens and colonial charm.',
        shortDescription: 'Discover the colonial charm of the Nilgiri Hills.',
        location: 'Ooty, Tamil Nadu',
        country: 'India',
        city: 'Ooty',
        category: 'nature',
        rating: 4.5,
        averageRating: 4.5,
        totalReviews: 1800,
        primaryImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Mahabalipuram Shore Temple',
        description: 'Ancient temple complex by the sea, a UNESCO World Heritage site.',
        shortDescription: 'Ancient temples by the Bay of Bengal.',
        location: 'Mahabalipuram, Tamil Nadu',
        country: 'India',
        city: 'Mahabalipuram',
        category: 'cultural',
        rating: 4.4,
        averageRating: 4.4,
        totalReviews: 1200,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Kerala Places
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
        primaryImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Munnar Tea Gardens',
        description: 'Rolling hills covered with tea plantations in the Western Ghats.',
        shortDescription: 'Experience the beauty of tea country in Kerala.',
        location: 'Munnar, Kerala',
        country: 'India',
        city: 'Munnar',
        category: 'nature',
        rating: 4.5,
        averageRating: 4.5,
        totalReviews: 1400,
        primaryImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Kovalam Beach',
        description: 'Famous beach destination with crescent-shaped beaches and Ayurvedic resorts.',
        shortDescription: 'Relax on the pristine beaches of Kerala.',
        location: 'Kovalam, Kerala',
        country: 'India',
        city: 'Kovalam',
        category: 'beach',
        rating: 4.3,
        averageRating: 4.3,
        totalReviews: 1000,
        primaryImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Rajasthan Places
      {
        name: 'Jaipur Palace',
        description: 'The Pink City\'s magnificent palace complex showcasing Rajput architecture.',
        shortDescription: 'Explore the royal heritage of Rajasthan\'s Pink City.',
        location: 'Jaipur, Rajasthan',
        country: 'India',
        city: 'Jaipur',
        category: 'cultural',
        rating: 4.4,
        averageRating: 4.4,
        totalReviews: 1600,
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Jaisalmer Fort',
        description: 'Golden Fort rising from the Thar Desert, a living fort with shops and hotels.',
        shortDescription: 'Experience the magic of the Golden City in the desert.',
        location: 'Jaisalmer, Rajasthan',
        country: 'India',
        city: 'Jaisalmer',
        category: 'cultural',
        rating: 4.6,
        averageRating: 4.6,
        totalReviews: 1100,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },
      {
        name: 'Udaipur Lake Palace',
        description: 'Floating palace in the middle of Lake Pichola, epitome of luxury.',
        shortDescription: 'Experience luxury in the Venice of the East.',
        location: 'Udaipur, Rajasthan',
        country: 'India',
        city: 'Udaipur',
        category: 'cultural',
        rating: 4.8,
        averageRating: 4.8,
        totalReviews: 800,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Uttar Pradesh Places
      {
        name: 'Taj Mahal',
        description: 'The iconic white marble mausoleum in Agra, a UNESCO World Heritage site and one of the Seven Wonders of the World.',
        shortDescription: 'Experience the eternal symbol of love in all its grandeur.',
        location: 'Agra, Uttar Pradesh',
        country: 'India',
        city: 'Agra',
        category: 'cultural',
        rating: 4.8,
        averageRating: 4.8,
        totalReviews: 2500,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
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
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Goa Places
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
        primaryImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      },

      // Uttarakhand Places
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
        primaryImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop&crop=entropy',
        featured: true,
        isActive: true
      }
    ]);

    console.log('Places created:', places.length);

    // Create packages with location-based pricing and place relationships
    const packages = await Package.bulkCreate([
      // Sample packages would go here
    ]);

    console.log('Packages created:', packages.length);

    // Create sample reviews for places and packages
    const reviews = await Review.bulkCreate([
      // Sample reviews would go here
    ]);

    console.log('Reviews created:', reviews.length);
    console.log('Sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData(); 