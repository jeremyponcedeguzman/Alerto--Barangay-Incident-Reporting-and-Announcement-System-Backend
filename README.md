# Barangay Emergency Notification System - Backend REST API

A Node.js and Express REST API backend for the Barangay Emergency Notification System, backed by MongoDB Atlas and secured with JSON Web Tokens (JWT).

---

## 📌 Technology Stack

- **Runtime & Framework:** Node.js + Express (ES Modules)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication & Security:** JSON Web Tokens (JWT), `bcryptjs`, `cors`
- **Logging & Dev Tools:** `morgan`, `dotenv`, `nodemon`
- **Version Control:** Git & GitHub

---

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── alertController.js    # Emergency alert publishing & filtering
│   │   ├── authController.js     # Admin / Official login & registration
│   │   ├── incidentController.js # Citizen incident reporting & tracking
│   │   └── residentController.js # Emergency contact directory & demographics
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # Standardized 404 & error handlers
│   ├── models/
│   │   ├── Alert.js              # Disaster/emergency broadcast schema
│   │   ├── Incident.js           # Citizen report schema
│   │   ├── Resident.js           # Directory & vulnerable group tagging (PWD, Seniors)
│   │   └── User.js               # Official/Admin account schema
│   ├── routes/
│   │   ├── alertRoutes.js        # /api/alerts
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── incidentRoutes.js     # /api/incidents
│   │   └── residentRoutes.js     # /api/residents
│   └── server.js                 # Express server & CORS configuration
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Excludes node_modules and .env
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure:
```ini
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/barangay_emergency_db?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> **MongoDB Atlas Tip:** Make sure your IP address is whitelisted in MongoDB Atlas under **Network Access** (or add `0.0.0.0/0` during development).

### 3. Run the Server
```bash
# Development mode (with live reload)
npm run dev

# Production start
npm start
```

The server will start at `http://localhost:5000`.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new official (first user auto-promoted to Admin) |
| `POST` | `/api/auth/login` | Public | Login official and receive JWT token |
| `GET` | `/api/auth/me` | Private | Get current authenticated user profile |
| `GET` | `/api/auth/officials` | Private | List all barangay staff / officials |

### 🚨 Emergency Alerts (`/api/alerts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/alerts` | Public | Get alerts (filter by `status`, `severity`, `type`, `search`) |
| `GET` | `/api/alerts/active` | Public | Get latest active alerts (for emergency banners) |
| `GET` | `/api/alerts/:id` | Public | Get alert details |
| `POST` | `/api/alerts` | Official/Admin | Broadcast a new emergency alert |
| `PUT` | `/api/alerts/:id` | Official/Admin | Update alert / mark as resolved |
| `DELETE`| `/api/alerts/:id` | Admin only | Delete alert |

### 📢 Incident Reports (`/api/incidents`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/incidents` | Public | Residents report an emergency/incident |
| `GET` | `/api/incidents` | Official/Admin | View all incident reports |
| `GET` | `/api/incidents/stats/overview` | Official/Admin | Summary stats (Pending, Responding, Resolved) |
| `GET` | `/api/incidents/:id` | Official/Admin | View incident report details |
| `PATCH`| `/api/incidents/:id/status` | Official/Admin | Update status & action taken notes |
| `DELETE`| `/api/incidents/:id` | Admin only | Delete incident report |

### 👥 Resident Directory (`/api/residents`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/residents` | Official/Admin | List residents (filter by `purok`, `search`, `vulnerable`) |
| `GET` | `/api/residents/stats/demographics` | Official/Admin | Demographics (Seniors, PWDs per purok) |
| `GET` | `/api/residents/:id` | Official/Admin | Get resident profile |
| `POST` | `/api/residents` | Official/Admin | Add resident to emergency directory |
| `PUT` | `/api/residents/:id` | Official/Admin | Update resident details |
| `DELETE`| `/api/residents/:id` | Admin only | Remove resident from directory |

---

## 🔗 Connecting with React Frontend (Axios)

In your React (Vite) app, configure your `axios` instance like this:

```typescript
// src/api/axios.ts in your React frontend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
