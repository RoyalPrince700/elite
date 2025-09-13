# Database Setup Guide

This directory contains the database schema and setup instructions for the EliteRetoucher application.

## Overview

The database is designed to support a photo retouching service with the following main entities:
- **Users/Profiles**: Extended user information from Supabase Auth
- **Subscriptions**: User subscription management with different plans
- **Orders**: Photo retouching orders and payments
- **Photos**: Individual photo uploads and processing status
- **Retouching Styles**: Different retouching service types (Natural, High-End, Magazine)

## Database Schema

### Tables

1. **profiles** - Extends Supabase auth.users with additional user information
2. **subscription_plans** - Available subscription tiers
3. **subscriptions** - User subscription records
4. **retouching_styles** - Different retouching service types
5. **orders** - Photo retouching orders
6. **photos** - Individual photo records

### Storage Buckets

1. **photos** - Original uploaded photos (private)
2. **processed-photos** - Retouched/processed photos (private)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be fully set up

### 2. Run Database Schema

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the SQL script

### 3. Configure Environment Variables

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Storage Setup

The schema automatically creates the necessary storage buckets. You can also set this up manually:

1. Go to Storage in your Supabase dashboard
2. Create two buckets:
   - `photos` (private)
   - `processed-photos` (private)

### 5. Authentication Setup

1. Go to Authentication > Settings in Supabase
2. Configure your site URL and redirect URLs
3. Set up email templates if needed

## Key Features

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies to ensure users can only access their own data.

### Automatic Profile Creation

When a user signs up, a profile record is automatically created via database triggers.

### File Storage

- Original photos are stored privately in the `photos` bucket
- Processed photos are stored in the `processed-photos` bucket
- Files are organized by user ID for easy access control

### Subscription Management

- Supports multiple subscription plans
- Tracks usage within billing periods
- Integrates with Stripe for payments

## Testing the Setup

After running the schema, you can test with:

```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check if subscription plans were inserted
SELECT * FROM subscription_plans;

-- Check if storage buckets exist
SELECT * FROM storage.buckets;
```

## Next Steps

1. Set up your frontend with the provided environment variables
2. Implement authentication flows
3. Create photo upload functionality
4. Set up Stripe integration for payments
5. Implement the dashboard for subscription management

## Support

If you encounter any issues with the database setup:
1. Check the Supabase logs in your dashboard
2. Verify all environment variables are set correctly
3. Ensure your Supabase project has the correct permissions
