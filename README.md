# TrueCanvas 🎨

> **Pure Imagination. No Algorithms.**  
> TrueCanvas is a dedicated platform for human artists to share their original creations in a sanctuary protected from AI-generated content.

---

## ✨ Features

### 🖼️ Artistic Gallery
Experience a curated, masonry-style gallery with a premium, light-themed aesthetic. Designed to let the artwork breathe and speak for itself.

### 🛡️ AI Content Verification
Our proprietary AI detection system (built with Python & Flask) checks every upload. Only authentic, human-made art is accepted into the collective.

### 👥 Creative Community
- **Interactions**: Like and save your favorite masterpieces.
- **Micro-blogging**: Engage with artists through our elegant commenting system.
- **Connections**: Follow other visionaries and build your own creative network.

### 👤 Artist Studios (Profiles)
- **Identity**: Customize your artistic bio and avatar.
- **Gallery**: showcased your personal collection in a dedicated portfolio view.

### 🔍 SEO Optimized
Every artwork and artist profile is optimized with dynamic metadata for maximum discoverability on search engines.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Vanilla CSS (Artistic Design System)
- **Routing**: React Router DOM

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT & Cookies
- **Storage**: Cloudinary Integration

### AI Checker
- **Language**: Python
- **Framework**: Flask
- **Purpose**: Image authenticity verification

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/iftiarrafi/TrueCanvas.git
cd TrueCanvas
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=4000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# CLOUDINARY_CLOUD_NAME=xxx
# CLOUDINARY_API_KEY=xxx
# CLOUDINARY_API_SECRET=xxx
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 4. AI Checker Setup
```bash
cd ../ai_image_checker
# Install Python dependencies (requirements.txt)
python app.py
```

---

## 🎨 Design System

TrueCanvas uses a specific artistic palette to ensure a soft and airy feel:
- **Primary BG**: `#FDFCF0` (Cream)
- **Secondary BG**: `#FFF5E1` (Soft Peach)
- **Accent**: `#B4CDB0` (Sage Green)
- **Text**: `#2D2D2D` (Charcoal)
- **Typography**: *Playfair Display* (Headings) & *Inter* (Body)

---

## 🤝 Contributing
We welcome developers who believe in protecting human creativity. Feel free to open issues or submit pull requests.

---

## 📄 License
This project is licensed under the MIT License.

---

*Made with ❤️ for the global artist community.*
