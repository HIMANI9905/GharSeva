# 🏠 GharSeva (ghar-seva) — AI-Powered Home Service Marketplace

<div align="center">

![GharSeva Banner](https://img.shields.io/badge/GharSeva-Home%20Services-2563EB?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-v4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-v8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

### **"Har Ghar Ki Har Zarurat, Ek Click Door"** 🇮🇳

🔗 **[Click Here to Visit GitHub Repository](https://github.com/HIMANI9905/GharSeva)** 🚀

---

</div>

## 📌 Project Overview

**GharSeva** is a full-stack, production-grade web application designed specifically for the Indian home services market. Built as an authentic, modern platform for Indian households, it connects customers directly with verified local service professionals (plumbers, electricians, AC technicians, home cleaners, painters, and carpenters).

The platform features an intelligent **AI Price Estimator Engine** that breaks down repair costs transparently, **Role-Based Access Control** for Customers and Service Helpers, and **Real-Time WebSockets Communication**.

---

## ✨ Key Features

### 🛍️ For Customers
* **Instant Service Search & Category Filtering**: Browse services by category (Electrician, Plumbing, AC Repair, Cleaning, Painting, Appliance Repair) with real-time text query filtering.
* **🤖 Smart AI Price Estimator**: Get intelligent price estimations and itemized cost breakdowns (labor charges, job duration, material estimate) before booking.
* **🔒 Verified Local Helper Directory**: View helper profiles, skill badges, experience level, Aadhaar verification tags, and ratings with hidden phone numbers prior to booking.
* **📅 Flexible Booking & Scheduling**: Choose date, time slot, and address with real-time status updates (*Pending ➔ Accepted ➔ In Progress ➔ Completed*).
* **💬 Real-Time Chat & Customer Support**: In-app WebSocket chat for direct coordination with assigned helpers.
* **⭐ Reviews & Rating System**: Leave post-service feedback and star ratings.

### 🛠️ For Service Helpers (Providers)
* **Dedicated Helper Dashboard**: Manage incoming service requests, accept or decline bookings, and track daily job schedules.
* **Earnings & Performance Summary**: Monitor total completed jobs, customer ratings, and monthly revenue.
* **Availability Toggle**: Enable or disable online availability for receiving new jobs.

---

## 🎨 Design System & Color Palette

GharSeva uses a warm, authentic Indian startup aesthetic designed to build immediate trust and familiarity for Indian households.

| Token Name | Hex Code | Usage |
| :--- | :---: | :--- |
| **Primary Blue** | `#2563EB` | Primary buttons, active nav links, brand highlights |
| **Saffron Accent** | `#E67E22` | Badges, secondary call-to-actions, rating stars, price tags |
| **Warm Cream** | `#FFF8EE` | Background canvas with subtle Indian geometric motifs |
| **Dark Charcoal** | `#1F2937` | High-contrast readable body text and headings |
| **Success Green** | `#15803D` | Verified badges, status indicators, positive feedback |

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework**: React.js 18 (Vite)
* **Styling**: Tailwind CSS v3.4 + Custom Utility System
* **Icons**: Lucide React Icons
* **Routing**: React Router DOM v6
* **State & Auth**: Context API + Custom Interceptors
* **Real-time Engine**: Socket.io-Client
* **Data Visualization**: Recharts

### **Backend**
* **Environment**: Node.js & Express.js (ES Modules)
* **Database**: MongoDB & Mongoose ORM
* **Authentication**: JSON Web Tokens (JWT) + Bcrypt Password Hashing
* **File Management**: Multer + Cloudinary Storage
* **Security Middleware**: Helmet, CORS, Express-Rate-Limit, Express-Validator
* **Real-Time Server**: Socket.io Engine

---

## 📁 Repository Structure

```text
GharSeva/
├── frontend/                  # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/        # Navbar, Footer, AIChatbotWidget, MapWidget, Modals
│   │   ├── context/           # AuthContext & SocketContext
│   │   ├── pages/             # Landing, Services, Providers, AI Estimator, Auth, Dashboards
│   │   ├── services/          # Axios API Gateway
│   │   ├── index.css          # Design Tokens & Traditional Motifs
│   │   └── App.jsx            # Main App Routing & Guards
│   ├── index.html             # Google Fonts & SEO Meta Tags
│   ├── tailwind.config.js     # Custom Design Palette
│   └── vite.config.js         # Bundler Configuration
│
└── backend/                   # Node.js + Express REST API Server
    ├── config/                # MongoDB Database Connection
    ├── controllers/           # Auth, Service, Provider, Booking, AI Controllers
    ├── middleware/            # JWT Verification & Role Authorization Guards
    ├── models/                # User, Provider, Service, Booking, Review Schemas
    ├── routes/                # Express API Routes
    ├── services/              # Email Notifications Service
    ├── utils/                 # Seeder Scripts for Demo Data
    └── server.js              # Entry Point & Socket.io Initialization
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/HIMANI9905/GharSeva.git
cd GharSeva
```

### 2. Setup & Run Backend
```bash
cd backend
npm install

# Create a .env file inside backend folder with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/gharseva
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:5173

# Seed initial database with services & demo users
npm run seed

# Start Backend Server
npm run dev
```

### 3. Setup & Run Frontend
```bash
cd ../frontend
npm install

# Start Vite Development Server
npm run dev
```

Visit `http://localhost:5173` in your browser to view the live application!

---

## 🔐 Demo Accounts for Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `customer@demo.com` | `123456` |
| **Service Helper** | `provider1@demo.com` | `123456` |

---

## 🔗 Links

* **GitHub Repository**: [https://github.com/HIMANI9905/GharSeva](https://github.com/HIMANI9905/GharSeva)

---

## 📑 License & Acknowledgements

Created with ❤️ for Major B.Tech Project. Open-source under the [MIT License](LICENSE).
