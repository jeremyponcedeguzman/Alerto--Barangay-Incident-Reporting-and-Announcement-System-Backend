# 🚨 Alerto: Barangay Emergency Notification and Incident Reporting System

> **Course:** Advanced Web Programming (CTADWEBL) — Major Examination (Final Project)  
> **Institution:** School of Architecture, Technology, and Computing — Computer Science and Information Technology Department, NU Clark  
> **Academic Year:** 2026–2027  

---

## 👥 Group Members
- **Jeremy Ponce S. De Guzman**
- **Bryne T. Magat**
- **Daniel Carl P. Pillado**
- **Wendell Angelo P. Sambile**
- **Christian Luis Santos**

---

## 📌 Project Concept & Domain

In community disaster risk reduction and management (DRRM), timely notification and rapid response coordination save lives. In many local barangays, emergency dispatching and hazard reporting still rely on disjointed phone calls, unverified social media posts, or physical walk-ins, causing communication bottlenecks during critical emergencies like residential fires, flash floods, or medical crises.

**Alerto** is an emergency notification and incident tracking platform engineered for Barangay operations. It bridges residents and barangay emergency responders:
- **Citizens & Residents:** Report verified real-time emergency incidents from their smartphones or computers with GPS coordinates and live camera photo evidence.
- **Barangay Operations Center & Officials:** Monitor incident feeds on an interactive map, triage dispatch to specialized units (BFP Firefighters, DRRMO Rescue, BHERT Medics, and Barangay Tanod), evaluate neighborhood hazard density, and broadcast instant public safety advisories across community zones (Puroks and Sitios).

---

## ⚙️ What the Application Does & What Data It Processes

Beyond basic record storage, Alerto performs extensive computation, spatial filtering, and business logic over incident and demographic data:

### 1. Data Aggregations & Status Metrics
- **Incident Status Pipeline:** Computes real-time distribution of incidents across progressive status stages:
  $$\text{Pending Review} \longrightarrow \text{Dispatched} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \text{ (or Dismissed)}$$
- **Severity & Category Breakdown:** Evaluates distribution across emergency classifications (`fire`, `flood`, `medical`, `police`, `accident`, `hazard`) to help dispatchers allocate personnel efficiently.

### 2. Demographic Risk Profiling & Evacuation Prioritization
- Evaluates resident directories aggregated by Purok and Sitio.
- Calculates high-risk ratios:
  $$\text{Vulnerability Ratio} = \frac{\text{Senior Citizens} + \text{Persons with Disabilities (PWD)}}{\text{Total Registered Residents}}$$
  Used by disaster response teams to prioritize flood and fire evacuation routes in sectors with high senior/PWD populations.

### 3. Spatial Density & Heatmap Clustering Rules
- Computes incident concentration per geographic zone.
- When reports within an emergency category exceed the cluster threshold ($N \ge 3$ within adjacent coordinates), the system dynamically triggers high-density clustering indicators and heatmap layers for operational monitoring.

### 4. Dynamic Time Computations
- Evaluates real-time elapsed durations against ISO timestamps (`createdAt`).
- Computes dynamic human-readable relative ages (e.g., *"Just now"*, *"12 minutes ago"*, *"2 hours ago"*) refreshed via client and server timestamps.

### 5. Multi-Criteria Query Filtering & Sorting
- Dynamic filtering across multiple overlapping criteria: category slugs, urgency severity, dispatch status, zone/purok, and case-insensitive regex full-text search across titles, descriptions, and reporter names.

---

## 🖼️ Application Architecture & Screenshots

### High-Level Architecture
```
┌────────────────────────────────┐          ┌──────────────────────────────────┐
│   React Frontend Application   │          │     Express REST API Backend     │
│  - React Router (14+ Pages)    │          │  - Modular Router Architecture   │
│  - Leaflet Map & Heatmap       │ ───────> │  - JWT Authentication Middleware │
│  - WebRTC Camera Capture       │  Axios   │  - Morgan HTTP Request Logger    │
│  - React Hook Form + Zod       │ <─────── │  - Centralized Error Handling    │
└────────────────────────────────┘          └──────────────────────────────────┘
                                                              │
                                      ┌───────────────────────┴───────────────────────┐
                                      ▼                                               ▼
                         ┌───────────────────────────┐                 ┌───────────────────────────┐
                         │   MongoDB Atlas Database  │                 │    Cloudinary Media CDN   │
                         │  - Users & Residents      │                 │  - Live Camera Snapshots  │
                         │  - Incidents & Alerts     │                 │  - Photo Evidence Storage │
                         │  - Mongoose ODM Schemas   │                 │  - Secure HTTPS URLs      │
                         └───────────────────────────┘                 └───────────────────────────┘
```

