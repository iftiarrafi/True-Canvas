# TrueCanvas 🎨
> **Pure Imagination. No Algorithms.** Our core mission is to showcase ONLY human-drawn art and protect it from algorithmic noise. TrueCanvas is a dedicated sanctuary exclusively for human artists. By identifying and blocking AI-generated uploads, we ensure that every piece of art in your feed is authentically human.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> [!NOTE]
> **Demo Overview**
> 
<div align="center">
  <img src="./assests/intro.gif" alt="TrueCanvas Demo" width="800"/>
</div>

## 🎯 Key Features
- **Vision Transformer (ViT) Gatekeeper**: We custom-trained a Vision Transformer model using PyTorch on a balanced dataset of Human vs. AI-generated art. Running on a dedicated Python server, this gatekeeper checks every artwork, strictly blocking any AI-generated uploads.
- **Secure Authentication & Media Delivery**: Rate-limiting to keep site safe from brute-force attack, features JWT authentication, secure HTTP-only cookies, bcrypt hashing, and automated Cloudinary integration for blazing-fast asset loads.
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
- **express-rate-limit**: Critical middleware installed to protect against brute-force attacks and DDOS by throttling repeated requests.
- **jsonwebtoken & bcrypt**: Robust cryptographic security for passwords and stateless cookie session management.
- **Cloudinary & multer**: Cloud-optimized media storage pipeline to handle memory-heavy image uploads directly on the server.
- **Nodemailer**: Triggers automated email deliveries.

### AI Gateway (Machine Learning)
- **Python & Flask**: Dedicated, lightweight REST interface connecting the PyTorch model to the main node server backend.
- **PyTorch**: Bleeding-edge deep learning framework used to train the model logic.
- **Vision Transformer (ViT)**: The specific neural network architecture meticulously trained to classify human creativity vs AI.

## 🚀 Quick Start
Get your local environment up and running in 3 simple steps:

**1. Clone & Install Dependencies**
```bash
git clone https://github.com/iftiarrafi/TrueCanvas.git
cd TrueCanvas
npm install --prefix backend && npm install --prefix frontend
```

**2. Configure Environment**
```bash
# Add your environment variables in the backend directory
cd backend
touch .env
```
*(Populate `.env` with the variables listed in the Configuration section below)*

**3. Launch the Application**
```bash
# Start backend, frontend, and AI checker (open 3 separate terminals)
npm run dev --prefix backend
npm start --prefix frontend
python ai_image_checker/app.py 
```

> [!TIP]
> Ensure your MongoDB instance is running, Python is installed for the Flask server, and your Cloudinary credentials are valid before launching the development server.

## ⚙️ Configuration
The application requires the following environment variables. Create a `.env` file in the `backend/` directory:

| Variable | Description | Example / Allowed Values |
|----------|-------------|---------|
| `PORT` | The port the backend server runs on | `3000` |
| `MONGODB_URL` | MongoDB cluster connection URI | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for robust JWT signing | `your_jwt_secret` |
| `JWT_EXPIRES` | Expiration lifespan for Auth cookies | `1d` |
| `salt` | Hashing complexity for bcrypt | `10` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary remote cloud identifier | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary REST API key | `123456789012345` |
| `CLOUDINARY_API_SECRET`| Cloudinary REST API secret | `abc123xyz_456def` |
| `EMAIL_USER` | Sender address for Nodemailer | `your@email.com` |
| `EMAIL_PASS` | SMTP app-specific password | `abcd efgh ijkl mnop` |

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐳 Docker

The backend can be containerized using Docker. Build the image and run the container with the following commands:

```bash
# Build the Docker image
docker build -t truecanvas-backend ./backend

# Run the container
docker run -d -p 4000:4000 --name truecanvas-backend truecanvas-backend
```

Make sure to set the required environment variables when running the container, for example:

```bash
docker run -d -p 4000:4000 \
  -e PORT=4000 \
  -e MONGODB_URL=your_mongo_uri \
  -e JWT_SECRET=your_jwt_secret \
  -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
  -e CLOUDINARY_API_KEY=your_api_key \
  -e CLOUDINARY_API_SECRET=your_api_secret \
  --name truecanvas-backend truecanvas-backend
```

This will start the backend API in a Docker container, ready to be used alongside the frontend and AI checker services.
