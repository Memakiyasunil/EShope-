# E-Shop Online

A production-ready **Multi-Vendor E-Commerce Marketplace** built with the MERN stack.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js (ES Modules) |
| Database | MongoDB, Mongoose |
| Auth | JWT + Refresh Tokens |
| Payments | Razorpay, Stripe, Cash on Delivery |
| Charts | Chart.js, Recharts |
| Uploads | Cloudinary (optional) / Local storage |

## Project Structure

```text
EShope-/
├── backend/                  # Node.js / Express Backend
│   ├── config/               # Database and 3rd-party configs
│   ├── controllers/          # API route controllers
│   ├── middleware/           # Auth, error handling, file upload
│   ├── models/               # Mongoose database models
│   ├── routes/               # Express API endpoints
│   ├── scripts/              # Utility scripts (e.g. Seeder)
│   ├── services/             # Business logic & integrations
│   ├── uploads/              # Local file upload directory
│   ├── utils/                # Helper functions
│   ├── app.js                # Express app setup
│   ├── server.js             # Application entry point
│   ├── Dockerfile            # Backend Docker image config
│   └── package.json          # Backend dependencies
├── frontend/                 # React / Vite Frontend
│   ├── public/               # Static public assets
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Global elements (Navbar, Footer, ProductCard)
│   │   │   └── ui/           # Basic UI blocks (GlassCard, RevealText)
│   │   ├── hooks/            # Custom React hooks (useAuth, etc.)
│   │   ├── layouts/          # Page layouts (Main, Dashboard)
│   │   ├── lib/              # Utility libraries (cn, clsx)
│   │   ├── pages/            # Application pages
│   │   │   ├── admin/        # Admin dashboard views
│   │   │   ├── buyer/        # Customer dashboard views
│   │   │   ├── public/       # Public facing (Home, About, Contact)
│   │   │   └── seller/       # Vendor dashboard views
│   │   ├── store/            # Redux Toolkit store and slices
│   │   ├── utils/            # Axios and frontend helpers
│   │   ├── App.jsx           # Main routing component
│   │   ├── index.css         # Tailwind & global CSS
│   │   └── main.jsx          # React DOM render entry
│   ├── nginx.conf            # Nginx config for production
│   ├── Dockerfile            # Frontend Docker image config
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vite.config.js        # Vite bundler configuration
│   └── package.json          # Frontend dependencies
├── docs/                     # Documentation folder
├── docker-compose.yml        # Docker composition for production
└── README.md                 # Project documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
# .env is pre-configured with existing MongoDB credentials
npm run seed    # Seed database with test data
npm run dev     # Start on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Start on http://localhost:5173
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eshoponline.com | admin123 |
| Buyer | customer1@eshoponline.com | customer123 |
| Seller | seller1@eshoponline.com | seller123 |

## Seed Data

The seed script creates:

- 1 Super Admin
- 20 Seller accounts (18 approved)
- 100 Customer accounts
- 10 Categories with sub-categories
- 500 Products with images & ratings
- 1000 Orders (all statuses)
- 2000 Product reviews
- 50 Active coupons
- Banners, blogs, settings

## Features

### Buyer
Register/Login, email verification, product search & filters, wishlist, cart, checkout, address management, Razorpay/Stripe/COD payments, order tracking, reviews.

### Seller
Shop profile, product CRUD, inventory management, order management, revenue reports, customer reviews.

### Admin
Dashboard analytics, user/seller management, seller approval, category/product/order management, payment monitoring, coupons, banners, blogs, reports, site settings.

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [API Documentation](docs/API.md)

## License

MIT
