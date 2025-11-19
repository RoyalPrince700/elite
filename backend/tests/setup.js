import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  try {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to test database');
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error);
    throw error;
  }
}, 60000);

// Cleanup after each test
afterEach(async () => {
  try {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('❌ Failed to clear test collections:', error);
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    // Close database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    // Stop the in-memory server
    if (mongoServer) {
      await mongoServer.stop();
    }

    console.log('✅ Test database cleaned up');
  } catch (error) {
    console.error('❌ Failed to cleanup test database:', error);
  }
}, 60000);

// Mock Cloudinary
jest.mock('../config/cloudinary.js', () => ({
  uploadBlogHeader: {
    single: jest.fn(() => (req, res, next) => {
      // Mock file upload
      if (req.body.mockFile) {
        req.file = {
          path: 'https://cloudinary.com/mock-image.jpg',
          filename: 'mock-image.jpg'
        };
      }
      next();
    })
  }
}));

// Mock environment variables for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.NODE_ENV = 'test';
