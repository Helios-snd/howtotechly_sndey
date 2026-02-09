# HowToTechly — System Architecture Blueprint

## 1. Project Folder Structure (Monorepo)
The project is organized as a monorepo containing both the frontend client and the backend API server.

```text
/
├── src/                        # Frontend Application (React)
│   ├── components/             # Reusable UI components
│   │   ├── LayoutPublic.tsx    # Wrapper for public pages (Nav, Footer)
│   │   ├── LayoutAdmin.tsx     # Wrapper for admin pages (Sidebar, Auth checks)
│   │   ├── PostCard.tsx        # Blog post display component
│   │   └── ErrorBoundary.tsx   # Global error handling
│   ├── pages/                  # Page Views
│   │   ├── admin/              # Admin-specific pages (Dashboard, Editors)
│   │   ├── Home.tsx            # Landing page
│   │   ├── BlogList.tsx        # Archive view
│   │   └── BlogPost.tsx        # Single article view
│   ├── services/               # Data Access Layer
│   │   ├── api.ts              # Main HTTP client & Mock Fallbacks
│   │   └── mockData.ts         # Static data for offline/demo modes
│   ├── hooks/                  # Custom React Hooks (e.g., useSEO)
│   ├── types.ts                # TypeScript Interfaces (Shared with backend conceptually)
│   └── App.tsx                 # Main Router & Application Entry
│
├── server/                     # Backend Application (Node.js/Express)
│   ├── scripts/                # Utility scripts (DB initialization)
│   ├── db.ts                   # PostgreSQL Connection Pool
│   ├── index.ts                # Server Entry Point
│   ├── middleware.ts           # Auth & Error Middleware
│   ├── routes.ts               # API Route Definitions
│   └── types.ts                # Backend-specific types
│
└── metadata.json               # Application Configuration
```

## 2. Web App Structure (Public)
The public interface is designed for read-only access with a focus on SEO and performance.

*   **Entry Point**: `App.tsx` handles routing based on URL hash.
*   **Layout**: `LayoutPublic` provides a persistent Navigation Bar and Footer.
*   **State Management**: Local component state (React `useState`) used for data fetching; Global context not currently required for public read-only views.
*   **SEO**: `useSEO` hook dynamically updates `document.title` and `<meta>` tags for Open Graph support.

## 3. Admin App Structure (Private)
The admin interface is a protected Single Page Application (SPA) section for content management.

*   **Authentication Guard**: The `LayoutAdmin` or Routing logic checks for a valid JWT in `localStorage` before rendering. Redirects to `/admin/login` if unauthorized.
*   **Layout**: `LayoutAdmin` provides a persistent Sidebar for navigation and User Session controls.
*   **Features**:
    *   **Dashboard**: Traffic stats and recent activity.
    *   **Blog Manager**: CRUD operations for posts (Create, Read, Update, Delete).
    *   **Editors**: Rich text editing (Markdown support) and image handling.

## 4. Backend Structure
A RESTful API built with Node.js and Express.

*   **Runtime**: Node.js.
*   **Framework**: Express.js.
*   **Security**: `helmet` for headers, `cors` for cross-origin resource sharing, `express-rate-limit` for DDoS protection.
*   **Data Access**: Raw SQL queries via `pg` (node-postgres) for maximum control and performance (no heavy ORM).
*   **Error Handling**: Centralized error handling middleware to sanitize responses.

## 5. Database Design (PostgreSQL)
The relational schema supports users, content, and taxonomy.

### Tables
*   **`users`**
    *   `id` (UUID, PK)
    *   `email` (Unique, Indexed)
    *   `password_hash` (Bcrypt)
    *   `role` (Enum: 'admin', 'editor')
*   **`categories`**
    *   `id` (UUID, PK)
    *   `name`
    *   `slug` (Unique, Indexed)
    *   `description`
*   **`posts`**
    *   `id` (UUID, PK)
    *   `title`
    *   `slug` (Unique, Indexed)
    *   `content` (Text/Markdown)
    *   `is_published` (Boolean, Indexed)
    *   `author_id` (FK -> users.id)
    *   `category_id` (FK -> categories.id)
    *   `tags` (Text Array)
    *   `views` (Integer)

## 6. Authentication & Authorization Flow
We use a stateless JWT (JSON Web Token) strategy.

1.  **Login**:
    *   Client sends `email` + `password` to `/api/auth/login`.
    *   Server validates hash, signs JWT with `HS256`, returns token.
2.  **Storage**:
    *   Client stores JWT in `localStorage` key `authToken`.
3.  **Request Authorization**:
    *   Client attaches `Authorization: Bearer <token>` header to protected requests.
    *   Server `requireAuth` middleware verifies signature.
    *   Server `requireAdmin` middleware checks `user.role === 'admin'`.
4.  **Session Expiry**: Token set to expire (e.g., 24h). Client handles 401 responses by redirecting to login.

## 7. Routing Strategy
The application uses **Client-Side Hash Routing** to maintain SPA behavior without complex server-side rewrite rules during the MVP phase.

*   **Public Routes**:
    *   `#/` -> Home
    *   `#/blogs` -> List
    *   `#/blog/:slug` -> Detail
    *   `#/search?q=...` -> Search Results
*   **Admin Routes**:
    *   `#/admin/login` -> Auth Form
    *   `#/admin/dashboard` -> Protected Home
    *   `#/admin/blogs/new` -> Creator
    *   `#/admin/blogs/:id` -> Editor

## 8. Deployment Model
The architecture supports decoupled or monolithic deployment.

*   **Frontend**: Built via bundler to static assets (`index.html`, `js`, `css`). Served by Nginx, Vercel, or Netlify.
*   **Backend**: Node.js process managed by PM2 or Docker container. Hosted on AWS EC2, Heroku, or Render.
*   **Database**: Managed PostgreSQL instance (e.g., AWS RDS, Supabase, Neon).
*   **Assets**: User-uploaded images converted to Base64 (MVP) or uploaded to S3-compatible storage (Production).