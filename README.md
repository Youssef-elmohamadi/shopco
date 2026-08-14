# Shop.co Admin Dashboard

A modern, responsive Admin Dashboard for the Shop.co E-commerce platform, built with **Next.js** and **TypeScript**. This frontend application interfaces seamlessly with the ASP.NET Core backend to manage the entire e-commerce ecosystem.

## 🚀 Live API Reference
The dashboard is powered by the backend API hosted at:  
**Base URL:** [http://www.shopco.somee.com/](http://www.shopco.somee.com/)

## 🛠️ Technologies Used
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / Custom CSS
- **HTTP Client:** Fetch API (Server Actions & Client Components)

## 📦 Features
- **Dashboard Overview:** Comprehensive metrics and analytics for the e-commerce store.
- **Product Management:** Add, edit, and delete products, variants, brands, and categories.
- **Order Management:** View customer orders, update statuses, and manage fulfillment.
- **User & Role Management:** Control administrator access and manage customer accounts.
- **Promo Codes:** Create and track discount codes and their usage limits.

## 💻 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm, yarn, or pnpm

### Setup Instructions
1. **Clone the repository.**
2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Environment Configuration:**
   Create a `.env.local` file in the root directory (or copy from `.env.example`):
   ```env
   NEXT_PUBLIC_API_URL=http://www.shopco.somee.com/api
   ```
   > **Note:** Use `http://` instead of `https://` because Somee.com free hosting tier does not support SSL certificates. Both `http://www.shopco.somee.com` and `http://www.shopco.somee.com/api` are supported and automatically normalized.

4. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open the Dashboard:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Deployment
This Next.js application can be deployed to platforms like **Vercel** or **Netlify**. 
- Set `NEXT_PUBLIC_API_URL=http://www.shopco.somee.com/api` in your deployment environment variables.
- Next.js server actions and API rewrites in `next.config.ts` will safely proxy requests without Mixed Content errors.
