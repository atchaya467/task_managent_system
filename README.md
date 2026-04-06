# Task Management System - Xplore Intellects Pvt Ltd

This is a full-stack **Admin & Employee Task Management System** requested for the **Xplore Intellects Pvt Ltd** company evaluation.

## Technology Stack & Database
- **Frontend**: React.js, Vite, and custom CSS for dynamic animations.
- **Backend**: Node.js, Express.js.
- **Database**: **MongoDB** (Mongoose ORM).

### Setting Up MongoDB
This application natively connects to MongoDB. By default, it looks for a local MongoDB instance running on your machine:
`mongodb://127.0.0.1:27017/task_mgmt_system`

**Instructions for the Evaluator:**
1. Ensure you have **MongoDB Community Server** installed and running on your local machine.
2. If you prefer to use MongoDB Atlas (Cloud), open `backend/.env` and replace the `MONGO_URI` variable with your MongoDB Atlas connection string.

## Running the Project

### 1. Backend Setup
1. CD into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Seed the Admin User** (This populates the MongoDB with the default Admin):
   ```bash
   node seeder.js
   ```
4. Start the backend server (runs on port 5000):
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and CD into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open the provided `localhost` URL (usually `http://localhost:5173`) in your browser.

## Features Added
- **Password Visibility Toggles**: Click the "Eye" icon in any of the Login or Registration forms to peek at the password.
- **Dynamic Dark Theme & Animations**: Custom landing page designed specifically for this company project.
- **Admin and Employee Separation**: Role-based access control built-in using JWT authentication.

## Default Credentials
After running `node seeder.js`, log into the Admin portal with:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
