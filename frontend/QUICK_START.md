# 🚀 Quick Start Guide - Shreya Vastralok Frontend

## Prerequisites
- Node.js 16+ installed
- Backend server running on port 5000

## Installation & Setup

### Step 1: Install Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

### Step 2: Configure Environment
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# VITE_API_URL=http://localhost:5000/api
# VITE_WHATSAPP_NUMBER=+919876543210
# VITE_IMAGE_BASE_URL=http://localhost:5000
\`\`\`

### Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Frontend will be available at: **http://localhost:5173**

## 🎯 Quick Navigation

### Customer Pages
- **Home**: http://localhost:5173/
- **Collection**: http://localhost:5173/collection
- **Contact**: http://localhost:5173/contact

### Admin Panel
- **Login**: http://localhost:5173/admin/login
- **Dashboard**: http://localhost:5173/admin/dashboard

**Demo Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎨 Key Features to Test

### 1. WhatsApp Integration
- Click floating WhatsApp button (bottom-right)
- Click "Enquire" on any product
- Submit contact form

### 2. Product Browsing
- Browse featured categories on home page
- View new arrivals carousel
- Filter products by gender/category
- Click product card to view details

### 3. Responsive Design
- Resize browser to test mobile view
- Test mobile menu
- Test filter modal on mobile

### 4. Admin Panel
- Login with demo credentials
- View dashboard stats
- Navigate through admin pages

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is busy:
\`\`\`bash
# Vite will automatically use next available port
# Check terminal output for actual port
\`\`\`

### API Connection Issues
1. Ensure backend is running on port 5000
2. Check `.env` file has correct `VITE_API_URL`
3. Check browser console for errors

### WhatsApp Not Opening
1. Verify `VITE_WHATSAPP_NUMBER` in `.env`
2. Format: `+[country code][number]`
3. Example: `+919876543210`

## 📱 Testing Checklist

- [ ] Home page loads correctly
- [ ] Categories display from API
- [ ] Products display from API
- [ ] Filters work correctly
- [ ] Product modal opens
- [ ] WhatsApp button works
- [ ] Contact form redirects to WhatsApp
- [ ] Admin login works
- [ ] Admin dashboard displays
- [ ] Responsive on mobile
- [ ] Animations are smooth

## 🌐 Production Build

\`\`\`bash
# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

Build output: `dist/` directory

## 📚 Documentation

- **README.md** - Full documentation
- **PROJECT_SUMMARY.md** - Implementation details
- **QUICK_START.md** - This file

## 🎉 You're All Set!

The frontend is now running and ready to connect with your backend API.

**Next Steps:**
1. Ensure backend is running
2. Test API endpoints
3. Add real product data
4. Customize WhatsApp number
5. Deploy to production

---

**Need Help?**
- Check console for errors
- Review backend API logs
- Verify environment variables

**Happy Coding! 🚀**
