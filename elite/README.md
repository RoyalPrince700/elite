# EliteRetoucher - Professional Photo Retouching Services

A modern, fast-loading website for high-end photo retouching services, built with Vite, React, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Fast & Interactive**: Optimized for speed with smooth animations and engaging visuals
- **Professional Design**: High-end, minimal design aligned with luxury photography services
- **Mobile Responsive**: Perfect experience across all devices (desktop, tablet, mobile)
- **Modern Stack**: Built with Vite + React + Tailwind CSS + Node.js/Express/MongoDB

### Key Pages & Components
- **Landing Page**: Hero section with before/after showcase, service overview, and clear CTAs
- **Service Models**: Pay-per-image vs Subscription comparison
- **Interactive Portfolio**: Before/after sliders showcasing retouching quality
- **Subscription Management**: Client dashboard with subscription requests, invoice management, and manual payment tracking
- **Complete Pages**: About, Contact, FAQ, and Portfolio galleries

### Technical Features
- **Backend API Integration**: Node.js/Express backend with MongoDB for user management and Cloudinary for image storage
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first styling for rapid development
- **React Router**: Client-side routing for seamless navigation
- **Lucide Icons**: Beautiful, consistent iconography

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.2
- **Styling**: Tailwind CSS 3.x
- **Backend**: Node.js/Express with MongoDB and Cloudinary
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite with hot reload

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EliteRetoucher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your backend API configuration in the `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build & Deploy

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   └── ...
├── pages/              # Page components
│   ├── LandingPage.jsx # Main landing page
│   ├── Portfolio.jsx   # Portfolio gallery
│   ├── Pricing.jsx     # Subscription pricing
│   └── ...
├── config/             # Configuration files
│   ├── api.js          # Backend API client setup
│   └── cloudinary.js   # Cloudinary configuration
├── App.jsx             # Main app component with routing
├── App.css             # Global styles
├── index.css           # Tailwind imports and base styles
└── main.jsx            # React app entry point
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`primary-600` to `primary-800`)
- **Dark**: Sophisticated grays (`dark-800`, `dark-900`)
- **Accent**: Supporting colors for CTAs and highlights

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Inter (body text)

### Components
- Responsive button styles (`.btn-primary`, `.btn-secondary`, `.btn-dark`)
- Container utilities (`.container-custom`)
- Animation utilities (fade-in, slide-up effects)

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Extended color palette for branding
- Custom animations and keyframes
- Typography scale optimized for photography content
- Responsive breakpoints

### Backend API Setup
1. Ensure your Node.js/Express backend is running (see backend README)
2. Set up MongoDB database connection
3. Configure Cloudinary for image storage
4. Add your API URL and Cloudinary credentials to `.env` file

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: 320px+ (sm)
- **Tablet**: 768px+ (md)
- **Desktop**: 1024px+ (lg)
- **Large Desktop**: 1280px+ (xl)

## 🎯 Performance

- **Vite**: Lightning-fast development and build times
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Responsive images and lazy loading
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License


Built with ❤️ for professional photographers and their clients.