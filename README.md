# Travel Explorer - Full Stack Travel Website ✈️

A comprehensive travel booking website built with React.js, Node.js, and SQLite featuring tourist destinations, travel packages, user reviews, payment integration, and an admin dashboard.

## 🌟 Features

### For Users
- **Browse Destinations**: Explore tourist places with photos, descriptions, and location details
- **Travel Packages**: View curated travel packages with real-time pricing and seasonal discounts
- **User Reviews**: Read and write reviews for places and packages
- **User Authentication**: Secure registration and login system with JWT
- **User Profiles**: Manage personal information and preferences
- **Booking System**: Complete booking flow with multiple payment options
- **Payment Integration**: Integrated with Stripe and Razorpay for secure payments
- **Favorites**: Save favorite places and packages
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### For Admins
- **Admin Dashboard**: Comprehensive management interface with analytics
- **Content Management**: Add, edit, and delete places and packages
- **Review Moderation**: Approve, reject, or edit user reviews
- **User Management**: View and manage user accounts
- **Booking Management**: Track and manage all bookings
- **Analytics**: View statistics and insights
- **Featured Content**: Highlight special places and packages

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (with Sequelize ORM)
- **Sequelize** - ORM for database operations
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **Stripe** - Payment processing
- **Razorpay** - Alternative payment gateway
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
travel-explorer/
├── backend/                 # Backend API
│   ├── config.env          # Environment configuration
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── scripts/           # Database scripts
│   ├── uploads/           # File uploads
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
├── frontend/              # Frontend React app
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── search/    # Search components
│   │   │   └── ui/        # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── admin/     # Admin pages
│   │   │   └── user/      # User pages
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-explorer
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm run install-all
   ```

3. **Environment Setup**
   The backend is pre-configured with development settings. For production, update `backend/config.env`:
   ```env
   # Database Configuration
   DATABASE_URL=sqlite:./travel_app.db

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=30d

   # Stripe API Keys (Replace with your actual keys)
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Razorpay API Keys (Replace with your actual keys)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Setup Database**
   ```bash
   # Setup database with sample data
   cd backend
   node scripts/seedData.js
   ```

5. **Start the development servers**
   ```bash
   # Start both servers (from root directory)
   npm start
   
   # Or start individually:
   # Backend server (from backend directory)
   npm run server:dev
   
   # Frontend server (from frontend directory)
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔑 Default Login Credentials

### Admin Account
- Email: `admin@travelexplorer.com`
- Password: `admin123`

### User Account
- Email: `john@example.com`
- Password: `user123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Places Endpoints
- `GET /api/places` - Get all places (with filtering)
- `GET /api/places/:id` - Get place by ID
- `POST /api/places` - Create new place (admin only)
- `PUT /api/places/:id` - Update place (admin only)
- `DELETE /api/places/:id` - Delete place (admin only)

### Packages Endpoints
- `GET /api/packages` - Get all packages (with filtering)
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create new package (admin only)
- `PUT /api/packages/:id` - Update package (admin only)
- `DELETE /api/packages/:id` - Delete package (admin only)

### Bookings Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `POST /api/bookings/:id/stripe-payment-intent` - Stripe payment
- `POST /api/bookings/:id/razorpay-order` - Razorpay payment
- `POST /api/bookings/:id/razorpay-verify` - Verify Razorpay payment

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/reviews/pending` - Get pending reviews
- `PUT /api/admin/reviews/:id/moderate` - Moderate review

## 💳 Payment Integration

The application supports multiple payment gateways:

### Stripe Integration
- Card payments
- International transactions
- Webhook support for payment confirmation

### Razorpay Integration
- UPI, Cards, Net Banking
- Indian payment methods
- Real-time payment verification

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** (User/Admin)
- **Protected routes** for authenticated users
- **Admin-only sections** for content management

## 🎨 UI Features

- **Modern responsive design** with Tailwind CSS
- **Dark/Light theme support**
- **Interactive components** with smooth animations
- **Image galleries** with lightbox functionality
- **Advanced filtering** and search capabilities

## 📱 Responsive Design

Fully responsive design optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Configure environment variables for production
2. Set up your preferred database (SQLite included for development)
3. Deploy to platforms like Railway, Heroku, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📊 Features Implemented

✅ **User Authentication & Authorization**
✅ **CRUD Operations for Places & Packages**
✅ **Review System with Moderation**
✅ **Booking System**
✅ **Payment Integration (Stripe & Razorpay)**
✅ **Admin Dashboard with Analytics**
✅ **File Upload for Images**
✅ **Advanced Search & Filtering**
✅ **Responsive Design**
✅ **Rate Limiting & Security**
✅ **Database Seeding**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🚀 Future Enhancements

- Real-time notifications with WebSocket
- Advanced analytics dashboard
- Mobile app development with React Native
- Social media integration
- Multi-language support
- Advanced booking management
- Integration with travel APIs

---

**Built with ❤️ using React.js, Node.js, and modern web technologies**

🌟 **Star this repository if you find it helpful!** 🌟 