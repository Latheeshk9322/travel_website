const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const { sequelize } = require('./server');

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    
    // Drop all tables and recreate
    await sequelize.sync({ force: true });
    
    console.log('✅ Database reset completed successfully!');
    console.log('💡 Run "node scripts/seedData.js" to populate with sample data');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    process.exit(0);
  }
};

// Run the reset function
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase; 