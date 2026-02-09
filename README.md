# HowToTechly 🚀

**HowToTechly** is a production-grade, full-stack technology blogging platform designed for engineering leaders and developers. It features a high-performance public frontend for reading content and a secure, feature-rich admin portal for content management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)

## 🏗 Architecture

The project is structured as a **monorepo** containing both the React frontend and the Node.js/Express backend.

- **Frontend (`/`)**: React 18, Vite, Tailwind CSS, TypeScript.
- **Backend (`/server`)**: Node.js, Express, PostgreSQL (via `pg`), JWT Auth.
- **Database**: PostgreSQL (Supabase, Neon, or Local).

## ✨ Features

### Public Interface
- ⚡ **High Performance**: Built with Vite for near-instant loads.
- 📱 **Responsive Design**: Mobile-first UI using Tailwind CSS.
- 🔍 **SEO Optimized**: Dynamic meta tags and Open Graph support.
- 🔎 **Search & Filtering**: Filter by categories, tags, or keyword search.
- 📖 **Markdown Rendering**: Custom markdown parser for technical content.

### Admin Portal
- 🔒 **Secure Authentication**: JWT-based login system.
- 📊 **Dashboard**: Real-time overview of views, posts, and drafts.
- ✍️ **Markdown Editor**: Specialized editor with live preview and image support.
- 🏷 **Category Management**: Create and manage content taxonomy.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Installation

Clone the repository and install dependencies for both root (frontend) and backend.

```bash
# Install root dependencies (Frontend)
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/howtotechly

# Security
JWT_SECRET=your_super_secret_key_change_this_in_prod

# App Config
PORT=5000
NODE_ENV=development
```

### 3. Database Initialization

We provide a script to scaffold the database schema and create an admin user.

```bash
# Run the initialization script
npm run db:init
```

*Note: This creates a default admin user:*
- **Email:** `admin@howtotechly.com`
- **Password:** `password123`

### 4. Running Locally

You need to run both the Backend API and the Frontend Client.

**Option A: Split Terminals (Recommended)**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1. **Vercel Configuration**: The `vercel.json` rewrites API requests to the serverless function entry point.
2. **Environment Variables**: Add `DATABASE_URL` and `JWT_SECRET` in the Vercel Dashboard.
3. **Build Command**: `npm run build`

## 🛠 Project Structure

```
├── src/                 # React Frontend
│   ├── components/      # UI Components (Layouts, Cards)
│   ├── pages/           # Route Views (Public & Admin)
│   ├── services/        # API Clients & Mock Data
│   └── hooks/           # Custom React Hooks
├── server/              # Node.js Backend
│   ├── scripts/         # DB Migration Scripts
│   ├── routes.ts        # API Endpoints
│   └── db.ts            # Postgres Connection
└── ...config files
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
