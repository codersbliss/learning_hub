# 📊 Community learning hub 

A full-stack **MERN** web application for building a community hub where users can discover educational content, interact with a curated feed, and earn credit points for engagement. Includes user roles (User/Admin), credit tracking, and analytics tools.

---

## 📌 Description

Build a community hub where users can discover educational content, interact with a curated feed, and earn credit points for engagement.

---

## 🚀 Core Features

### 🔐 User Authentication
- Register/Login using JWT

### 💳 Credit Points System
- Earn points for:
  - Watching content  
  - Engaging with the feed  
  - Sharing content  
- Spend credits to:
  - Unlock premium resources  
  - Access events  
- Track transactions with:
  - Timestamps  
  - Purpose descriptions  

### 📰 Feed Aggregator
- Aggregate feeds from public APIs:
  - **Twitter**, **Reddit**, and **LinkedIn**
- Display content cards with:
  - Preview  
  - Title  
  - Source  
- User actions:
  - Save for later  
  - Share  
  - Report (flag for moderator review)  

### 🛡️ Admin/Moderator Panel
- Review flagged reports  
- Manage user accounts and content  
- View platform statistics:
  - Top saved content  
  - Most active users  

---

## 🧰 Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React.js, Tailwind CSS             |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB Atlas                      |
| Auth       | JSON Web Tokens (JWT)              |
| Deployment | Firebase Hosting                   |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/creator-dashboard.git
cd learning-hub
```
### 2. Set up the Backend

```bash
cd backend
npm install
```
# Create a .env file and add your environment variables:

```bash
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
# Run the server:

```bash
npm start
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev  # for Vite
```

## Or

```bash
npm run start  # for Create React App
```

---

### ☁️ Deployment

## Frontend

```bash
npm run build
firebase deploy
```

## Backend

# Deployed on Google Cloud Run.


---

### 📄 License

# This project is for educational purposes. All APIs and external content are used under respective fair use/public terms

### 👤 Author

- Name: Prateek Chandra
- Project: Assignment 2 – Community learning hub



