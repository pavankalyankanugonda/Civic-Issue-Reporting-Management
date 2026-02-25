# 🏙️ Civic Issue Reporting & Management System

A premium web-based application built with **Java (Spring Boot)** and **React** that allows citizens to report civic issues and municipal staff to manage them.

## 🚀 Features

- **User Module**: Register, Login (Citizen/Admin), Profile management.
- **Complaint Module**: Report issues with category, description, location, and photos.
- **Admin Dashboard**: View all reports, filter by status, and update progress.
- **Real-time Tracking**: Citizens can monitor the status of their reported issues.
- **Premium UI**: Modern dark-mode interface with glassmorphism and smooth animations.

## 🛠️ Technologies

### Backend
- **Java 17+**
- **Spring Boot 3.2**
- **Spring Data JPA**
- **MySQL Database**
- **Maven**

### Frontend
- **React (Vite)**
- **Lucide Icons**
- **Axios**
- **CSS3 (Custom Design System)**

## 📦 Installation & Setup

### 1. Database Setup
1. Open MySQL and run:
   ```sql
   CREATE DATABASE civic_db;
   ```
2. Update `backend/src/main/resources/application.properties` with your MySQL username and password.

### 2. Run Backend (Java)
1. Navigate to the `backend` folder.
2. Run using Maven:
   ```bash
   mvn spring-boot:run
   ```
   (The server will start at `http://localhost:8080`)

### 3. Run Frontend (React)
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   (The app will be available at `http://localhost:5173`)

## 📌 Main API Endpoints

### User APIs
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Authenticate user
- `GET /api/users/{id}` - Get user details

### Complaint APIs
- `GET /api/complaints` - List all reports (Admin)
- `POST /api/complaints` - Submit new report
- `PUT /api/complaints/{id}/status` - Update issue status
- `DELETE /api/complaints/{id}` - Remove a report

---
*Created with ❤️ for Civic Betterment.*