### Application Screenshots

| Live Incident Map & Operations Center | Resident Camera Evidence Capture |
| :---: | :---: |
| ![Incident Map Preview](https://via.placeholder.com/600x350?text=Live+Incident+Map+and+Dispatch+Tracker) | ![Camera Capture Preview](https://via.placeholder.com/600x350?text=WebRTC+Live+Camera+Evidence+Capture) |
| *Interactive Leaflet map showing real-time emergency pins and heatmaps* | *Anti-tamper camera snapshot upload directly to Cloudinary* |

| Emergency Broadcast Advisories | Vulnerable Demographics Analytics |
| :---: | :---: |
| ![Advisories Preview](https://via.placeholder.com/600x350?text=Public+Safety+Advisories+and+Alerts) | ![Demographics Preview](https://via.placeholder.com/600x350?text=Purok+Vulnerability+and+Demographic+Analytics) |
| *Public advisories with priority badges (Emergency, Weather, General)* | *Demographic aggregations identifying high-risk PWD and Senior zones* |

---

## 🛠️ Setup Instructions & Prerequisites

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** Active MongoDB Atlas cluster connection string or local MongoDB instance (`mongodb://127.0.0.1:27017/barangay_emergency_db`)
- **Cloudinary Account:** Free Cloudinary cloud environment for image CDN hosting

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeremyponcedeguzman/Alerto--Barangay-Incident-Reporting-and-Announcement-System-Backend.git
   cd Alerto--Barangay-Incident-Reporting-and-Announcement-System-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

4. **Start the backend server:**
   ```bash
   # Development mode with nodemon auto-restart:
   npm run dev

   # Standard production start:
   npm start
   ```

5. **Verify server operation:**
   Open your browser or API tester to `http://localhost:5000/api/health`. You will receive:
   ```json
   {
     "status": "healthy",
     "timestamp": "2026-10-15T14:20:00.000Z",
     "uptime": 12.45,
     "cloudinaryConfigured": true
   }
   ```

---

## 🔐 Environment Variables

The server relies on the following environment variables configured in `.env`. A complete template is committed in [`.env.example`](.env.example):

| Variable | Required | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Port on which the Express server listens | `5000` |
| `MONGO_URI` | **Yes** | MongoDB Atlas or local connection string | `mongodb+srv://user:pass@cluster.mongodb.net/barangay_db` |
| `JWT_SECRET` | **Yes** | Secret cryptographic key used to sign and verify JWT tokens | `barangay_emergency_secret_key_change_me` |
| `FRONTEND_URL` | Optional | Permitted CORS origin for the React Vite client | `http://localhost:5173` |
| `NODE_ENV` | Optional | Runtime environment (`development` or `production`) | `development` |
| `ADMIN_SECRET_CODE` | **Yes** | Security passphrase required during administrative registration | `ANUPUL2026` |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Unique cloud identifier in your Cloudinary account | `oaxdxwvz` |
| `CLOUDINARY_API_KEY` | **Yes** | Public API client key for Cloudinary | `195176249917891` |
| `CLOUDINARY_API_SECRET` | **Yes** | Private secret key for server-side Cloudinary signing | `cb08EfKQEq_Fg8f7SvRHNd2SF40` |
| `CLOUDINARY_URL` | Optional | Combined connection URL syntax | `cloudinary://<key>:<secret>@<cloud_name>` |

---

## 📡 Complete REST API Documentation Table

All endpoints use REST conventions, standard HTTP methods, JSON request/response formats, and proper status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`).

| Method | Endpoint | Purpose | Access | Sample Request Payload | Sample Response Payload | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :---: |
| `GET` | `/` | Root API health status & version info | Public | *None* | `{"message": "Barangay Emergency Notification System API is running", "version": "1.0.0", "cloudinaryEnabled": true}` | `200` |
| `GET` | `/api/health` | Diagnostics & Cloudinary health check | Public | *None* | `{"status": "healthy", "uptime": 45.1, "cloudinaryConfigured": true}` | `200` |
| `POST` | `/api/auth/register` | Register new resident (pending verification) | Public | `{"firstName": "Maria", "lastName": "Santos", "email": "maria@gmail.com", "contactNumber": "09181112222", "sitioAddress": "Sitio Mape", "password": "password123"}` | `{"success": true, "message": "Residency application submitted", "token": "eyJhbG...", "user": {"id": "REG-172901", "fullName": "Maria Santos"}}` | `201` |
| `POST` | `/api/auth/login` | Authenticate resident or official via email/phone | Public | `{"identifier": "resident@gmail.com", "password": "resident123"}` | `{"success": true, "message": "Login successful", "token": "eyJhbGciOi...", "user": {"id": "RES-01", "role": "resident"}}` | `200` |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Private | *Headers: `Authorization: Bearer <token>`* | `{"success": true, "user": {"_id": "670f...", "fullName": "Juan Dela Cruz", "role": "resident"}}` | `200` |
| `GET` | `/api/auth/officials` | Retrieve list of registered barangay officials | Private | *Headers: `Authorization: Bearer <token>`* | `{"success": true, "count": 2, "data": [{"fullName": "Hon. Roberto Santos", "position": "Barangay Captain"}]}` | `200` |
| `POST` | `/api/incidents` | Submit emergency report with live photo evidence | Public | `{"title": "Structure Fire", "category": "fire", "severity": "critical", "locationName": "Kamagong St.", "lat": 14.5632, "lng": 121.0155, "description": "Smoke from residential roof", "imageEvidence": "data:image/jpeg;base64,..."}` | `{"success": true, "message": "Incident report submitted successfully", "data": {"customId": "INC-2026-001", "imageEvidence": "https://res.cloudinary.com/.../img.jpg", "status": "Pending"}}` | `201` |
| `GET` | `/api/incidents` | List incidents with category, severity, and search filters | Public | *Query: `?category=fire&status=In+Progress`* | `{"success": true, "count": 1, "data": [{"customId": "INC-2026-001", "title": "Structure Fire", "status": "In Progress"}]}` | `200` |
| `GET` | `/api/incidents/:id` | Fetch single incident by Mongo ID or custom ID | Public | *None* | `{"success": true, "data": {"customId": "INC-2026-001", "title": "Structure Fire", "responder": "BFP Firefighters 🚒"}}` | `200` |
| `PATCH` | `/api/incidents/:id` | Update dispatch status, responder, or votes | Private (Official/Admin) | `{"status": "Dispatched", "responder": "BFP Unit 1"}` | `{"success": true, "message": "Incident status updated successfully", "data": {"status": "Dispatched"}}` | `200` |
| `PATCH` | `/api/incidents/:id/status` | Update incident status and response action notes | Private (Official/Admin) | `{"status": "Resolved", "actionTakenNotes": "Fire fully extinguished by BFP"}` | `{"success": true, "message": "Incident status updated successfully", "data": {"status": "Resolved"}}` | `200` |
| `DELETE` | `/api/incidents/:id` | Delete incident and delete photo from Cloudinary | Private (Admin) | *None* | `{"success": true, "message": "Incident report deleted successfully"}` | `200` |
| `GET` | `/api/incidents/stats/overview` | Compute aggregate incident counts by status | Public | *None* | `{"success": true, "stats": {"total": 12, "pending": 3, "verified": 2, "responding": 5, "resolved": 2}}` | `200` |
| `GET` | `/api/alerts` | List all broadcast advisories with filters | Public | *Query: `?status=Active`* | `{"success": true, "count": 3, "data": [{"title": "Rainfall Warning", "severity": "High", "status": "Active"}]}` | `200` |
| `GET` | `/api/alerts/active` | Retrieve top active alerts for marquee banner | Public | *None* | `{"success": true, "count": 2, "data": [{"title": "Typhoon Warning", "severity": "Critical"}]}` | `200` |
| `GET` | `/api/alerts/:id` | Fetch single advisory by ID | Public | *None* | `{"success": true, "data": {"title": "Rainfall Warning", "instructions": "Move to higher ground"}}` | `200` |
| `POST` | `/api/alerts` | Issue official broadcast advisory to residents | Private (Official/Admin) | `{"title": "Creek Flood Warning", "type": "Flood", "severity": "High", "description": "Water reaching warning level", "targetPuroks": ["Sitio Centro", "Sitio Mape"]}` | `{"success": true, "message": "Emergency alert published successfully", "data": {"_id": "670f...", "title": "Creek Flood Warning"}}` | `201` |
| `PUT` | `/api/alerts/:id` | Update advisory content or status | Private (Official/Admin) | `{"status": "Resolved", "instructions": "Residents may return home"}` | `{"success": true, "message": "Emergency alert updated successfully"}` | `200` |
| `DELETE` | `/api/alerts/:id` | Remove advisory from broadcast | Private (Admin) | *None* | `{"success": true, "message": "Emergency alert deleted successfully"}` | `200` |
| `POST` | `/api/residents/register` | Public self-registration into emergency contact list | Public | `{"fullName": "Carlos Reyes", "contactNumber": "09170001111", "purok": "Sitio Centro", "isSeniorCitizen": false, "isPWD": false}` | `{"success": true, "message": "Resident registered to emergency notification directory", "data": {"_id": "670f..."}}` | `201` |
| `GET` | `/api/residents` | List directory residents with vulnerability filters | Private (Official/Admin) | *Query: `?vulnerable=true&purok=Sitio+Centro`* | `{"success": true, "count": 5, "data": [{"fullName": "Ben Perez", "isSeniorCitizen": true}]}` | `200` |
| `GET` | `/api/residents/stats/demographics` | Compute vulnerable population breakdown per purok | Private (Official/Admin) | *None* | `{"success": true, "data": {"totalResidents": 45, "seniorCitizens": 12, "pwds": 4, "purokBreakdown": [{"_id": "Sitio Centro", "total": 20, "seniors": 6, "pwds": 2}]}}` | `200` |
| `GET` | `/api/residents/:id` | Retrieve single resident directory profile | Private (Official/Admin) | *None* | `{"success": true, "data": {"fullName": "Ben Perez", "emergencyContactPerson": "Ana Perez"}}` | `200` |
| `POST` | `/api/residents` | Official adds resident with priority tagging | Private (Official/Admin) | `{"fullName": "Rosa Diaz", "contactNumber": "09192223333", "purok": "Sitio Pag-asa", "isSeniorCitizen": true}` | `{"success": true, "message": "Resident registered to emergency notification directory"}` | `201` |
| `PUT` | `/api/residents/:id` | Update resident contact or evacuation needs | Private (Official/Admin) | `{"isPWD": true, "emergencyContactNumber": "09178889999"}` | `{"success": true, "message": "Resident record updated successfully"}` | `200` |
| `DELETE` | `/api/residents/:id` | Remove resident record from directory | Private (Admin) | *None* | `{"success": true, "message": "Resident removed from emergency directory"}` | `200` |
| `POST` | `/api/upload` | Upload standalone image/file to Cloudinary CDN | Public | `{"image": "data:image/jpeg;base64,...", "folder": "barangay-emergency/evidence"}` | `{"success": true, "url": "https://res.cloudinary.com/oaxdxwvz/image/upload/...jpg", "publicId": "barangay-emergency/evidence/xyz", "cloudinaryEnabled": true}` | `200` |

---

## ✨ Core Features & Known Limitations

### Core Features
- **Live Geolocation Tracking:** Reports are rendered as interactive markers on an OpenStreetMap / Google Road tile layer with dynamic category icons and pulse animations.
- **Hardware Camera Verification:** Bypasses static image gallery uploads by streaming live camera hardware video (`navigator.mediaDevices.getUserMedia`) to capture authentic on-the-scene photographic evidence.
- **Cloudinary CDN Integration:** High-resolution base64 camera snapshots are automatically offloaded to Cloudinary's media cloud, keeping the MongoDB database lightweight and fast.
- **Automated Dispatch Routing:** Automatically assigns incoming reports to specialized response teams based on the incident classification:
  - `fire` $\to$ Bureau of Fire Protection (BFP) 🚒
  - `flood` $\to$ Disaster Risk Reduction & Management Office (DRRMO) 🌊
  - `medical` $\to$ Barangay Health Emergency Response Team (BHERT) 🚑
  - `police` $\to$ Barangay Tanod & PNP 👮
  - `accident` $\to$ Traffic Enforcement & Tanod ⚠️
  - `hazard` $\to$ Barangay Engineering & Electric Cooperative ⚡
- **Role-Based Security:** Granular access protection using JWT authorization middleware separating authenticated Residents, Barangay Officials, and System Administrators.
- **Vulnerability-Aware Evacuation Planning:** Aggregates demographics across Sitios and Puroks to prioritize rescue assistance for senior citizens and persons with disabilities (PWDs).

### Known Limitations
- **Cellular SMS Gateway:** In the current prototype, emergency broadcasts are delivered instantaneously through the web dashboard, active tickers, and directory records. Direct carrier SMS dispatch requires a commercial SMS API subscription (e.g., Semaphore or Twilio).
- **WebRTC Camera Permissions:** Live photo capture requires HTTPS (or `localhost`) and user permission to access the device's camera hardware. Devices without camera access fall back to GPS pin placement.
- **Client-Side Geolocation Accuracy:** GPS coordinates rely on the client device's browser Geolocation API (`navigator.geolocation`). In indoor desktop environments, position accuracy may default to nearby cellular/ISP towers or the central Barangay Operations Center coordinates.
