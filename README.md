#for developer only 
git add .
git commit -m "updated"

git push origin main
git push friend main

# 🍽️ QRBite — Restaurant QR Ordering SaaS

A full-stack SaaS application that replaces manual order-taking in restaurants
with QR-based digital menus, live kitchen management, and real-time order tracking.

Built with **Next.js 15**, **MongoDB**, **Server-Sent Events (SSE)**,
and **Tailwind CSS**.

---

## 🚀 Live Demo

> Deploy your own instance using the setup guide below.

---

## 📸 Screenshots

| Public Menu | Kitchen Screen | Admin Dashboard |
|---|---|---|
| Customer scans QR | Live order kanban | Full management panel |

---

## ✨ Features

### 🧑‍💼 Restaurant Admin
- Register restaurant and manage all settings
- Upload restaurant logo and cover image
- Set tax percentage and service charge
- Enable / disable order acceptance
- Choose from 6 beautiful public menu themes
- Set GPS location for location-based ordering
- View live dashboard with today's stats

### 🪑 Table & QR Management
- Create tables with custom numbers and capacity
- Auto-generate QR codes for each table
- Download QR code as PNG with restaurant logo,
  table number, and menu URL included
- Preview public menu link directly from dashboard

### 🍛 Menu Management
- Create and manage menu categories
- Add menu items with image, price, description
- Mark items as Veg or Non-Veg
- Add size variants (Half / Full / Quarter / Large etc.)
  with different prices per variant
- Toggle item availability in real time
- Drag-and-drop sort order

### 📦 Order Management
- Customers scan QR → browse menu → add to cart → place order
- No login required for customers
- Real-time order updates via Server-Sent Events (SSE)
- Order status flow:
  `PLACED → ACCEPTED → PREPARING → READY → SERVED`
- Staff can update order status from any device
- Admin can manage all orders with filters

### 👨‍🍳 Kitchen Screen
- Live kanban board with 4 columns:
  New Orders / Accepted / Preparing / Ready
- Orders appear instantly without page refresh
- Color-coded urgency (yellow after 10min, red after 20min)
- Audio notification on new order
- One-click status updates
- Download bill from kitchen when order is ready

### 🧾 Bill Generation
- Generate professional PDF bill per order
- Includes restaurant name, address, phone
- Itemized list with variants, quantities, prices
- Tax and service charge breakdown
- Customer can download bill after order is served
- Admin can download from orders page
- Kitchen staff can download when marking ready

### 📍 Location-Based Ordering
- Admin sets restaurant GPS coordinates from settings
- Admin sets allowed radius (10m to 500m slider)
- Customer must be physically inside restaurant to order
- Browser asks for location permission on menu open
- Clean UI for denied / outside / allowed states

### 🎨 Menu Themes (6 Presets)
- Classic Minimal — clean white
- Dark Luxury — black with gold accents
- Fresh Green — nature inspired
- Ocean Blue — calm blue gradients
- Warm Sunset — orange to rose
- Bold Red — vibrant red
- Admin selects theme from settings — applies instantly

### 📊 Statistics & Reports
- Last 7 days orders and revenue charts
- Top selling items with progress bars
- Monthly report generator:
  - Select any month and year
  - Summary cards (orders, revenue, avg value, items sold)
  - Daily breakdown table
  - Top 10 selling items
  - Order status breakdown
  - Download as professional A4 PDF
  - Email report notification to any address

### 👥 Staff Management
- Admin creates staff accounts directly
- Staff get auto-verified (no email verification needed)
- Welcome email sent with login credentials
- Admin can activate / deactivate staff
- Staff can access kitchen screen only

### 🔐 Authentication & Email
- Email + password authentication via NextAuth v5
- Email verification on restaurant registration
- Forgot password with reset link via email
- Gmail App Password integration (no OAuth complexity)
- Role-based access: SUPER_ADMIN / ADMIN / STAFF

### 🏢 Super Admin Platform
- View all restaurants on the platform
- Platform-wide stats (restaurants, users, orders, revenue)
- Activate / deactivate any restaurant
- Preview any restaurant's public menu

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript (no TypeScript) |
| Database | MongoDB + Mongoose |
| Authentication | NextAuth.js v5 |
| Real-time | Server-Sent Events (SSE) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Email | Nodemailer + Gmail App Password |
| Image Upload | Cloudinary |
| PDF Generation | jsPDF + jsPDF-AutoTable |
| Charts | Recharts |
| Cart State | Zustand |
| Forms | React Hook Form + Zod |
| QR Codes | qrcode npm package |
| Geolocation | Browser Geolocation API + Haversine formula |
| Hosting | Vercel + MongoDB Atlas |

