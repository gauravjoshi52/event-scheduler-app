Event Scheduler 🗓️
A modern event management application built with the PERN stack (PostgreSQL, Express.js, React, Node.js) that allows users to create, browse, and RSVP to events.

<img width="1907" height="901" alt="Screenshot 2025-11-13 190611" src="https://github.com/user-attachments/assets/ef8f28fe-18d1-4a18-9b16-80b7b9b69cb7" />

<img width="1919" height="908" alt="Screenshot 2025-11-13 190630" src="https://github.com/user-attachments/assets/d462788a-1fc4-4794-842e-c824e6a23316" />

<img width="1891" height="896" alt="Screenshot 2025-11-13 190714" src="https://github.com/user-attachments/assets/992da5a0-8f64-4591-8a85-a6df53361031" />

<img width="1887" height="895" alt="Screenshot 2025-11-13 193155" src="https://github.com/user-attachments/assets/428202a6-2c49-4960-870b-dfcfde3ed9d1" />

<img width="1885" height="559" alt="Screenshot 2025-11-13 193211" src="https://github.com/user-attachments/assets/d895656a-88d8-4b52-952a-e9c96fa0a1e0" />


✨ Features
🔐 Authentication
User Registration & Login with JWT tokens

Secure password hashing with bcrypt

Protected routes for authenticated users only

📅 Event Management
Create events with title, description, date, time, and location

Browse all events - visible to all users

Event details with comprehensive information

👥 RSVP System
Join/leave events with one click

Unique participation - join only once per event

Real-time attendee list showing who's coming

Flexible management - leave events anytime

🚀 Live Demo
Frontend: http://localhost:3000

Backend API: http://localhost:5000

🛠️ Tech Stack
Frontend:

⚛️ React 18 with Hooks

🛣️ React Router for navigation

🎨 Tailwind CSS for styling

🔄 Context API for state management

Backend:

🟢 Node.js with Express.js

🔒 JWT authentication

🐘 PostgreSQL database

🛡️ CORS & security middleware

📦 Installation
Prerequisites
Node.js (v16 or higher)

PostgreSQL (v12 or higher)

npm or yarn

1. Clone the Repository
bash
git clone https://github.com/gauravjoshi52/event-scheduler.git
cd event-scheduler
2. Backend Setup
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
Configure your .env file:

env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_scheduler
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
3. Database Setup
bash
# Create PostgreSQL database
createdb event_scheduler

# Run database migrations
npx sequelize-cli db:migrate

# (Optional) Seed with sample data
npx sequelize-cli db:seed:all
4. Frontend Setup
bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
Configure your .env file:

env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Event Scheduler
5. Run the Application
Start the backend server:

bash
cd backend
npm run dev
Start the frontend development server:

bash
cd frontend
npm start
The application will open at http://localhost:3000

🎯 API Endpoints
Authentication
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	User registration	❌
POST	/api/auth/login	User login	❌
GET	/api/auth/me	Get current user	✅
Events
Method	Endpoint	Description	Auth Required
GET	/api/events	Get all events	❌
GET	/api/events/:id	Get single event	❌
POST	/api/events	Create new event	✅
PUT	/api/events/:id	Update event	✅
DELETE	/api/events/:id	Delete event	✅
RSVP
Method	Endpoint	Description	Auth Required
POST	/api/events/:id/join	Join an event	✅
POST	/api/events/:id/leave	Leave an event	✅
📁 Project Structure
text
event-scheduler/
├── 📁 backend/
│   ├── 📁 controllers/     # Route controllers
│   ├── 📁 models/          # Database models (User, Event, EventAttendee)
│   ├── 📁 routes/          # API routes
│   ├── 📁 middleware/      # Authentication & validation
│   ├── 📁 migrations/      # Database migrations
│   ├── 📁 seeders/         # Sample data
│   └── 🚀 server.js        # Entry point
│
├── 📁 frontend/
│   ├── 📁 public/          # Static files
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable components
│   │   ├── 📁 pages/       # Page components
│   │   ├── 📁 context/     # React context (Auth, Events)
│   │   ├── 📁 services/    # API service calls
│   │   ├── 📁 utils/       # Helper functions
│   │   └── 📁 styles/      # CSS/Tailwind files
│   └── package.json
│
├── 📄 README.md
├── 📄 .gitignore
└── 📄 package.json
🗃️ Database Schema
Users Table
sql
id: Primary Key
name: String
email: String (Unique)
password: String (Hashed)
created_at: Timestamp
updated_at: Timestamp
Events Table
sql
id: Primary Key
title: String
description: Text
date: Date
time: Time
location: String
user_id: Foreign Key (Users)
created_at: Timestamp
updated_at: Timestamp
Event_Attendees Table
sql
id: Primary Key
event_id: Foreign Key (Events)
user_id: Foreign Key (Users)
created_at: Timestamp
🎨 Pages & Components
Pages
/login - User authentication

/register - User registration

/events - Browse all events

/events/:id - Event details with attendees

/events/create - Create new event

/events/:id/edit - Edit existing event

Key Components
EventCard - Event preview card

EventForm - Create/edit event form

Navbar - Navigation with auth status

RSVPButton - Join/leave functionality

AuthForm - Login/registration form

🚀 Available Scripts
Backend Scripts
bash
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run test suite
npm run migrate     # Run database migrations
Frontend Scripts
bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run test suite
🤝 Contributing
We welcome contributions! Please follow these steps:

Open a Pull Request

Development Guidelines
Use meaningful commit messages

Follow the existing code style

Add comments for complex logic

Test your changes thoroughly

🐛 Troubleshooting
Common Issues
Database Connection Error:

Ensure PostgreSQL is running: sudo service postgresql start

Verify database credentials in .env

Check if database exists: psql -l

Authentication Issues:

Clear browser localStorage

Check JWT secret configuration

Verify token expiration settings

CORS Errors:

Ensure backend CORS is configured for frontend URL

Check REACT_APP_API_URL in frontend .env

📝 License
This project is developed as part of a PERN stack assignment. Feel free to use it for learning purposes.

👨‍💻 Developer
Gaurav Joshi

GitHub: @gauravjoshi52

Email: gj292002bj@gmail.com

