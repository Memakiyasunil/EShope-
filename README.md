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

```
Ecommerce/
├── backend/
│   ├── config/          # DB, Cloudinary
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Payment, email, seed
│   ├── scripts/         # Seed runner
│   └── utils/           # Helpers
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI
│       ├── hooks/       # Custom hooks
│       ├── layouts/     # Page layouts
│       ├── pages/       # Public, buyer, seller, admin
│       └── store/       # Redux slices
└── docs/                # API & installation guides
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