---

## 📁 Project Structure
restaurant-qr-saas/
├── app/
│   ├── (auth)/              # Login, Register, Forgot Password
│   ├── (dashboard)/         # Admin dashboard pages
│   ├── kitchen/             # Kitchen screen
│   ├── menu/[r]/[t]/        # Public QR menu page
│   ├── order-status/[id]/   # Customer order tracking
│   ├── super-admin/         # Platform admin
│   └── api/                 # All API routes
├── components/
│   ├── auth/                # Login and register forms
│   ├── bill/                # Bill download button
│   ├── dashboard/           # Sidebar, header, stats
│   ├── kitchen/             # Kitchen order cards
│   ├── menu/                # Admin menu management
│   ├── orders/              # Order cards and status
│   ├── public-menu/         # Customer-facing menu
│   │   └── themes/          # 6 theme presets
│   ├── report/              # Monthly report UI
│   ├── shared/              # Reusable components
│   ├── staff/               # Staff management
│   ├── super-admin/         # Platform admin UI
│   └── tables/              # Table and QR management
├── hooks/                   # useSSE, useCart, useOrders
├── lib/                     # DB, auth, SSE, PDF, email
├── models/                  # Mongoose schemas
├── store/                   # Zustand cart store
└── scripts/                 # Super admin creation script

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Gmail account with App Password enabled

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/restaurant-qr-saas.git
cd restaurant-qr-saas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-qr-saas

# NextAuth
AUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gmail (App Password)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### 4. Generate AUTH_SECRET

```bash
npx auth secret
```

### 5. Set up Gmail App Password

1. Enable 2-Step Verification on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an app password named "QRBite"
4. Copy the 16-character password to `GMAIL_APP_PASSWORD`

### 6. Create Super Admin

```bash
MONGODB_URI="your-uri-here" node scripts/createSuperAdmin.js
```

> Change the password after first login.

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔗 Key URLs

| URL | Description |
|---|---|
| `/register` | Register new restaurant |
| `/login` | Admin / Staff login |
| `/dashboard` | Admin dashboard home |
| `/menu` | Menu category and item management |
| `/tables` | Table and QR code management |
| `/orders` | Order management with live updates |
| `/kitchen` | Live kitchen kanban screen |
| `/staff` | Staff account management |
| `/settings` | Restaurant settings and theme |
| `/stats` | 7-day statistics and charts |
| `/stats/report` | Monthly PDF report generator |
| `/menu/[restaurantId]/[tableNumber]` | Public QR menu page |
| `/order-status/[orderId]` | Customer live order tracking |
| `/super-admin` | Platform overview |
| `/super-admin/restaurants` | All restaurants management |

---

## 👤 User Roles

| Role | Access |
|---|---|
| `SUPER_ADMIN` | Full platform access — all restaurants |
| `ADMIN` | Own restaurant — all features |
| `STAFF` | Kitchen screen + order status updates only |
| `Customer` | Public menu page — no login required |

---

## 🌍 Environment Variables Reference

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `AUTH_SECRET` | NextAuth secret key |
| `NEXTAUTH_URL` | App base URL |
| `NEXT_PUBLIC_APP_URL` | Public app URL (used in QR codes) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GMAIL_USER` | Gmail address for sending emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not account password) |

---

## 📦 Main Dependencies

```json
{
  "next": "15.x",
  "next-auth": "5.x (beta)",
  "mongoose": "8.x",
  "nodemailer": "latest",
  "jspdf": "latest",
  "jspdf-autotable": "latest",
  "zustand": "latest",
  "recharts": "latest",
  "qrcode": "latest",
  "cloudinary": "latest",
  "react-hook-form": "latest",
  "zod": "latest",
  "tailwindcss": "3.x",
  "shadcn/ui": "latest"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Cloudinary](https://cloudinary.com)
- [Vercel](https://vercel.com)

---

<p align="center">
  Built with ❤️ using Next.js and MongoDB
  <br/>
  <strong>QRBite — Modern QR Menu Ordering for Restaurants</strong>
</p>



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
