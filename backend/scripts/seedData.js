const { sequelize } = require('../server');
const User = require('../models/User');
const Place = require('../models/Place');
const Package = require('../models/Package');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    // Sync models with database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

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

    console.log('✅ Users created:', { admin: adminUser.email, user: regularUser.email });

    // Sample places in India - Reduced list
    const places = await Place.bulkCreate([
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
        primaryImage: '/images/mysore.jpg',
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
        primaryImage: '/images/hampi.jpg',
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
        primaryImage: '/images/coorg_estate.jpg',
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
        primaryImage: '/images/gokarna_beach.webp',
        featured: true,
        isActive: true
      },
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
        primaryImage: '/images/taj_mahal.jpg',
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
        primaryImage: '/images/kerala.webp',
        featured: true,
        isActive: true
      }
    ]);

    console.log('✅ Places created:', places.length);

    // Create packages with place relationships
    const packages = await Package.bulkCreate([
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
        primaryImage: '/images/packages/mysore_heritage_tour.jpg',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Local Guide', 'Transport'],
          excludes: ['Flights', 'Personal Expenses']
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
        primaryImage: '/images/packages/hampi_heritage_walk.jpg',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Expert Guide'],
          excludes: ['Flights', 'Personal Expenses']
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
        primaryImage: '/images/packages/coorg_coffee_trail.jpg',
        pricing: {
          perPerson: true,
          includes: ['Estate Stay', 'Coffee Tasting', 'Local Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        placeId: places.find(p => p.name === 'Coorg Coffee Estates').id,
        isActive: true,
        featured: true
      },
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
        primaryImage: '/images/packages/golden_triangle_tour.jpg',
        pricing: {
          perPerson: true,
          includes: ['Accommodation', 'Meals', 'Transport', 'Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        placeId: places.find(p => p.name === 'Taj Mahal').id,
        isActive: true,
        featured: true
      },
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
        primaryImage: '/images/packages/kerala_backwaters_cruise.jpg',
        pricing: {
          perPerson: true,
          includes: ['Houseboat', 'Meals', 'Local Guide'],
          excludes: ['Flights', 'Personal Expenses']
        },
        placeId: places.find(p => p.name === 'Kerala Backwaters').id,
        isActive: true,
        featured: true
      }
    ]);

    console.log('✅ Packages created:', packages.length);

    // Create sample reviews
    const reviews = await Review.bulkCreate([
      {
        userId: regularUser.id,
        placeId: places.find(p => p.name === 'Mysore Palace').id,
        rating: 5,
        title: 'Absolutely Magnificent!',
        comment: 'The Mysore Palace is truly a sight to behold. The architecture is stunning and the history is fascinating.',
        helpful: 12,
        status: 'approved',
        isVerified: true
      },
      {
        userId: regularUser.id,
        packageId: packages.find(p => p.name === 'Mysore Heritage Tour').id,
        rating: 4,
        title: 'Great Heritage Experience',
        comment: 'The tour was well-organized and covered all the important sites. The guide was knowledgeable.',
        helpful: 6,
        status: 'approved',
        isVerified: true
      }
    ]);

    console.log('✅ Reviews created:', reviews.length);
    console.log('🎉 Sample data seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

if (require.main === module) {
  seedData().then(() => {
    process.exit(0);
  });
}

module.exports = seedData; 