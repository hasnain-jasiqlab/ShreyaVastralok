# Shreya Vastralok - Frontend

Modern React frontend for Shreya Vastralok WhatsApp-Driven Clothing Catalog.

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - Data Fetching & Caching
- **Framer Motion** - Animations
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications

## Features

### Customer Features
- ✅ Responsive Home Page with Hero Section
- ✅ Featured Categories Display
- ✅ New Arrivals Carousel
- ✅ Special Offers Carousel
- ✅ Product Collection Page with Filters
- ✅ Product Modal with Details
- ✅ WhatsApp Integration for Enquiries
- ✅ Contact Page with Form & Map
- ✅ Floating WhatsApp Button
- ✅ Mobile-First Design
- ✅ Smooth Animations
- ✅ Lazy Loading Images
- ✅ Skeleton Loaders

### Admin Features
- ✅ Admin Login Page
- ✅ Protected Admin Routes
- ✅ Admin Dashboard
- ✅ Products Management UI
- ✅ Offers Management UI
- ✅ Settings Page
- ✅ Responsive Admin Layout

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file with your settings:
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=+919876543210
VITE_IMAGE_BASE_URL=http://localhost:5000
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── WhatsAppButton.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── SkeletonCard.jsx
│   │   ├── home/            # Home page components
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedCategories.jsx
│   │   │   ├── NewArrivals.jsx
│   │   │   ├── OffersCarousel.jsx
│   │   │   └── WhyChooseUs.jsx
│   │   ├── products/        # Product components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductModal.jsx
│   │   │   └── ProductFilters.jsx
│   │   └── admin/           # Admin components
│   │       └── AdminLayout.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CollectionPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminOffers.jsx
│   │       └── AdminSettings.jsx
│   ├── services/
│   │   ├── api.js           # Axios instance
│   │   └── index.js         # API service functions
│   ├── hooks/
│   │   └── useApi.js        # React Query hooks
│   ├── utils/
│   │   ├── whatsapp.js      # WhatsApp utilities
│   │   └── helpers.js       # Helper functions
│   ├── context/
│   │   └── AuthContext.jsx  # Auth context provider
│   ├── config/
│   │   └── config.js        # App configuration
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── .env                     # Environment variables
├── .env.example             # Environment template
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend API at `VITE_API_URL`. All API calls are handled through:

1. **Axios Instance** (`src/services/api.js`) - Configured with interceptors
2. **Service Layer** (`src/services/index.js`) - API service functions
3. **React Query Hooks** (`src/hooks/useApi.js`) - Data fetching with caching

## WhatsApp Integration

WhatsApp functionality is implemented in `src/utils/whatsapp.js`:

- Product enquiries with pre-filled messages
- Collection enquiries
- General contact messages
- Floating WhatsApp button
- Contact form integration

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom theme** with brand colors (Rose & Orange)
- **Responsive design** - Mobile-first approach
- **Framer Motion** for smooth animations
- **Custom components** in `src/index.css`

## Admin Panel

Access admin panel at `/admin/login`

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## Production Build

\`\`\`bash
npm run build
\`\`\`

Build output will be in `dist/` directory.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number with country code | `+919876543210` |
| `VITE_IMAGE_BASE_URL` | Base URL for images | `http://localhost:5000` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - Shreya Vastralok

## Support

For support, contact: info@shreyavastralok.com
