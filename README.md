# FriendsCampus

FriendsCampus is a web-based student learning and collaboration platform designed to help students learn, connect, and grow together. The platform provides structured learning roadmaps, module-based learning content, quizzes, mentorship support, peer-to-peer assistance, and hackathon opportunities in a single centralized environment.

The objective of FriendsCampus is to bridge the gap between learning, collaboration, and real-world opportunities by creating a community-driven ecosystem for students.

---

# Project Overview

FriendsCampus helps students:

* Follow structured learning roadmaps
* Learn through module-based content
* Test knowledge using quizzes
* Connect with mentors
* Get help from fellow students
* Explore hackathons and competitions
* Manage their profile and learning journey

The platform creates a collaborative environment where students can learn from both mentors and peers while continuously improving their technical and professional skills.

---

# Features

## Dashboard

The dashboard serves as the central hub of the platform. It provides quick access to all modules including roadmaps, mentors, hackathons, student help, and profile management.

---

## Learning Roadmaps

FriendsCampus offers structured learning paths that guide students from beginner to advanced levels.

Available Roadmaps:

* Frontend Development
* Backend Development
* Python Development
* Artificial Intelligence
* Android Development

Each roadmap is divided into multiple modules for systematic learning.

---

## Module-Based Learning

Every roadmap contains carefully organized learning modules.

Example:

Frontend Development Roadmap

* HTML Basics
* CSS Fundamentals
* JavaScript Basics
* Git & GitHub
* React Basics
* Project Development

Each module contains:

* Topic explanations
* Examples
* Learning resources
* Practice materials

---

## Quiz System

After completing a module, students can attempt quizzes to evaluate their understanding.

Quiz Features:

* Topic-wise questions
* Randomized question selection
* Instant result generation
* Score calculation
* Module completion tracking

---

## Student-to-Student Help

The Student Help feature allows students to interact with peers and seek assistance regarding academics, projects, and technical concepts.

Students can:

* Ask questions
* Share knowledge
* Solve doubts
* Collaborate on learning

This encourages peer-to-peer learning and community engagement.

---

## Student-to-Student Mentorship

The Student-to-Student Mentorship feature enables students to connect with fellow students for guidance, support, and knowledge sharing.

Instead of relying on external mentors, students can help each other by sharing their experiences, solving doubts, discussing projects, and providing learning recommendations.

Students can seek assistance in areas such as:

* Programming and technical concepts
* Project development
* Learning roadmaps
* Hackathon preparation
* Career and skill development

This feature promotes collaborative learning and builds a strong campus community where students learn and grow together through peer support.


---

## Hackathon Explorer

FriendsCampus includes a dedicated Hackathon section where students can discover upcoming hackathons and competitions.

Features include:

* Hackathon cards with images
* Duration information
* Event descriptions
* Search functionality
* Direct registration links

Supported organizations include:

* Google
* Microsoft
* GitHub
* GeeksforGeeks
* Devfolio
* Unstop

---

## Profile Management

Users can manage their personal information through the profile section.

Features include:

* View profile details
* Update information
* Manage account settings
* Personalized user experience

---

## Admin Dashboard

The admin dashboard provides centralized control over the platform.

Administrators can:

* Manage student records
* Search students
* Filter users by category
* Monitor platform activity
* Maintain system data

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)

## Backend Services

* Firebase Authentication
* Firebase Firestore Database

## Development Tools

* Visual Studio Code
* Git & GitHub
* Figma

---

# Firebase Integration

FriendsCampus uses Firebase as its backend service.

## Firebase Authentication

Provides:

* User Registration
* User Login
* Secure Authentication
* Session Management

## Firebase Firestore

Used for storing:

* Student Information
* Mentor Data
* User Profiles
* Platform Records
* Hackathon Details
* Learning Data

Firebase enables secure, cloud-based, and scalable data management without requiring a dedicated backend server.

---

# Repository Structure

```text
FriendsCampus/
├── frontend/
│   ├── HTML/
│   ├── CSS/
│   ├── JS/
│   ├── Assets/
│   └── firebase-config.js
│
├── README.md
└── .gitignore
```

---

# System Workflow

User Registration/Login

↓

Dashboard

↓

Select Roadmap

↓

Access Modules

↓

Learn Topics

↓

Attempt Quiz

↓

View Results

↓

Explore Mentors & Hackathons

↓

Continuous Learning & Collaboration

---

# Installation Guide

## 1. Clone Repository

```bash
git clone <repository-url>
```

## 2. Open Project Folder

```bash
cd FriendsCampus
```

## 3. Configure Firebase

Create a Firebase project and add your Firebase configuration inside:

```javascript
firebase-config.js
```

Example:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 4. Run the Project

Open:

```text
index.html
```

or run using:

* VS Code Live Server Extension

---

# Future Enhancements

The platform can be extended with:

* Real-Time Chat System
* AI-Based Learning Recommendations
* Progress Tracking Dashboard
* Achievement & Badge System
* Internship Portal
* Resume Builder
* Video Learning Support
* Mentor Booking System
* Mobile Application
* Notification System

---

# Project Objectives

The primary objective of FriendsCampus is to create a centralized student ecosystem that combines learning, mentorship, collaboration, and opportunity discovery into a single platform.

The system aims to help students:

* Learn effectively
* Collaborate with peers
* Receive mentorship
* Evaluate their skills
* Participate in hackathons
* Improve career readiness

---

# Advantages

* Structured learning experience
* Easy access to mentors
* Peer-to-peer collaboration
* Centralized learning resources
* Real-world opportunities through hackathons
* User-friendly interface
* Cloud-based data management
* Scalable architecture

---

# Authors
Department of Computer Science & Engineering

Academic Project – Student Learning & Mentorship Platform

---

## License

This project is developed for educational and academic purposes.
