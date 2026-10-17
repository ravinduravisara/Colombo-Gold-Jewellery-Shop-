# 💎 Colombo Gold Covering — Luxury Jewellery E-Commerce Platform & Admin Console

> Complete, enterprise-grade MERN Stack (MongoDB, Express.js, React / Next.js 15, Node.js, TypeScript) Luxury Jewellery E-Commerce Platform with an expansive Administrator Console. Built for **Colombo Gold Covering** (Sri Jayawardenepura Kotte, Colombo, Sri Lanka).

---

## 🌟 Key Highlights & Business Capabilities

1. **Luxury Customer Storefront**
   - **Bespoke Gold Theme:** High-fashion aesthetics with deep obsidian black (`#0A0A0A`), soft ivory (`#FAF8F3`), and luxury satin gold (`#C6A667`).
   - **Direct WhatsApp Ordering:** Instant 1-click WhatsApp checkout (`https://wa.me/94771234567`) with pre-composed item details, selected size variants, SKU, and total in Sri Lankan Rupees (`Rs.`).
   - **TikTok & Social Showcase:** Curated video embeds and reels linking directly to [@colombogoldcovering](https://www.tiktok.com/@colombogoldcovering).
   - **Complete Catalogue & Filtering:** Search by keyword, browse 8 jewellery categories (Bridal sets, Necklaces, Bangles, Chains, Earrings, Rings, Pendants, Anklets), filter by price in LKR, and sort by popularity or price.
   - **Product Detail Experience:** High-resolution zoom gallery, variant selector (sizes/lengths), stock availability indicator, warranty certificates (12-month color guarantee & lifetime re-polishing support), and customer reviews.
   - **Checkout & Payment Methods:** Cash on Delivery (COD) island-wide, Direct Bank Wire Transfer with receipt slip upload, and coupon code redemptions.
   - **Order Tracking:** Live customer order tracking via Order Number and Phone/Email.

2. **Customer Account Portal (`/account`)**
   - Executive dashboard overview (Total orders, saved wishlist items, active addresses).
   - Order history with line item breakdowns and bank transfer receipt upload interface.
   - Address book supporting all 25 Sri Lankan administrative districts with default shipping preference.
   - Saved wishlist with 1-click &quot;Add to Bag&quot; functionality.
   - Profile management for rapid courier dispatch.

3. **Autonomous Admin Management Console (`/admin`)**
   - **Executive Dashboard:** Real-time revenue KPI cards, 30/90-day Recharts sales trajectories, order pipeline status distributions, and quick actions.
   - **Jewellery Catalogue:** Product listing, creation, and editing with image upload to Cloudinary, SKU tracking, multi-variant managers, and warranty terms.
   - **Categories & Collections:** Manage curated collections (Bridal Elegance, Daily Glamour, Heritage Sri Lankan) and product categories.
   - **Inventory & Stock Movements:** Low stock threshold alarms, out-of-stock tracking, manual stock adjustments (in/out/audit), and complete chronological movement audit logs.
   - **Order Fulfilment & Dispatch:** Update fulfillment status (`pending` → `confirmed` → `processing` → `shipped` → `delivered` → `cancelled`), assign registered courier tracking numbers, and view customer contacts.
   - **Bank Transfer Verification:** Dedicated bank slip inspector with full-size slip view and 1-click &quot;Approve&quot; or &quot;Reject&quot; clearance buttons.
   - **Coupons & Promotions:** Create fixed LKR or percentage discount promo codes with minimum spend requirements and expiration limits.
   - **Sri Lankan Shipping Zones:** Configure district-wise courier delivery fees, transit times, and free-shipping thresholds.
   - **Customer Directory:** Monitor customer registrations and toggle account status.
   - **Reviews Moderation:** Approve or reject customer ratings before public appearance.
   - **Enquiries:** Review contact messages and bespoke bridal jewelry requests with staff resolution notes.
   - **Hero Banners & TikTok Showcase:** Update promotional carousel slides and social feeds.
   - **Content CMS:** Edit statutory pages (About Us, FAQ, Warranty Information, Privacy Policy, Terms & Conditions).
   - **Reports & Data Export:** Generate and download instant Sales CSV and Inventory Stock CSV reports.
   - **SEO Management:** Customize title templates, meta descriptions, search keywords, and preview Google search snippets.
   - **Store Settings:** Configure showroom address, WhatsApp hotline, contact email, and corporate bank account details.
   - **Staff Permissions & Security Audit Logs:** Role-based access control (`superadmin`, `admin`, `staff`) and tamper-resistant security audit logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | **Next.js 15 (App Router)**, React 19, TypeScript |
| **Styling & Design** | Tailwind CSS, Lucide React, Framer Motion |
| **State & Data Fetching** | Zustand, TanStack React Query, Axios |
| **Forms & Validation** | React Hook Form, Zod |
| **Analytics & Visuals** | Recharts, KaTeX |
| **Backend API** | **Node.js, Express.js**, TypeScript |
| **Database & ODM** | **MongoDB, Mongoose 8** |
| **Authentication** | JWT (JSON Web Tokens), HTTP-only Cookies, Bcryptjs |
| **File Storage** | Cloudinary & Multer (with disk storage fallback) |
| **Deployment & Ops** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 📁 Repository Structure

```
Jewelery_Shop/
├── backend/
│   ├── src/
│   │   ├── config/             # DB, CORS, Cloudinary, Mailer, Environment
│   │   ├── middleware/         # Auth, Admin, Upload, Rate Limiting, Error
│   │   ├── modules/            # Auth, Products, Orders, Inventory, Users, etc.
│   │   ├── routes/             # Mounted API routes (/api/v1/*)
│   │   ├── scripts/            # Database seeders (seedDemoData, seedAdmin)
│   │   ├── services/           # Cloudinary upload, Email notifications
│   │   ├── utils/              # ApiResponse, ApiError, currency formatting
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server bootstrap
│   ├── tests/                  # Jest automated test suites
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (store)/        # Public storefront pages
│   │   │   ├── (account)/      # Customer portal (/account/*)
│   │   │   ├── (admin)/        # Admin dashboard (/admin/*)
│   │   │   ├── (auth)/         # Login, Register, Password reset
│   │   │   ├── globals.css     # Luxury styling & typography
│   │   │   └── layout.tsx      # Root application layout
│   │   ├── components/         # UI primitives, Admin components, Store layouts
│   │   ├── services/           # Type-safe Axios API services
│   │   ├── store/              # Zustand stores (Auth, Cart, Wishlist, UI)
│   │   └── types/              # TypeScript interfaces (Product, Order, User)
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf              # Reverse proxy configuration
├── docker-compose.yml          # Containerized production stack
├── package.json                # Monorepo root workspaces
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 20+
- MongoDB instance (Local or MongoDB Atlas)
- npm or pnpm

### 2. Clone & Install Dependencies
```bash
git clone <repo-url>
cd Jewelery_Shop

# Install all workspace dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` into `backend/.env` and `frontend/.env.local`:

```bash
# In backend/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/colombo_gold_covering
JWT_SECRET=super_secret_jwt_key_colombo_gold_covering_2026
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Optional Cloudinary (Local file fallback active if omitted)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# In frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Seeding
Populate the database with the Super Administrator, 8 categories, 3 collections, 6 detailed demo jewellery products with size variants, Sri Lankan shipping zones for all 25 districts, discount coupons, hero banners, and CMS statutory content:

```bash
npm --prefix backend run seed
```

**Default Administrative Credentials:**
- **Email:** `admin@colombogoldcovering.lk`
- **Password:** `Admin@123456`
- **Role:** `superadmin`

---

## 🧪 Running Automated Tests

Run the backend unit and integration test suite:

```bash
npm --prefix backend test
```

Build the backend TypeScript project:

```bash
npm --prefix backend run build
```

Build the frontend Next.js application:

```bash
npm --prefix frontend run build
```

---

## 💻 Running In Development Mode

Run backend and frontend concurrently:

```bash
# Terminal 1 - Backend API (Port 5000)
npm --prefix backend run dev

# Terminal 2 - Frontend Next.js Storefront (Port 3000)
npm --prefix frontend run dev
```

- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **API Health Check:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🐳 Production Deployment with Docker Compose

To deploy the entire production stack including MongoDB, Backend, Frontend, and Nginx reverse proxy:

```bash
docker-compose up -d --build
```

The application will be accessible via standard HTTP port `80` (or `443` with SSL configured in Nginx).

