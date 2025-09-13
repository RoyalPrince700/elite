# Environment Variables Configuration

## Required Environment Variables for Production

### API Configuration
```bash
VITE_API_URL=https://elite-pnpr.onrender.com
```

### Google OAuth
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Optional
```bash
VITE_SOCKET_URL=https://elite-pnpr.onrender.com
```

## Vercel Deployment

To fix the current API issues, update your Vercel environment variables:

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to Environment Variables
4. Set `VITE_API_URL` to `https://elite-pnpr.onrender.com`
5. Make sure `VITE_GOOGLE_CLIENT_ID` is properly set
6. Redeploy your application

## Local Development

For local development, create a `.env` file in the `elite/` directory:

```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## What Was Fixed

The issue was that the frontend was making requests to:
- `https://elite-pnpr.onrender.com/auth/profile` (missing `/api`)

But the backend expects:
- `https://elite-pnpr.onrender.com/api/auth/profile` (with `/api`)

The fix ensures the `/api` prefix is properly appended to all API requests.
