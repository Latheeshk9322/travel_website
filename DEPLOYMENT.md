# Deployment Guide 🚀

This guide will help you deploy the Travel Explorer application to production.

## 🏗️ Production Setup

### 1. Environment Configuration

Update `backend/config.env` for production:

```env
# Database Configuration (Use PostgreSQL or MySQL for production)
DATABASE_URL=your_production_database_url

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Razorpay Configuration  
RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Server Configuration
PORT=5000
NODE_ENV=production
```

### 2. Database Setup for Production

For production, switch from SQLite to PostgreSQL or MySQL:

```javascript
// Update backend/server.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // or 'mysql'
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
```

## 🌐 Backend Deployment

### Option 1: Railway (Recommended)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Deploy backend:
```bash
cd backend
railway deploy
```

4. Add environment variables in Railway dashboard

### Option 2: Heroku

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create Heroku app:
```bash
cd backend
heroku create your-app-name-backend
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set DATABASE_URL=your_database_url
# ... add all other env vars
```

4. Deploy:
```bash
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Fork this repository
2. Connect your GitHub account to DigitalOcean
3. Create a new app and select your repository
4. Configure build and run commands:
   - Build: `cd backend && npm install`
   - Run: `cd backend && npm start`
5. Add environment variables in the dashboard

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy frontend:
```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL=https://your-backend-url.com`

### Option 2: Netlify

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Option 3: AWS S3 + CloudFront

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Upload `build` folder contents to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

## 🔧 Production Optimizations

### Backend Optimizations

1. Enable gzip compression:
```javascript
const compression = require('compression');
app.use(compression());
```

2. Set up proper logging:
```javascript
const winston = require('winston');
// Configure production logging
```

3. Set up process monitoring:
```bash
npm install pm2 -g
pm2 start server.js --name "travel-explorer-backend"
```

### Frontend Optimizations

1. Enable build optimizations in `package.json`:
```json
{
  "homepage": "https://your-domain.com",
  "scripts": {
    "build": "react-scripts build && npx workbox-cli generateSW"
  }
}
```

2. Set up CDN for static assets
3. Enable PWA features

## 🔒 Security Checklist

### Backend Security

- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure JWT secrets
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular security updates

### Frontend Security

- [ ] Remove development tools from production build
- [ ] Set up Content Security Policy (CSP)
- [ ] Enable HTTPS
- [ ] Validate all API endpoints

## 📊 Monitoring & Analytics

### Application Monitoring

1. Set up error tracking (Sentry):
```bash
npm install @sentry/node @sentry/react
```

2. Configure application monitoring:
```javascript
// Backend
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your-sentry-dsn' });

// Frontend  
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: 'your-sentry-dsn' });
```

### Performance Monitoring

1. Set up Google Analytics
2. Configure performance monitoring
3. Set up uptime monitoring (UptimeRobot)

## 🚀 Deployment Commands

### Quick Production Setup

```bash
# 1. Clone and setup
git clone your-repository
cd travel-explorer
npm run setup

# 2. Configure environment variables
# Edit backend/config.env with production values

# 3. Deploy backend (Railway example)
cd backend
railway deploy

# 4. Deploy frontend (Vercel example) 
cd frontend
vercel --prod

# 5. Configure custom domains and SSL
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify SSL settings for production DB

2. **CORS Errors**
   - Update FRONTEND_URL in backend config
   - Configure CORS settings properly

3. **Payment Integration Issues**
   - Verify API keys are for production
   - Check webhook endpoints

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Logs and Debugging

```bash
# Backend logs
heroku logs --tail -a your-backend-app

# Railway logs
railway logs

# Frontend build logs
vercel logs your-deployment-url
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Review environment variables
3. Test API endpoints individually
4. Check database connectivity

---

**Happy Deploying! 🎉**