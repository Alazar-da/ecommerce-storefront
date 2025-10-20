# 🛍️ E-Commerce Storefront — Next.js + TypeScript + Tailwind + Stripe

An elegant and fully functional **E-Commerce Storefront** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Stripe Checkout**.  
Includes both **Customer** and **Admin** interfaces with analytics powered by **Chart.js**.

🌐 **Live Site:** [https://ecommerce-storefront-drab.vercel.app/](https://ecommerce-storefront-drab.vercel.app/)

---

## 🖼️ Screenshots & Demo

### 🏠 Home Page
![Home Page](https://github.com/Alazar-da/ecommerce-storefront/blob/main/assets/homepage.png)

### 🛍️ Product Details
![Product Details](https://github.com/Alazar-da/ecommerce-storefront/blob/main/assets/product-details.png)

### 🛒 Shopping Cart
![Shopping Cart](https://github.com/Alazar-da/ecommerce-storefront/blob/main/assets/cart.png)

### 💳 Stripe Checkout
![Stripe Checkout](https://github.com/Alazar-da/ecommerce-storefront/blob/main/assets/stripe-checkout.png)

### 📊 Admin Dashboard
![Admin Dashboard](https://github.com/Alazar-da/ecommerce-storefront/blob/main/assets/admin-dashboard.png)

### 🧰 Product Management
![Product Management](https://github.com/Alazar-da/ecommerce-storefront/blob/main/assets/admin-products.png)

---

## 🔐 Demo Credentials

### 👤 Customer Account
- **Email:** `user@gmail.com`
- **Password:** `User@123`

### 👨‍💼 Admin Account
- **Email:** `Admin@gmail.com`
- **Password:** `Admin@123`

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

### 🛍️ Customer Side
- 🏠 Product listing page with filters and search
- 🛍️ Product detail page with image gallery
- 🛒 Add/remove items from shopping cart
- 💳 Secure checkout with Stripe integration
- 👤 User session management

### 🛠️ Admin Dashboard
- 📊 Analytics dashboard with Chart.js visualizations
- 🧰 Complete product CRUD operations
- 🔒 Protected admin routes and authentication
- 📈 Sales and revenue tracking

---

## ⚙️ Local Development

```bash
# Clone the repository
git clone https://github.com/Alazar-da/ecommerce-storefront.git

# Navigate to project directory
cd ecommerce-storefront

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

---

## 💳 Stripe Test Mode

Use the following test card for payments:

- **Card Number:** `4242 4242 4242 4242`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any 5 digits

---

## 📁 Project Structure

```
ecommerce-storefront/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   └── components/    # Reusable Admin components
│   ├── api/               # API routes
│   └── components/        # Reusable components
├── DB/                    # Database configuration
├── models/                # Data models
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── public/               # Static assets
```

---

## 🚀 Deployment

This project is deployed on **Vercel** for optimal performance and serverless functionality.

---

## 👨‍💻 Author

**Alazar**  
Full-Stack Developer showcasing modern web development technologies and best practices.

---

## 📄 License

MIT License © 2025 Alazar

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/Alazar-da/ecommerce-storefront](https://github.com/Alazar-da/ecommerce-storefront)
- **Live Demo:** [https://ecommerce-storefront-drab.vercel.app/](https://ecommerce-storefront-drab.vercel.app/)

---

*Note: This is a demonstration project using Stripe test mode. No real transactions are processed.*
