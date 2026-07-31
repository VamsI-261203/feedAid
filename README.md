# Feed-Aid 🍲

A full-stack food donation platform that connects donors with people in need. Built with **Spring Boot** (backend) and **React.js** (frontend).

Feed Aid helps you donate your extra consumable food so that it is not wasted and is supplied to the needy.

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 19, React Router v7, Axios, Vite |
| Backend    | Spring Boot 4.1.0, Spring Mail, Spring Data JPA |
| Database   | MySQL 8.0                      |
| Auth       | BCrypt password hashing, Email OTP verification |
| Email      | Gmail SMTP via JavaMailSender  |

## Project Structure

```
Feed-Aid/
├── backend/          → Spring Boot REST API
│   ├── src/main/java/com/shareandcare/backend/
│   │   ├── config/       → Mail, CORS configuration
│   │   ├── controller/   → REST API endpoints
│   │   ├── dto/          → Request/Response objects
│   │   ├── entity/       → JPA database entities
│   │   ├── exception/    → Global error handling
│   │   ├── repository/   → Spring Data JPA repositories
│   │   └── service/      → Business logic layer
│   └── .env              → Gmail SMTP credentials (gitignored)
│
├── frontend/         → React.js SPA
│   └── src/
│       ├── api/          → Centralized API service
│       ├── components/   → Shared UI components
│       ├── pages/        → Route-level page components
│       ├── styles/       → CSS stylesheets
│       └── utils/        → Constants and helpers
│
└── README.md         → This file
```

## Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+** (with npm)
- **MySQL 8.0+**
- **Gmail Account** with 2-Step Verification + App Password

## Quick Start

### 1. Database Setup

```sql
-- MySQL will auto-create the database, but you can create it manually:
CREATE DATABASE feed_aid_db;
```

### 2. Backend Setup

```bash
cd backend

# Create environment file with your Gmail credentials
cp .env.example .env
# Edit .env and add your Gmail App Password

# Run the Spring Boot server
./mvnw spring-boot:run    # Linux/Mac
.\mvnw.cmd spring-boot:run  # Windows
```

The backend starts at **http://localhost:8080**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts at **http://localhost:5173**

## Environment Variables

Create a `backend/.env` file (see `backend/.env.example`):

```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
```

> **Important:** Use a [Gmail App Password](https://myaccount.google.com/apppasswords), NOT your regular Gmail password. You must have 2-Step Verification enabled.

## API Endpoints

### Authentication
| Method | Endpoint                          | Description                |
|--------|-----------------------------------|----------------------------|
| POST   | `/api/auth/register`              | Register new user          |
| POST   | `/api/auth/verify-email`          | Verify email with OTP      |
| POST   | `/api/auth/resend-verification-otp` | Resend verification OTP  |
| POST   | `/api/auth/login`                 | User login                 |
| POST   | `/api/auth/forgot-password`       | Request password reset OTP |
| POST   | `/api/auth/verify-reset-otp`      | Verify password reset OTP  |
| POST   | `/api/auth/reset-password`        | Reset password             |

### Donations
| Method | Endpoint                          | Description                |
|--------|-----------------------------------|----------------------------|
| POST   | `/api/donors`                     | Submit a donation          |
| GET    | `/api/donors/public`              | Get public donations       |
| GET    | `/api/donors/search`              | Search donations           |
| PUT    | `/api/donors/{id}/claim`          | Claim a donation           |

### Receivers
| Method | Endpoint                          | Description                |
|--------|-----------------------------------|----------------------------|
| POST   | `/api/receivers`                  | Submit a food request      |
| GET    | `/api/receivers/my`               | Get user's requests        |

## Features

- ✅ User Registration with Email OTP Verification
- ✅ Secure Login (BCrypt password hashing)
- ✅ Forgot Password / Reset Password via OTP
- ✅ Food Donation with photo upload
- ✅ Food Request / Claiming system
- ✅ Donation Leaderboard
- ✅ User Profile management
- ✅ Responsive design

## License

This project is for educational purposes.
