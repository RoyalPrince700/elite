// Simple test script to debug blog creation
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

// Test data
const testBlogData = {
  title: 'Test Blog Post',
  subheading: 'Testing blog creation',
  content: '<p>This is a test blog post content.</p>',
  tags: JSON.stringify(['test', 'blog']),
  metaDescription: 'Test blog post meta description',
  published: 'true'
};

async function testBlogCreation() {
  try {
    console.log('🔍 Testing blog creation...');

    // First, login to get token
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@eliteretoucher.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} - ${JSON.stringify(loginData)}`);
    }

    const token = loginData.token;
    console.log('✅ Login successful, got token');

    // Create FormData
    const formData = new FormData();

    // Add text fields
    Object.keys(testBlogData).forEach(key => {
      formData.append(key, testBlogData[key]);
    });

    console.log('📝 FormData created with test data');

    // Create blog
    const createResponse = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      console.error('❌ Blog creation failed:', createResponse.status, createData);
    } else {
      console.log('✅ Blog creation successful:', createData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBlogCreation();
