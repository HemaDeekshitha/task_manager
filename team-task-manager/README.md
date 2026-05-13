# TaskFlow - Team Task Management System

TaskFlow is a robust, full-stack collaborative task management application designed for teams to manage projects, assign tasks, and track progress efficiently.

## 🚀 Features

### 1. User Authentication & Authorization
- **Secure Signup/Login:** Built with JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Role-Based Access Control (RBAC):** 
  - **Admin:** Can create projects, manage all tasks, view all users, and see team-wide analytics.
  - **Member:** Can view assigned projects and update the status of tasks assigned to them.

### 2. Project Management
- Admins can create new projects with titles and descriptions.
- Projects track members and creators.
- Clean grid view for project overview.

### 3. Task Management
- Admins can create tasks within projects, set due dates, and assign them to specific team members.
- Task status workflow: `Pending` -> `In Progress` -> `Completed`.
- Real-time status updates from the project dashboard.

### 4. Advanced Dashboard
- **Visual Stats:** Total tasks, tasks by status (In Progress, Completed), and overdue task count.
- **User Analytics (Admin only):** Breakdown of tasks assigned to each team member.

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express, MySQL, Sequelize, JWT, bcryptjs.
- **Styling:** Tailwind CSS for a modern, responsive UI.

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your credentials:
   ```env
   PORT=5000
   DATABASE_URL=mysql://user:password@localhost:3306/dbname
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Free Hosting)

To deploy your application for free, I recommend using **Railway** (for DB + Backend) and **Render** (as an alternative).

### **Step 1: Push to GitHub**
1. Create a new repository on GitHub.
2. Run these commands in your root terminal:
   ```bash
   git init
   git add .
   git commit -m "Final version for deployment"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### **Step 2: Deploy Database (MySQL)**
1. Sign up at [Railway.app](https://railway.app/).
2. Click **"New Project"** -> **"Provision MySQL"**.
3. Once created, go to the **Variables** tab of the MySQL service and copy the `MYSQL_URL`.

### **Step 3: Deploy Backend**
1. In Railway, click **"New"** -> **"GitHub Repo"** and select your project.
2. Go to **Settings** and set the `Root Directory` to `/`.
3. Go to **Variables** and add:
   - `DATABASE_URL`: (Paste the `MYSQL_URL` you copied)
   - `JWT_SECRET`: (Your secret key)
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
4. Railway will automatically run `npm run build` and `npm start` based on the root `package.json` I created.

### **Step 4: Update Frontend API URL**
1. Once your backend is deployed, Railway will give you a public URL (e.g., `https://backend-production.up.railway.app`).
2. Update your frontend environment variable in Railway:
   - `VITE_API_URL`: `https://your-backend-url.railway.app/api`

## 📄 License
MIT License
