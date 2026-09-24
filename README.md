# Student Admission System — Frontend

A React-based frontend for a full-stack Student Admission Management System designed to streamline the admission lifecycle from course discovery and application submission to document verification, payment, and final admission.

## 🚀 Live Demo

**Frontend:** https://student-admission-frontend-df4e.onrender.com

**Backend API:** https://student-admission-backend-290q.onrender.com

The backend repository contains the complete system documentation, including the Spring Boot API, database design, authentication and security, payment integration, document management, testing, and deployment.

## ✨ Features

### Student Portal
- Register and log in securely
- Browse available academic programs
- View eligibility and seat availability
- Submit admission applications
- Track application status
- Upload required documents
- View document verification status
- Pay application fees through Razorpay
- View payment status
- Track admission progress

### Admin Portal
- Secure administrator authentication
- Create academic programs
- View and filter student applications
- Review submitted applications
- View uploaded documents
- Verify or reject documents with remarks
- Manage application status
- Monitor payment status
- Complete the admission workflow
- Allocate seats when an application is admitted

## 🔄 Admission Workflow

```text
Student Registration
        ↓
Student Login
        ↓
Browse Programs
        ↓
Submit Application
        ↓
Upload Documents
        ↓
Application Fee Payment
        ↓
Admin Review
        ↓
Document Verification
        ↓
Application Approval
        ↓
Admission
        ↓
Seat Allocation
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development and build tooling |
| React Router | Client-side routing |
| Axios | REST API communication |
| Bootstrap | Responsive UI |
| Bootstrap Icons | Interface icons |
| JavaScript | Application logic |
| CSS | Custom styling |
| Razorpay Checkout | Payment interface |

## 📁 Project Structure

```text
src/
├── api/
│   ├── axiosInstance.js
│   ├── authApi.js
│   ├── applicationApi.js
│   ├── courseApi.js
│   ├── documentApi.js
│   └── paymentApi.js
├── assets/
│   └── university-bg.jpg
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── student/
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   └── ApplicationDetail.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       └── ManageCourses.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Frontend Architecture

The frontend follows a component-based React architecture with dedicated layers for:

- **Pages** — Student and administrator interfaces
- **Components** — Reusable UI and route protection
- **Context** — Authentication state management
- **API modules** — Centralized backend communication
- **Environment configuration** — Development and production API configuration

Authentication state is managed using React Context, while protected routes restrict access based on the authenticated user's role.

## ⚙️ Environment Configuration

Create a `.env` file in the project root.

For the deployed application:

```env
VITE_API_BASE_URL=https://student-admission-backend-290q.onrender.com/api
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> Do not commit `.env` files containing environment-specific configuration or secrets to GitHub.

## 💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/KRITHI1022/student-admission-frontend.git
cd student-admission-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend URL

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Make sure the Spring Boot backend is running locally on port `8080`.

### 4. Start the development server

```bash
npm run dev
```

The application will normally be available at `http://localhost:5173`.

### 5. Create a production build

```bash
npm run build
```

## 🔗 Backend Repository

The complete backend and system documentation are available in the backend repository:

https://github.com/KRITHI1022/student-admission-system

It covers:

- Spring Boot REST APIs
- JWT authentication and authorization
- Role-based access control
- MySQL database
- Redis caching
- Razorpay payment integration
- Document upload and verification
- Application workflow and status transitions
- Seat allocation
- Input validation
- Security testing
- End-to-end testing
- Production deployment

## 🌐 Deployment

The frontend is deployed as a Render Static Site and communicates with the Spring Boot backend deployed as a Render Web Service.

```text
React + Vite
     │
     │ REST API / Axios
     ▼
Spring Boot Backend
     │
     ├── MySQL
     ├── Redis
     └── Razorpay
```

## 📌 Project Status

The application has been deployed and tested through the complete admission workflow, including:

- Student registration and authentication
- Course browsing
- Application submission
- Document upload
- Document verification
- Razorpay payment
- Application status progression
- Admission and seat allocation

## 👩‍💻 Author

**KIRITHIKA R**

Electronics and Communication Engineering  
Saveetha Engineering College, Chennai

GitHub: https://github.com/KRITHI1022
