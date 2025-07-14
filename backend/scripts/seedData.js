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
      // Karnataka Packages
      {
        name: 'Mysore Heritage Tour',
        description: '3 days exploring the royal heritage of Mysore including the palace, Chamundi Hills, and local markets.',
        shortDescription: 'Discover the royal heritage of Karnataka\'s cultural capital.',
        price: 2999,
        currentPrice: 2999,
        originalPrice: 3999,
        duration: 3,
        destinations: ['Mysore Palace', 'Chamundi Hills', 'Brindavan Gardens'],
        category: 'cultural',
        rating: 4.6,
        averageRating: 4.6,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&fit=crop&crop=entropy',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Local Guide', 'Transport'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Karnataka: 1.0,
          Maharashtra: 1.1,
          TamilNadu: 1.05,
          Kerala: 1.0,
          default: 1.0
        },
        placeId: places.find(p => p.name === 'Mysore Palace').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Hampi Heritage Walk',
        description: '2 days exploring the ancient ruins of Hampi with expert guides.',
        shortDescription: 'Step back in time at the Vijayanagara Empire ruins.',
        price: 1999,
        currentPrice: 1999,
        originalPrice: 2499,
        duration: 2,
        destinations: ['Virupaksha Temple', 'Vittala Temple', 'Royal Enclosure'],
        category: 'cultural',
        rating: 4.5,
        averageRating: 4.5,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Expert Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Karnataka: 1.0,
          Maharashtra: 1.1,
          TamilNadu: 1.05,
          default: 1.0
        },
        placeId: places.find(p => p.name === 'Hampi Ruins').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Coorg Coffee Trail',
        description: '4 days exploring coffee estates, waterfalls, and the misty hills of Coorg.',
        shortDescription: 'Experience the coffee culture of Karnataka\'s Scotland.',
        price: 3999,
        currentPrice: 3999,
        originalPrice: 4999,
        duration: 4,
        destinations: ['Coffee Estates', 'Abbey Falls', 'Raja\'s Seat'],
        category: 'nature',
        rating: 4.7,
        averageRating: 4.7,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        pricing: {
          perPerson: true,
          includes: ['Estate Stay', 'Coffee Tasting', 'Local Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Karnataka: 1.0,
          Maharashtra: 1.1,
          TamilNadu: 1.05,
          default: 1.0
        },
        placeId: places.find(p => p.name === 'Coorg Coffee Estates').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Gokarna Beach Retreat',
        description: '3 days of beach relaxation and spiritual experiences in Gokarna.',
        shortDescription: 'Peaceful beach getaway with spiritual vibes.',
        price: 2499,
        currentPrice: 2499,
        originalPrice: 2999,
        duration: 3,
        destinations: ['Om Beach', 'Kudle Beach', 'Mahabaleshwar Temple'],
        category: 'beach',
        rating: 4.4,
        averageRating: 4.4,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        pricing: {
          perPerson: true,
          includes: ['Beach Resort', 'Meals', 'Temple Visits'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Karnataka: 1.0,
          Maharashtra: 1.1,
          default: 1.0
        },
        placeId: places.find(p => p.name === 'Gokarna Beaches').id,
        isActive: true,
        featured: true
      },

      // Maharashtra Packages
      {
        name: 'Mumbai City Explorer',
        description: '4 days exploring the financial capital of India with local experiences.',
        shortDescription: 'Experience the energy and diversity of Maximum City.',
        price: 4999,
        currentPrice: 4999,
        originalPrice: 5999,
        duration: 4,
        destinations: ['Gateway of India', 'Marine Drive', 'Juhu Beach'],
        category: 'city',
        rating: 4.3,
        averageRating: 4.3,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        pricing: {
          perPerson: true,
          includes: ['Hotel', 'Local Transport', 'City Guide'],
          excludes: ['Flights', 'Meals', 'Personal Expenses']
        },
        locationBasedPricing: {
          Maharashtra: 1.0,
          Karnataka: 1.1,
          default: 1.1
        },
        placeId: places.find(p => p.name === 'Gateway of India').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Ajanta Ellora Heritage',
        description: '3 days exploring the ancient cave monuments of Ajanta and Ellora.',
        shortDescription: 'Marvel at ancient Buddhist and Hindu cave art.',
        price: 2999,
        currentPrice: 2999,
        originalPrice: 3999,
        duration: 3,
        destinations: ['Ajanta Caves', 'Ellora Caves', 'Daulatabad Fort'],
        category: 'cultural',
        rating: 4.6,
        averageRating: 4.6,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Expert Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Maharashtra: 1.0,
          Karnataka: 1.1,
          default: 1.05
        },
        placeId: places.find(p => p.name === 'Ajanta Caves').id,
        isActive: true,
        featured: true
      },

      // Tamil Nadu Packages
      {
        name: 'Madurai Temple Tour',
        description: '2 days exploring the magnificent Meenakshi Temple and surrounding heritage.',
        shortDescription: 'Experience the spiritual grandeur of South India.',
        price: 1999,
        currentPrice: 1999,
        originalPrice: 2499,
        duration: 2,
        destinations: ['Meenakshi Temple', 'Thirumalai Nayak Palace'],
        category: 'cultural',
        rating: 4.7,
        averageRating: 4.7,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Temple Guide', 'Meals'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          TamilNadu: 1.0,
          Karnataka: 1.05,
          Kerala: 1.0,
          default: 1.05
        },
        placeId: places.find(p => p.name === 'Meenakshi Temple').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Ooty Tea Gardens',
        description: '3 days in the Queen of Hill Stations with tea estate visits.',
        shortDescription: 'Discover the colonial charm and tea culture of Ooty.',
        price: 2999,
        currentPrice: 2999,
        originalPrice: 3999,
        duration: 3,
        destinations: ['Tea Gardens', 'Botanical Gardens', 'Doddabetta Peak'],
        category: 'nature',
        rating: 4.5,
        averageRating: 4.5,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        pricing: {
          perPerson: true,
          includes: ['Estate Stay', 'Tea Tasting', 'Local Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          TamilNadu: 1.0,
          Karnataka: 1.05,
          Kerala: 1.0,
          default: 1.05
        },
        placeId: places.find(p => p.name === 'Ooty Hill Station').id,
        isActive: true,
        featured: true
      },

      // Kerala Packages
      {
        name: 'Kerala Backwaters Cruise',
        description: '5 days exploring the serene backwaters of Kerala on a traditional houseboat.',
        shortDescription: 'Cruise through the tranquil backwaters of God\'s Own Country.',
        price: 3999,
        currentPrice: 3999,
        originalPrice: 4999,
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
        locationBasedPricing: {
          Kerala: 1.0,
          Karnataka: 1.0,
          TamilNadu: 1.0,
          default: 1.0
        },
        placeId: places.find(p => p.name === 'Kerala Backwaters').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Munnar Tea Experience',
        description: '4 days in the tea gardens of Munnar with plantation visits.',
        shortDescription: 'Experience the beauty of tea country in Kerala.',
        price: 3499,
        currentPrice: 3499,
        originalPrice: 4499,
        duration: 4,
        destinations: ['Tea Gardens', 'Eravikulam National Park', 'Mattupetty Dam'],
        category: 'nature',
        rating: 4.5,
        averageRating: 4.5,
        primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        pricing: {
          perPerson: true,
          includes: ['Plantation Stay', 'Tea Tasting', 'Local Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Kerala: 1.0,
          Karnataka: 1.0,
          TamilNadu: 1.0,
          default: 1.0
        },
        placeId: places.find(p => p.name === 'Munnar Tea Gardens').id,
        isActive: true,
        featured: true
      },

      // Rajasthan Packages
      {
        name: 'Luxury Rajasthan Tour',
        description: '10 days exploring the royal heritage of Rajasthan with luxury accommodation.',
        shortDescription: 'Experience the royal heritage of Rajasthan in luxury.',
        price: 9999,
        currentPrice: 9999,
        originalPrice: 12999,
        duration: 10,
        destinations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
        category: 'cultural',
        rating: 4.9,
        averageRating: 4.9,
        primaryImage: 'https://images.unsplash.com/photo-1553603229-0f1a5d7c0b8a?w=800',
        pricing: {
          perPerson: true,
          includes: ['Luxury Accommodation', 'All Meals', 'Private Transport', 'Expert Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Rajasthan: 1.0,
          Delhi: 1.1,
          UttarPradesh: 1.05,
          default: 1.15
        },
        placeId: places.find(p => p.name === 'Jaipur Palace').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Jaisalmer Desert Safari',
        description: '3 days exploring the golden sands of Jaisalmer with camel safaris.',
        shortDescription: 'Experience the magic of the Thar Desert.',
        price: 3999,
        currentPrice: 3999,
        originalPrice: 4999,
        duration: 3,
        destinations: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Patwon Ki Haveli'],
        category: 'adventure',
        rating: 4.6,
        averageRating: 4.6,
        primaryImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        pricing: {
          perPerson: true,
          includes: ['Desert Camp', 'Camel Safari', 'Meals'],
          excludes: ['Flights', 'Personal Expenses']
        },
        locationBasedPricing: {
          Rajasthan: 1.0,
          default: 1.15
        },
        placeId: places.find(p => p.name === 'Jaisalmer Fort').id,
        isActive: true,
        featured: true
      },

      // Uttar Pradesh Packages
      {
        name: 'Golden Triangle Tour',
        description: 'Explore Delhi, Agra, and Jaipur - the perfect introduction to India\'s rich history.',
        shortDescription: 'Discover the heart of India through its most iconic cities.',
        price: 5999,
        currentPrice: 5999,
        originalPrice: 7999,
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
        locationBasedPricing: {
          UttarPradesh: 1.0,
          Delhi: 1.1,
          Rajasthan: 1.05,
          default: 1.1
        },
        placeId: places.find(p => p.name === 'Taj Mahal').id,
        isActive: true,
        featured: true
      },
      {
        name: 'Varanasi Spiritual Journey',
        description: '4 days immersing in the spiritual essence of India\'s holiest city.',
        shortDescription: 'Experience the spiritual essence of India\'s holiest city.',
        price: 1999,
        currentPrice: 1999,
        originalPrice: 2499,
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
        locationBasedPricing: {
          UttarPradesh: 1.0,
          default: 1.1
        },
        placeId: places.find(p => p.name === 'Varanasi Ghats').id,
        isActive: true,
        featured: true
      },

      // Goa Packages
      {
        name: 'Goa Beach Paradise',
        description: '7 days of relaxation on beautiful Goa beaches with luxury accommodation.',
        shortDescription: 'Unwind in paradise with this perfect beach vacation package.',
        price: 4999,
        currentPrice: 4999,
        originalPrice: 5999,
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
        locationBasedPricing: {
          Goa: 1.0,
          Maharashtra: 1.05,
          Karnataka: 1.1,
          default: 1.1
        },
        placeId: places.find(p => p.name === 'Goa Beaches').id,
        isActive: true,
        featured: true
      },

      // Uttarakhand Packages
      {
        name: 'Rishikesh Adventure Package',
        description: '6 days of thrilling adventures including white water rafting and yoga.',
        shortDescription: 'Get your adrenaline fix in the yoga capital of the world.',
        price: 2999,
        currentPrice: 2999,
        originalPrice: 3999,
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
        locationBasedPricing: {
          Uttarakhand: 1.0,
          Delhi: 1.1,
          UttarPradesh: 1.05,
          default: 1.1
        },
        placeId: places.find(p => p.name === 'Rishikesh Adventure').id,
        isActive: true,
        featured: true
      }
    ]);

    console.log('Packages created:', packages.length);

    // Create sample reviews for places and packages
    const reviews = await Review.bulkCreate([
      // Reviews for Mysore Palace
      {
        userId: regularUser.id,
        placeId: places.find(p => p.name === 'Mysore Palace').id,
        rating: 5,
        title: 'Absolutely Magnificent!',
        comment: 'The Mysore Palace is truly a sight to behold. The architecture is stunning and the history is fascinating. The evening lighting ceremony is a must-see. Highly recommend visiting during the Dasara festival for the full experience.',
        helpful: 12,
        status: 'approved',
        isVerified: true
      },
      {
        userId: adminUser.id,
        placeId: places.find(p => p.name === 'Mysore Palace').id,
        rating: 4,
        title: 'Beautiful Heritage Site',
        comment: 'Great place to learn about Karnataka\'s royal history. The palace is well-maintained and the guided tour was informative. The gardens are also worth exploring.',
        helpful: 8,
        status: 'approved',
        isVerified: true
      },

      // Reviews for Taj Mahal
      {
        userId: regularUser.id,
        placeId: places.find(p => p.name === 'Taj Mahal').id,
        rating: 5,
        title: 'A Wonder of the World',
        comment: 'Words cannot describe the beauty of the Taj Mahal. The marble work is exquisite and the symmetry is perfect. Visit early morning for the best photos and fewer crowds.',
        helpful: 25,
        status: 'approved',
        isVerified: true
      },

      // Reviews for Kerala Backwaters
      {
        userId: adminUser.id,
        placeId: places.find(p => p.name === 'Kerala Backwaters').id,
        rating: 5,
        title: 'Peaceful Paradise',
        comment: 'The backwaters are incredibly peaceful and beautiful. The houseboat experience was luxurious and the food was amazing. Perfect for a romantic getaway.',
        helpful: 15,
        status: 'approved',
        isVerified: true
      },

      // Reviews for Packages
      {
        userId: regularUser.id,
        packageId: packages.find(p => p.name === 'Mysore Heritage Tour').id,
        rating: 4,
        title: 'Great Heritage Experience',
        comment: 'The tour was well-organized and covered all the important sites. The guide was knowledgeable and the accommodation was comfortable. Good value for money.',
        helpful: 6,
        status: 'approved',
        isVerified: true
      },
      {
        userId: adminUser.id,
        packageId: packages.find(p => p.name === 'Kerala Backwaters Cruise').id,
        rating: 5,
        title: 'Unforgettable Experience',
        comment: 'The houseboat cruise was absolutely amazing. The crew was friendly, food was delicious, and the scenery was breathtaking. Highly recommend this package.',
        helpful: 10,
        status: 'approved',
        isVerified: true
      },
      {
        userId: regularUser.id,
        packageId: packages.find(p => p.name === 'Golden Triangle Tour').id,
        rating: 4,
        title: 'Perfect Introduction to India',
        comment: 'This tour covers the essential highlights of North India. The Taj Mahal was the highlight, but Jaipur and Delhi were also fascinating. Good mix of history and culture.',
        helpful: 18,
        status: 'approved',
        isVerified: true
      }
    ]);

    console.log('Reviews created:', reviews.length);
    console.log('Sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData(); 