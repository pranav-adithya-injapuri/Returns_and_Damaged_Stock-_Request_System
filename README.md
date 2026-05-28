# Returns & Damaged Stock Request System

A modern, production-grade, full-stack pharmacy/medical inventory workflow application where pharmacies can submit expired or damaged medicine return requests to distributors/admins. Integrated with **Gemini Pro Vision** to automatically analyze and transcribe medicine pack details from images.

---

## 🌐 Live Demo
You can view the live, deployed frontend for this project here:
**[Paste your Vercel URL here]**

---

## 🌟 Features

### 🏥 Pharmacy Users
- **Dummy Session Authentication**: Secure local session store.
- **Create Return Requests**: Input medicine details (Name, Batch, Expiry, Qty, Reason).
- **Base64 Photo Upload**: Submit visual packaging proof directly to the backend.
- **AI Condition Check**: Instant Gemini analysis report returned upon creation.
- **Submission History**: Real-time request filters (Search by name/batch, filter by Pending/Approved/Rejected).

### 🛡️ Admin Verification Managers
- **Overview Dashboard**: Aggregated key statistics metrics (Total, Pending, Approved, Rejected) and live activity logs.
- **Centralized Panel**: Track requests submitted by all pharmacies.
- **Image Inspector**: Visual proof scanner for uploads.
- **Gemini AI Transcription**: Review AI feedback on brand readability, package integrity, visible expiry dates, and moisture dampness.
- **Approve/Reject Actions**: Instant database updates reflecting request decisions.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router DOM, Axios, Lucide Icons, Modern HSL CSS variables, responsive design. **Deployed on Vercel.**
- **Backend**: Python Flask, Flask-CORS, mysql-connector-python
- **Database**: **Supabase** (Serverless PostgreSQL with connection pooling)
- **AI Engine**: Google Gemini (using the `google-generativeai` client SDK)

---

## 📦 Project File Structure

```
Returns_&_Damaged_Stock _Request_System/
├── backend/
│   ├── app.py                 # Flask server bootstrapper
│   ├── requirements.txt       # Backend dependencies
│   ├── .env.example           # Reference environment configurations
│   ├── .env                   # Configuration file (DB credentials & Gemini key)
│   ├── config/
│   │   └── db_config.py       # Configuration parser
│   ├── database/
│   │   └── db_helper.py       # Thread-safe connection pooling wrappers
│   ├── services/
│   │   └── gemini_service.py  # Gemini 1.5 Flash Prompt analysis integration
│   ├── controllers/
│   │   ├── auth_controller.py
│   │   └── request_controller.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   └── request_routes.py
│   └── uploads/               # Local folder storing images (Git ignored)
├── database/
│   └── schema.sql             # SQL database table definitions & seed credentials
├── frontend/
│   ├── package.json           # Frontend dependencies (React Router, Axios, Lucide)
│   ├── vite.config.js         # Vite bundler configuration
│   ├── index.html             # SEO Meta tags and root setup
│   └── src/
│       ├── main.jsx
│       ├── index.css          # Premium design CSS themes (dark UI)
│       ├── App.jsx            # Routing and protected layout shells
│       ├── components/        # Reusable functional components
│       └── pages/             # Layout pages
└── README.md
```

---

## 🚀 Installation & Running Guide

### 1. Database Configuration
1. This project is configured to run on **Supabase**.
2. Create a Supabase project and grab your IPv4 connection pooler details (Host, User, Password, Port `6543`).
3. Run the SQL commands in `database/schema.sql` within your Supabase SQL editor to create the tables.

### 2. Flask Backend Setup
1. Change directory to the `backend/` folder:
   ```bash
   cd backend
   ```
2. (Recommended) Create a Python virtual environment:
   ```bash
   python -m venv venv
   # Activate on Windows:
   venv\Scripts\activate
   # Activate on macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file details:
   - Make sure your Supabase connection strings match the fields (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`).
   - Insert your `GEMINI_API_KEY` (if not defined, the system will fall back to simulated mock analyses).
5. Start the backend Flask server:
   ```bash
   python app.py
   ```
   *The backend will boot up on http://localhost:5000.*

### 3. React Frontend Setup
1. Open a new terminal and navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will open up on http://localhost:5173.*

---

## 🔑 Demo Account Credentials

Use these credentials to log in:

- **Admin Account**: 
  - Username: `admin`
  - Password: `admin123`
- **Pharmacy User**:
  - Username: `pharmacy`
  - Password: `pharmacy123`

---

## 📡 API Reference Endpoints

| Method | Endpoint | Description | Role |
|:---|:---|:---|:---|
| `POST` | `/api/auth/login` | Verifies login credentials and returns user details. | All |
| `POST` | `/api/create-request` | Saves new return stock details, decodes Base64, triggers AI analysis. | Pharmacy |
| `GET` | `/api/requests` | Fetches filtered returns list (optionally by search text/status query). | All |
| `GET` | `/api/request/<id>` | Pulls full details, image paths, and AI logs for a specific request. | All |
| `PUT` | `/api/update-status` | Accepts `{ id, status }` to approve or reject a request. | Admin |
| `GET` | `/api/dashboard-stats` | Aggregates status counts and returns recent activities. | All |
| `POST` | `/api/analyze-image` | On-demand image checker. | Developer |

---

## 🔮 Future Improvements

- **Backend Deployment**: Host the Flask API on Render or AWS.
- **JSON Web Tokens (JWT)**: Replace local session store with signed HTTP-only JWTs.
- **Automated Email Reports**: Send status updates to pharmacies upon approval.
- **OCR Batch Scan**: Auto-fill form inputs (Name, Batch, Expiry) using Gemini OCR.
- **AI Fraud Assessment**: Compare uploaded package condition to vendor standards to block counterfeit submissions.
- **Interactive Analytics Charts**: Display returns frequency over time using Recharts.
- **WhatsApp Notification Alerts**: Direct integration using Twilio.
