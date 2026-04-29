# TrueCanvas 🎨
> **Pure Imagination. No Algorithms.** Our core mission is to showcase ONLY human-drawn art and protect it from algorithmic noise. TrueCanvas is a dedicated sanctuary exclusively for human artists. By identifying and blocking AI-generated uploads, we ensure that every piece of art in your feed is authentically human.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> [!NOTE]
> **Demo Overview**
> 
<div align="center">
  <img src="./assests/intro.gif" alt="TrueCanvas Demo" width="400"/>
</div>

## 🎯 Key Features
- **Vision Transformer (ViT) Gatekeeper**: We custom-trained a Vision Transformer model using PyTorch on a balanced dataset of Human vs. AI-generated art. Running on a dedicated Python server, this gatekeeper checks every artwork, strictly blocking any AI-generated uploads.
- **Redis-Cached Authentication**: User sessions are cached in Redis on login, eliminating redundant MongoDB queries on every authenticated request. Cache is automatically invalidated on logout and profile updates.
- **Secure Authentication & Media Delivery**: Rate-limiting to keep site safe from brute-force attack, features JWT authentication, secure HTTP-only cookies, bcrypt hashing, and automated Cloudinary integration for blazing-fast asset loads.
- **Docker Compose Orchestration**: Full containerized deployment with Docker Compose — Redis and backend services spin up with a single command, connected via health checks and shared networking.
- **Full MERN Stack + PyTorch Architecture**: Seamlessly integrates MongoDB, Express.js, React, Node.js alongside an advanced PyTorch deep learning backend.

## 🛠️ Tech Stack & Libraries
This project leverages a powerful combination of web and machine learning technologies:

### Frontend (User Interface & State)
- **React.js**: Dynamic and responsive UI rendering.
- **Redux Toolkit**: Centralized state management for artists and posts.
- **React Router DOM**: Seamless client-side navigation without page reloads.
- **Axios**: Automated HTTP client for server communication.

### Backend (Server & Database)
- **Node.js & Express.js**: Fast, event-driven web framework for the core API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database with strict schema validation.
- **Redis**: In-memory data store used for caching authenticated user sessions, significantly reducing database load on repeated requests.
- **express-rate-limit**: Critical middleware installed to protect against brute-force attacks and DDOS by throttling repeated requests.
- **jsonwebtoken & bcrypt**: Robust cryptographic security for passwords and stateless cookie session management.
- **Cloudinary & multer**: Cloud-optimized media storage pipeline to handle memory-heavy image uploads directly on the server.
- **Nodemailer**: Triggers automated email deliveries.

### Infrastructure & DevOps
- **Docker**: Backend is containerized using a multi-stage `Dockerfile` with `node:20-alpine`.
- **Docker Compose**: Orchestrates the backend API and Redis services with health checks, persistent volumes, and automatic restarts.

### AI Gateway (Machine Learning)
- **Python & Flask**: Dedicated, lightweight REST interface connecting the PyTorch model to the main node server backend.
- **PyTorch**: Bleeding-edge deep learning framework used to train the model logic.
- **Vision Transformer (ViT)**: The specific neural network architecture meticulously trained to classify human creativity vs AI.

## 🚀 Quick Start
Get your local environment up and running:

### Option 1 — Docker Compose (Recommended)
Spin up the backend + Redis in one command:

```bash
git clone https://github.com/iftiarrafi/TrueCanvas.git
cd TrueCanvas

# Start backend + Redis containers
docker-compose up --build -d

# Start frontend (separate terminal)
npm install --prefix frontend
npm start --prefix frontend

# Start AI checker (separate terminal)
python ai_image_checker/app.py
```

> [!TIP]
> `docker-compose up` automatically starts Redis and the backend. No need to install Redis locally.

### Option 2 — Manual Setup
```bash
git clone https://github.com/iftiarrafi/TrueCanvas.git
cd TrueCanvas
npm install --prefix backend && npm install --prefix frontend
```

Configure environment variables (see Configuration below), then:

```bash
# Start backend, frontend, and AI checker (3 separate terminals)
npm run dev --prefix backend
npm start --prefix frontend
python ai_image_checker/app.py
```

> [!IMPORTANT]
> If running manually, you need a Redis instance running on `localhost:6379`. Install Redis locally or run `docker run -d -p 6379:6379 redis:7-alpine`.

## ⚡ Redis Caching Strategy

The backend uses Redis to cache authenticated user data, reducing MongoDB queries on every request:

| Event | Action | Cache Key |
|-------|--------|-----------|
| **Login** | User data cached after successful password verification | `user:<id>` + `login:<email>` |
| **Authenticated Request** | Auth middleware checks Redis before MongoDB | `user:<id>` |
| **Logout** | Both cache keys invalidated | `user:<id>` + `login:<email>` |
| **Profile Update** | Both cache keys invalidated to prevent stale data | `user:<id>` + `login:<email>` |

- **TTL**: All cache entries expire after **24 hours** (matching JWT expiry).
- **Graceful Fallback**: If Redis is unavailable, the app falls back to MongoDB automatically — no downtime.

## 🐳 Docker

### Docker Compose (Backend + Redis)

The `docker-compose.yml` at the project root orchestrates two services:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `redis` | `redis:7-alpine` | `6379` | In-memory cache for user sessions |
| `backend` | Built from `./backend/Dockerfile` | `4000` | Node.js API server |

```bash
# Start all services
docker-compose up --build -d

# View logs
docker logs truecanvas-backend
docker logs truecanvas-redis

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Standalone Backend Container
If you prefer to manage Redis separately:

```bash
# Build the Docker image
docker build -t truecanvas-backend ./backend

# Run with environment variables
docker run -d -p 4000:4000 \
  --env-file ./backend/.env \
  -e REDIS_URL=redis://your-redis-host:6379 \
  --name truecanvas-backend truecanvas-backend
```

## ⚙️ Configuration
The application requires the following environment variables. Create a `.env` file in the `backend/` directory:

| Variable | Description | Example / Allowed Values |
|----------|-------------|---------|
| `PORT` | The port the backend server runs on | `3000` |
| `MONGODB_URL` | MongoDB cluster connection URI | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for robust JWT signing | `your_jwt_secret` |
| `JWT_EXPIRES` | Expiration lifespan for Auth cookies | `1d` |
| `salt` | Hashing complexity for bcrypt | `10` |
| `REDIS_URL` | Redis connection URI | `redis://localhost:6379` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary remote cloud identifier | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary REST API key | `123456789012345` |
| `CLOUDINARY_API_SECRET`| Cloudinary REST API secret | `abc123xyz_456def` |
| `EMAIL_USER` | Sender address for Nodemailer | `your@email.com` |
| `EMAIL_PASS` | SMTP app-specific password | `abcd efgh ijkl mnop` |

> [!NOTE]
> When using Docker Compose, `REDIS_URL` is automatically set to `redis://redis:6379` (the container hostname). You don't need to set it manually.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
