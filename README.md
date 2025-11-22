<div align="center">

# 🚀 **TASK MANAGER API**

### **Production-grade backend engineered for real-world scale**

✨━━━━━━━━━━━━━━━━━━━  **❖**  ━━━━━━━━━━━━━━━━━━━✨

</div>

---

## 🧰 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5-black?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Caching-red?logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-lightblue?logo=cloudinary&logoColor=white)
![Multer](https://img.shields.io/badge/Uploads-Multer-yellow?logo=multer&logoColor=black)
![Render](https://img.shields.io/badge/Deployed%20On-Render-purple?logo=render&logoColor=white)
![Winston](https://img.shields.io/badge/Logging-Winston-blue?logo=winston&logoColor=white)
![Morgan](https://img.shields.io/badge/HTTP%20Logs-Morgan-green?logo=npm&logoColor=white)
![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20XSS%20%7C%20Sanitize-critical?logo=apache&logoColor=white)

---

## 🌐 Live Demo

🔗 **Live URL:** https://task-manager-6bu9.onrender.com  
📁 **GitHub Repo:** https://github.com/Ashishjha013/Task-Manager

---

## 📸 Screenshots

## 🔐 Login
![Login Screenshot](assets/screenshots/1-login.png)

## 📊 Tasks Cached
![Tasks Cached](assets/screenshots/2-task-list-cached.png)

## 👤 Profile
![Profile Screenshot](assets/screenshots/3-profile.png)

## 📝 Create Task
![Create Task Screenshot](assets/screenshots/4-create-task.png)

## 📈 Stats
![Stats Screenshot](assets/screenshots/5-stats.png)

## 🖼 Avatar Upload
![Avatar Upload Screenshot](assets/screenshots/6-avatar-upload.png)


---

## 🔥 Highlights

### 🔐 Authentication & Authorization
- Short-lived **Access Tokens**
- Long-lived **Refresh Tokens** (httpOnly cookies)
- Stored refresh tokens in DB (session pattern)
- Admin + User role-based authorization
- Full secure lifecycle: register → login → refresh → logout

### 📝 Task Management
- CRUD  
- Filtering, sorting, pagination  
- Full-text search  
- Aggregation analytics (`/stats`)  
- Owner/admin access control  
- Virtual populate (User ↔ Task)

### ⚡ Performance With Redis
- Cached listing and stats  
- User-scoped and filter-scoped keys  
- Automatic invalidation on create/update/delete  
- Config-driven TTL

### ☁️ Cloud Features
- Avatar uploads using Multer + Cloudinary  
- Cloud-stored URLs only  
- Clean delete pipeline  

### 🛡 Security
- Helmet, CORS, HPP  
- xss-clean  
- express-mongo-sanitize  
- Strict cookies  
- Rate limiting

### 📊 Observability
- Winston structured logger  
- Morgan request logs  
- Central error handler with consistent JSON  

---

## 🏗 High-Level Architecture

```
[Client]
   |
   v
HTTPS
   |
[Express Server]
   ├── Auth Layer (JWT)
   ├── Task Layer
   ├── File Upload Layer
   ├── Redis Cache
   ├── MongoDB Atlas
   └── Cloudinary
        |
   Winston + Morgan Logs
```

---

## 📡 Core Endpoints

### Auth
- POST `/api/users/register`
- POST `/api/users/login`
- POST `/api/users/refresh`
- POST `/api/users/logout`
- GET `/api/users/profile`
- GET `/api/users/admin`

### Tasks
- POST `/api/tasks`
- GET `/api/tasks`
- GET `/api/tasks/stats`
- GET `/api/tasks/:id`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

### Avatar
- POST `/api/users/avatar`
- DELETE `/api/users/avatar`

---

## ⚡ Quick Start (Local)

### 1️⃣ Clone
```bash
git clone https://github.com/Ashishjha013/Task-Manager.git
cd Task-Manager
```

### 2️⃣ Install
```bash
npm install
```

### 3️⃣ Environment Variables

```
PORT=8080
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_uri

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

REDIS_URL=your_redis_url
REDIS_TTL_SECONDS=300

FRONTEND_URL=http://localhost:3000
```

### 4️⃣ Run
```bash
npm run dev
```

---

## 🌐 Production Smoke Test

1. Register  
2. Login  
3. Hit `/profile`  
4. Create task  
5. List tasks → validate **cached**: true  
6. Hit `/stats`  
7. Upload avatar  

---

## 🎯 Engineering Rationale

- Access tokens protect short sessions  
- Refresh tokens allow session renewal without relogin  
- DB-stored refresh tokens allow revocation  
- Redis reduces DB load and improves response latency  
- Cloudinary avoids binary storage in your DB  
- Compound Mongo indexes improve query performance  
- Centralized error handler guarantees consistent DX  

---

## ✨ Author
**Ashish Kumar Jha**  
📍 India | 💻 Aspiring Software Engineer

---

## 📬 Connect with Me

- 🔗 GitHub: [Ashishjha013](https://github.com/Ashishjha013)
- 💼 LinkedIn: [Ashish Jha](https://www.linkedin.com/in/ashishjha13/)
- 📧 Email: [ashishjha1304@gmail.com](mailto:ashishjha1304@gmail.com)

---

## ✍️ Contribution & License

Feel free to fork and open PRs. Add clear unit/integration tests for controllers.

---

*Generated for: Ashish Jha — Task Manager*










