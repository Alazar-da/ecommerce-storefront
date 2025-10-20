````markdown
# 🛍️ E-Commerce Storefront — Next.js + TypeScript + Tailwind + Stripe

An elegant and fully functional **E-Commerce Storefront** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Stripe Checkout**.  
Includes both **Customer** and **Admin** interfaces with analytics powered by **Chart.js**.

🌐 **Live Site:** [https://ecommerce-storefront-drab.vercel.app/](https://ecommerce-storefront-drab.vercel.app/)

---

## 🖼️ Screenshots & Demo

<!-- 🔹 Main Hero / Home Page -->
![Home Page Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/homepage.png)
> 🏠 *Recommended:* full-width homepage showing product grid.  
> 📏 Size: ~1200×700 px

<!-- 🔹 Product Detail Page -->
![Product Detail Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/product-details.png)
> 🛍️ *Recommended:* show product image + add-to-cart button.  
> 📏 Size: ~1200×700 px

<!-- 🔹 Cart Page -->
![Cart Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/cart.png)
> 🛒 *Recommended:* show cart items + checkout button.

<!-- 🔹 Stripe Checkout Page -->
![Stripe Checkout Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/stripe-checkout.png)
> 💳 *Recommended:* screenshot of Stripe checkout page in test mode.

<!-- 🔹 Admin Dashboard -->
![Admin Dashboard Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/admin-dashboard.png)
> 📊 *Recommended:* show Chart.js analytics view and sidebar layout.

<!-- 🔹 Admin Product Management -->
![Admin Product Management Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/admin-products.png)
> 🧰 *Recommended:* CRUD product management view (table or form).

---

## 🔐 Demo Credentials

> **Customer**
- Email: `user@gmail.com`
- Password: `User@123`

> **Admin**
- Email: `Admin@gmail.com`
- Password: `Admin@123`

---

## 🧠 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **State Management** | Zustand |
| **Payments** | Stripe Checkout (Test Mode) |
| **Backend / API** | Next.js API Routes |
| **Analytics** | Chart.js |
| **Deployment** | Vercel |

---

## ✨ Features

### 🧾 Customer Side
- 🏠 Product listing page with filters
- 🛍️ Product detail page with image gallery
- 🛒 Add/remove items from cart
- 💳 Checkout with Stripe (test mode)
- 👤 User session managed via Zustand

### 🛠️ Admin Dashboard
- 📊 Analytics dashboard (Chart.js)
- 🧰 Product CRUD management
- 🔒 Admin authentication & protected routes

---

## ⚙️ Local Setup

```bash
git clone https://github.com/Alazar-da/ecommerce-storefront.git
cd ecommerce-storefront
npm install
cp .env.example .env
npm run dev
````

Open [http://localhost:3000](http://localhost:3000)

---

## 🧩 Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
MONGODB_URI=mongodb+srv://user:pw@cluster.mongodb.net/db
NEXTAUTH_SECRET=some_secret
```

---

## 🧾 Stripe (Test Mode)

* Card: `4242 4242 4242 4242`
* Exp: any future date
* CVC: any 3 digits

---

## 🧭 Project Structure

```
/app
  /admin
  /api
  /components
/store
/types
/utils
```

---

## 📊 Admin Analytics

![Chart.js Analytics Screenshot](https://github.com/Alazar-da/ecommerce-storefront/assets/analytics.png)

> 📈 *Optional:* Include a Chart.js dashboard screenshot showing sales/revenue chart.

---

## 🚀 Deployment

Deployed on **Vercel** — fast, serverless, and production-ready.

---

## 🧑‍💻 Author

Built by **Alazar** — showcasing full-stack skills with modern web technologies.
💬 Connect on [LinkedIn](https://linkedin.com/in/your-link) or [Portfolio](https://your-portfolio-link.com)

---

## 🪪 License

MIT © 2025 Alazar

```

---

### 📸 TL;DR — Suggested Image List

| Section | File Name | Description |
|----------|------------|--------------|
| Home Page | `homepage.png` | Hero + product list |
| Product Details | `product-details.png` | Single product view |
| Cart | `cart.png` | Cart items + totals |
| Checkout | `stripe-checkout.png` | Stripe checkout screen |
| Admin Dashboard | `admin-dashboard.png` | Charts & stats |
| Product Management | `admin-products.png` | Product CRUD table or form |
| Analytics (optional) | `analytics.png` | Chart.js demo |

---
