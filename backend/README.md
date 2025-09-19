# EliteRetoucher Backend API

A Node.js/Express backend API for the EliteRetoucher photo retouching service, built with MongoDB and Cloudinary integration.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Photo Upload**: Cloudinary integration for image storage and optimization
- **Subscription Management**: Handle different pricing tiers and usage tracking
- **Order Processing**: Complete order lifecycle management with manual payment tracking
- **File Management**: Upload, process, and manage photo files
- **Manual Billing**: Complete subscription request, invoice, and payment workflow
- **Admin Dashboard**: Manage subscription requests, create invoices, process payments
- **Payment Tracking**: Upload receipts, track payment status, manage subscriptions
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── photoController.js # Photo management logic
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── errorHandler.js   # Error handling middleware
├── models/
│   ├── User.js           # User model
│   ├── Subscription.js   # Subscription model
│   ├── Order.js          # Order model
│   ├── Photo.js          # Photo model
│   ├── SubscriptionPlan.js
│   └── RetouchingStyle.js
├── routes/
│   ├── auth.js           # Authentication routes
│   └── photos.js         # Photo routes
├── utils/
│   └── seeder.js         # Database seeder
├── uploads/              # Temporary upload directory
├── server.js             # Main server file
├── package.json
└── README.md
```

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the backend directory with the required variables (see Environment Variables section below)

3. **Start MongoDB**
   Make sure MongoDB is running on your system

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🌍 Environment Variables

Add these variables to your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/eliteretoucher

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email (optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Mailtrap (transactional emails)
MAILTRAP_TOKEN=your-mailtrap-token
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Photos
- `POST /api/photos/upload` - Upload photos (multipart/form-data)
- `GET /api/photos` - Get user's photos
- `GET /api/photos/:id` - Get single photo
- `PUT /api/photos/:id` - Update photo details
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/photos/:id/optimized` - Get optimized image URL
- `GET /api/photos/:id/thumbnail` - Get thumbnail URL

### Subscriptions (Users)
- `POST /api/subscriptions/request` - Create subscription request
- `GET /api/subscriptions/requests` - Get user's subscription requests
- `GET /api/subscriptions/invoices` - Get user's invoices
- `GET /api/subscriptions/invoices/:id` - Get single invoice
- `POST /api/subscriptions/payments/receipt` - Submit payment receipt
- `POST /api/subscriptions/payments/receipt/:id/upload` - Upload receipt document
- `GET /api/subscriptions/payments/receipts` - Get user's payment receipts

### Subscriptions (Admin)
- `GET /api/subscriptions/admin/requests` - Get all subscription requests
- `PUT /api/subscriptions/admin/requests/:id` - Update request status
- `POST /api/subscriptions/admin/invoices` - Create invoice
- `PUT /api/subscriptions/admin/payments/receipts/:id` - Process payment receipt

### Health Check
- `GET /health` - Server health check

## 🗄️ Database Models

### User
- Email, password, profile information
- Authentication and authorization
- Account status management

### Photo
- File metadata and Cloudinary integration
- Processing status tracking
- Relationship with orders and users

### Order
- Order management and tracking
- Manual payment tracking
- Photo associations

### Subscription
- Subscription plan management
- Usage tracking
- Billing cycle management

### SubscriptionRequest
- User subscription requests with form data
- Admin review and approval workflow
- Pricing calculations and discounts

### Invoice
- Invoice generation and management
- Payment tracking and due dates
- Invoice items and payment instructions

### PaymentReceipt
- User payment confirmations
- Receipt document uploads
- Admin approval and subscription activation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Express validator for all inputs
- **File Upload Security**: File type and size restrictions

## 📊 Usage Tracking

The system tracks:
- Monthly image usage per subscription
- Processing status of each photo
- Order completion and delivery
- User activity and login history

## 🔄 Manual Payment Flow

### Subscription Process:
1. **User Subscription Request**: User fills subscription form → stored as SubscriptionRequest
2. **Admin Review**: Admin reviews request in dashboard → approves/rejects with notes
3. **Invoice Creation**: Admin creates invoice → sent to user's dashboard
4. **User Payment**: User views invoice → makes payment → uploads receipt
5. **Payment Verification**: Admin reviews receipt → approves payment
6. **Subscription Activation**: Admin creates subscription → user sees active plan

### Photo Processing:
1. **Photo Upload**: Files sent to Cloudinary, metadata stored in MongoDB
2. **Order Creation**: Photos grouped into orders with pricing
3. **Manual Payment**: Payment status tracked manually (bank transfer, cash, etc.)
4. **Processing**: Photos marked as processing, completed, or failed
5. **Delivery**: Processed photos delivered to users

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data
- `npm run seed:destroy` - Clear all seeded data
- `npm test` - Run test suite

## 🚀 Deployment

1. Set up MongoDB database
2. Configure Cloudinary account
3. Set environment variables
4. Run database seeder
5. Deploy to hosting platform (Heroku, DigitalOcean, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
