#!/bin/bash

# Travel Explorer - Project Startup Script
echo "🚀 Starting Travel Explorer Project..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Setup backend
echo "⚙️  Setting up backend..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Create database if it doesn't exist
if [ ! -f "database.sqlite" ]; then
    echo "🗄️  Setting up database..."
    node scripts/seedData.js
fi

# Start backend server in background
echo "🔧 Starting backend server..."
nohup npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"
echo ""

# Setup frontend
echo "⚙️  Setting up frontend..."
cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend server in background
echo "🔧 Starting frontend server..."
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

cd ..

# Wait a moment for servers to start
echo ""
echo "⏳ Waiting for servers to initialize..."
sleep 10

# Show access information
echo ""
echo "🎉 Travel Explorer is now running!"
echo ""
echo "📍 Access Points:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔌 Backend API: http://localhost:5000"
echo ""
echo "👤 Test Accounts:"
echo "   🔑 Admin: admin@travelindia.com / admin123"
echo "   👤 User: john@example.com / user123"
echo ""
echo "📊 Features Available:"
echo "   ✅ User Registration & Login"
echo "   ✅ Browse Places & Packages"
echo "   ✅ Admin Dashboard"
echo "   ✅ Reviews & Ratings"
echo "   ✅ Search & Filtering"
echo "   ✅ Responsive Design"
echo ""
echo "🛑 To stop the servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📄 Check logs:"
echo "   Backend: tail -f backend/backend.log"
echo "   Frontend: tail -f frontend/frontend.log"
echo ""
echo "🚀 Project is ready! Open http://localhost:3000 in your browser."