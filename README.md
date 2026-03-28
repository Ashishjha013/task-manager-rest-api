# 🚀 TASK MANAGER API
# Production-grade backend engineered for real-world scalability
# ============================================================

# ✨━━━━━━━━━━━━━━━━━━━ ❖ ━━━━━━━━━━━━━━━━━━━✨

# ⚡ Quick Features Summary
# ✔ JWT Auth (Access + Refresh Tokens)
# ✔ Admin & User Roles
# ✔ Task CRUD with Pagination & Filters
# ✔ Aggregation-based Task Statistics
# ✔ Redis Caching (Tasks + Stats)
# ✔ Cloudinary Avatar Uploads
# ✔ Production-grade Security Middleware
# ✔ Winston Logging + Centralized Error Handling
# ✔ Clean Controller–Service Architecture

# ============================================================
# 🧰 Tech Stack (Badges)

# ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
# ![Express.js](https://img.shields.io/badge/Express.js-5-black?logo=express)
# ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
# ![Redis](https://img.shields.io/badge/Redis-Caching-red?logo=redis)
# ![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)
# ![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-blue?logo=cloudinary)
# ![Multer](https://img.shields.io/badge/Uploads-Multer-yellow)
# ![Winston](https://img.shields.io/badge/Logging-Winston-blue)
# ![Morgan](https://img.shields.io/badge/HTTP%20Logs-Morgan-green)
# ![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20XSS%20%7C%20Sanitize-critical)
# ![Render](https://img.shields.io/badge/Deployed%20On-Render-purple)

# ============================================================
# 🎯 Tech Highlights

# - JWT authentication with access & refresh tokens (httpOnly cookies)
# - Refresh tokens stored in DB for session revocation
# - Redis caching layer for high-performance retrieval
# - Cloudinary upload_stream for efficient avatar uploads
# - MongoDB Aggregation Pipeline for analytics
# - Winston + Morgan logging for observability
# - Security middleware: Helmet, Rate Limiting, XSS, Mongo sanitize
# - Virtual populate (User ↔ Tasks)
# - Clean modular scalable architecture

# ============================================================
# 🌐 Live Demo

# API: https://task-manager-6bu9.onrender.com
# GitHub: https://github.com/Ashishjha013/task-manager-rest-api

# ============================================================
# 📸 Screenshots

# 🔐 Login
# ![Login Screenshot](assets/screenshots/1-login.png)

# 📝 Tasks Cached
# ![Tasks Cached](assets/screenshots/2-task-list-cached.png)

# 👤 Profile
# ![Profile Screenshot](assets/screenshots/3-profile.png)

# 📝 Create Task
# ![Create Task Screenshot](assets/screenshots/4-create-task.png)

# 📊 Stats
# ![Stats Screenshot](assets/screenshots/5-stats.png)

# 🖼 Avatar Upload
# ![Avatar Upload Screenshot](assets/screenshots/6-avatar-upload.png)

# ============================================================
# 🔥 Features (Detailed)

# 🔐 Authentication & Authorization
# - Register / Login / Logout
# - Access + Refresh token lifecycle
# - DB-stored refresh tokens for revocation
# - Role-based access control
# - Secure httpOnly cookies

# ------------------------------------------------------------

# 📝 Task Management
# - Full CRUD operations
# - Search, filter, and sort
# - Pagination
# - Aggregation-based stats
# - Owner-based access control
# - Admin access to all tasks

# ------------------------------------------------------------

# ⚡ Redis Caching
# - Cache GET /tasks
# - Cache stats endpoint
# - Auto invalidation on create/update/delete
# - Query-aware cache keys

# ------------------------------------------------------------

# ☁️ Cloud Features
# - Multer (memory storage)
# - Cloudinary upload_stream
# - Auto delete old avatars

# ------------------------------------------------------------

# 🛡 Security
# - Helmet
# - Rate limiting
# - CORS
# - express-mongo-sanitize
# - xss-clean
# - Secure httpOnly cookies

# ------------------------------------------------------------

# 📊 Observability
# - Winston structured logs
# - Morgan request logs
# - Centralized error handler
# - Async wrapper

# ============================================================
# 🧱 API Endpoints

# Auth
# POST   /api/users/register
# POST   /api/users/login
# POST   /api/users/refresh
# POST   /api/users/logout
# GET    /api/users/profile
# POST   /api/users/avatar
# DELETE /api/users/avatar

# ------------------------------------------------------------

# Tasks
# POST   /api/tasks
# GET    /api/tasks
# GET    /api/tasks/stats
# GET    /api/tasks/:id
# PUT    /api/tasks/:id
# DELETE /api/tasks/:id

# ============================================================
# 🧪 Sample API Response

# {
#   "task": {
#     "title": "Complete Backend Project",
#     "description": "Finish API endpoints and caching",
#     "priority": "High",
#     "status": "Pending",
#     "owner": "674d1fbe9c8f123abc45ef90"
#   }
# }

# ============================================================
# 🏗 Architecture

# Client
#   |
# HTTPS
#   |
# Express Server
#   ├── Auth Layer (JWT)
#   ├── Task Layer
#   ├── File Upload Layer
#   ├── Redis Cache
#   ├── MongoDB Atlas
#   └── Cloudinary
#
# Logging:
#   ├── Winston
#   └── Morgan

# ============================================================
# ⚡ Quick Start (Local)

# 1. Clone
git clone https://github.com/Ashishjha013/task-manager-rest-api.git

# 2. Enter project
cd task-manager-rest-api

# 3. Install dependencies
npm install

# 4. Create environment file
touch .env

# 5. Add environment variables
cat <<EOF > .env
PORT=8080
NODE_ENV=development

MONGO_URI=your_mongodb_uri

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_AVATAR_FOLDER=task-manager-avatars

REDIS_URL=your_redis_url
REDIS_TTL_SECONDS=300

FRONTEND_URL=http://localhost:3000
EOF

# 6. Run server
npm run dev

# ============================================================
# 🌐 Production Smoke Test

# 1. Register
# 2. Login
# 3. Hit /profile
# 4. Create task
# 5. GET /tasks (check cache)
# 6. GET /tasks/stats
# 7. Upload avatar

# ============================================================
# 🎯 Engineering Rationale

# - Access tokens → short-lived security
# - Refresh tokens → session continuity
# - DB-stored refresh tokens → revocation
# - Redis → reduces DB load, faster responses
# - Cloudinary → avoids storing binary in DB
# - Indexing → improves query performance
# - Central error handler → consistent API behavior

# ============================================================
# 👨‍💻 Author

# Ashish Kumar Jha
# India | Backend Engineer

# GitHub: https://github.com/Ashishjha013
# LinkedIn: https://www.linkedin.com/in/ashishjha13/
# Email: ashishjha1304@gmail.com
# ============================================================
