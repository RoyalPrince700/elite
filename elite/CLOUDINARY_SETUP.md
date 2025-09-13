# Cloudinary Setup Guide for EliteRetoucher

## 🌤️ Why Cloudinary for Photo Storage?

**Cloudinary Free Tier Benefits:**
- ✅ **25GB Storage** (vs Supabase's 50MB)
- ✅ **25GB Monthly Bandwidth**
- ✅ **25,000 Monthly Transformations**
- ✅ **Global CDN** for fast delivery
- ✅ **Automatic Image Optimization**
- ✅ **Advanced Processing Features**
- ✅ **Perfect for Photography Services**

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Verify your email

### Step 2: Get Your Credentials
1. **Cloud Name**: Go to Dashboard → Account Settings → Account
   - Copy the "Cloud name" field

2. **Upload Preset**: Go to Settings → Upload
   - Click "Add upload preset"
   - Name: `elite-retoucher-uploads`
   - Mode: `Unsigned` (important!)
   - Folder: `elite-retoucher/` (optional)
   - Save and copy the preset name

3. **API Key**: Go to Dashboard → Account Settings → Account
   - Copy the "API Key" field

### Step 3: Configure Environment
Create a `.env` file in your project root:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=elite-retoucher-uploads
VITE_CLOUDINARY_API_KEY=your-actual-api-key
```

## 📁 Upload Configuration

### Upload Preset Settings (Recommended):
- **Mode**: Unsigned
- **Format**: Auto (WebP, AVIF when supported)
- **Quality**: Auto
- **Allowed formats**: jpg, jpeg, png, webp
- **Max file size**: 20MB
- **Folder**: `elite-retoucher/`

### Folder Structure:
```
elite-retoucher/
├── originals/     # User uploaded photos
├── processed/     # Retouched results
└── thumbnails/    # Auto-generated thumbnails
```

## 🎨 Advanced Features Available

### Automatic Optimizations:
```javascript
// Auto WebP conversion
<img src="https://res.cloudinary.com/YOUR_CLOUD/image/upload/f_auto,q_auto/YOUR_IMAGE" />

// Responsive images
<img src="https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_auto,c_scale,f_auto/YOUR_IMAGE" />

// Thumbnails
<img src="https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_300,h_300,c_fill,f_auto/YOUR_IMAGE" />
```

### Transformations:
- **Resize & Crop**: `w_500,h_500,c_fill`
- **Quality**: `q_auto` (automatic quality)
- **Format**: `f_auto` (automatic format)
- **Effects**: Blur, sharpen, filters
- **Watermarks**: Add branding
- **Face detection**: Auto-crop to faces

## 🔧 Integration Features

### What Your App Will Do:
1. ✅ **Upload photos** directly to Cloudinary
2. ✅ **Generate thumbnails** automatically
3. ✅ **Optimize images** for web delivery
4. ✅ **Store metadata** in Supabase
5. ✅ **Track upload progress**
6. ✅ **Handle errors gracefully**

### Security:
- ✅ **Unsigned uploads** for client-side
- ✅ **User-specific folders**
- ✅ **File validation** (size, type)
- ✅ **Rate limiting** via upload presets

## 📊 Usage Monitoring

Monitor your usage in Cloudinary Dashboard:
- **Storage**: Current usage vs limit
- **Bandwidth**: Monthly transfer
- **Transformations**: API calls used
- **Credits**: Remaining free credits

## 🚨 Important Notes

### Free Tier Limits:
- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month
- No custom domain

### Best Practices:
1. **Compress uploads** before sending
2. **Use thumbnails** for previews
3. **Enable auto-format** conversion
4. **Set quality to auto** for optimization
5. **Monitor usage** regularly

### Upgrade Path:
When you exceed free limits:
- **Plus Plan**: $99/month (400GB storage, 200GB bandwidth)
- **Advanced Plan**: $199/month (1TB storage, 1TB bandwidth)
- **Custom**: Enterprise solutions

## 🔗 Useful Links

- [Cloudinary Console](https://cloudinary.com/console)
- [Upload API Documentation](https://cloudinary.com/documentation/upload_api)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Free Tier Details](https://cloudinary.com/pricing)

## 🆘 Need Help?

1. Check your upload preset is set to "Unsigned"
2. Verify your cloud name is correct
3. Make sure environment variables are loaded
4. Check browser console for detailed errors

Your Cloudinary setup is now ready for professional photo retouching! 📸✨
