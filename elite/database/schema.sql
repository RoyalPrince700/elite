-- EliteRetoucher Database Schema
-- This file contains all the necessary tables, policies, and functions for the photo retouching service

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  phone TEXT,
  website TEXT,
  user_type TEXT CHECK (user_type IN ('photographer', 'agency', 'brand', 'other')) DEFAULT 'photographer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================================
-- SUBSCRIPTION PLANS TABLE
-- ===========================================
CREATE TABLE public.subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10,2) NOT NULL,
  images_per_month INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, monthly_price, images_per_month, features) VALUES
('Silver Plan', 'Entry-level option for freelancers and new photographers', 97, 20, '["Up to 10 Natural, 8 High-End, 2 Magazine", "Commercial usage rights", "Standard support"]'::jsonb),
('Gold Plan', 'Best value for busy portrait & fashion photographers', 197, 60, '["Up to 30 Natural, 25 High-End, 5 Magazine", "Commercial usage rights", "Priority chat support", "Mix & match across styles"]'::jsonb),
('Diamond Plan', 'Premium plan for brands, agencies, and studios', 397, 150, '["Up to 75 Natural, 60 High-End, 15 Magazine", "Commercial usage rights", "Priority delivery", "Dedicated account manager", "Mix & match across styles"]'::jsonb);

-- ===========================================
-- SUBSCRIPTIONS TABLE
-- ===========================================
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')) DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  images_used_this_month INTEGER DEFAULT 0,
  images_limit INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ===========================================
-- PHOTO RETOUCHING STYLES
-- ===========================================
CREATE TABLE public.retouching_styles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  turnaround_hours INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default retouching styles
INSERT INTO public.retouching_styles (name, description, base_price, turnaround_hours) VALUES
('Natural', 'Subtle enhancements for natural-looking results', 15.00, 24),
('High-End', 'Professional retouching for commercial use', 25.00, 48),
('Magazine', 'High-fashion magazine quality retouching', 50.00, 72);

-- ===========================================
-- ORDERS TABLE
-- ===========================================
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'delivered', 'canceled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_id TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- PHOTOS TABLE
-- ===========================================
CREATE TABLE public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  original_filename TEXT NOT NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  retouching_style_id UUID REFERENCES public.retouching_styles(id),
  status TEXT CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')) DEFAULT 'uploaded',
  price DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Cloudinary-specific fields
  cloudinary_public_id TEXT UNIQUE,
  cloudinary_asset_id TEXT UNIQUE,
  file_size BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,

  -- Processing metadata
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  processing_errors TEXT
);

-- Enable RLS on photos
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Photo policies
CREATE POLICY "Users can view their own photos" ON public.photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own photos" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" ON public.photos
  FOR UPDATE USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON public.photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
BEGIN
  SELECT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0')
  INTO order_num;
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Indexes for better query performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_photos_order_id ON public.photos(order_id);
CREATE INDEX idx_photos_user_id ON public.photos(user_id);
CREATE INDEX idx_photos_status ON public.photos(status);
CREATE INDEX idx_photos_cloudinary_public_id ON public.photos(cloudinary_public_id);
CREATE INDEX idx_photos_cloudinary_asset_id ON public.photos(cloudinary_asset_id);
CREATE INDEX idx_photos_retouching_style_id ON public.photos(retouching_style_id);
CREATE INDEX idx_photos_created_at ON public.photos(created_at DESC);

-- ===========================================
-- STORAGE BUCKETS SETUP
-- ===========================================

-- Create storage buckets for photos
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('photos', 'photos', false),
  ('processed-photos', 'processed-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for photos bucket
CREATE POLICY "Users can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for processed photos bucket
CREATE POLICY "Users can view their processed photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'processed-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow admins to manage all photos (you may want to adjust this based on your admin role setup)
CREATE POLICY "Admins can manage all photos" ON storage.objects
  FOR ALL USING (
    bucket_id IN ('photos', 'processed-photos')
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND user_type = 'admin' -- You'll need to add this to your profiles if you have admins
    )
  );

-- ===========================================
-- VIEWS FOR EASY QUERIES
-- ===========================================

-- View for user subscription details with plan info
CREATE VIEW public.user_subscription_details AS
SELECT
  s.*,
  p.name as plan_name,
  p.monthly_price as plan_price,
  p.images_per_month as plan_images_limit,
  p.features as plan_features
FROM public.subscriptions s
JOIN public.subscription_plans p ON s.plan_id = p.id;

-- View for order details with photos
CREATE VIEW public.order_details AS
SELECT
  o.*,
  json_agg(
    json_build_object(
      'id', ph.id,
      'original_filename', ph.original_filename,
      'status', ph.status,
      'price', ph.price,
      'retouching_style', rs.name
    )
  ) as photos
FROM public.orders o
LEFT JOIN public.photos ph ON o.id = ph.order_id
LEFT JOIN public.retouching_styles rs ON ph.retouching_style_id = rs.id
GROUP BY o.id;

-- ===========================================
-- SAMPLE DATA (Optional - for testing)
-- ===========================================

-- Note: You can uncomment and run these after setting up the database

/*
-- Sample retouching styles (already inserted above)

-- Sample subscription plans (already inserted above)

-- You can add sample data here for testing purposes
-- INSERT INTO public.profiles (id, email, full_name, user_type)
-- VALUES ('sample-uuid', 'test@example.com', 'Test User', 'photographer');
*/
