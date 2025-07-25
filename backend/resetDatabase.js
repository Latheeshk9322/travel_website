const { sequelize } = require('./server');

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // Force sync will drop all tables and recreate them
    await sequelize.sync({ force: true });
    
    console.log('✅ Database reset successfully!');
    console.log('📝 All tables have been dropped and recreated.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 