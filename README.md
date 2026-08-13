# Shop.co Admin Dashboard

A modern, responsive Admin Dashboard for the Shop.co E-commerce platform, built with **Next.js** and **TypeScript**. This frontend application interfaces seamlessly with the ASP.NET Core backend to manage the entire e-commerce ecosystem.

## 🚀 Live API Reference
The dashboard is powered by the backend API hosted at:  
**Base URL:** [https://www.shopco.somee.com/](https://www.shopco.somee.com/)

## 🛠️ Technologies Used
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / Custom CSS
- **HTTP Client:** Axios / Fetch API

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
   Create a `.env` or `.env.local` file in the root directory and configure the API endpoint to point to the live backend (or your local environment):
   ```env
   NEXT_PUBLIC_API_URL=https://www.shopco.somee.com
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open the Dashboard:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Deployment
This Next.js application can be easily deployed to platforms like **Vercel** or **Netlify**. 
- Ensure that the `NEXT_PUBLIC_API_URL` environment variable is set in your deployment platform's settings.
- Use `https://www.shopco.somee.com` to avoid Mixed Content (HTTP/HTTPS) errors in production.
