FriendsCampus - Admin Dashboard
FriendsCampus is a web-based student management system. This dashboard allows administrators to securely login, view student records based on Branch, Year, and Section, and manage the campus database using Firebase Firestore.

Features
Secure Admin Login: Restricted access for authorized administrators.

Nested Data Filtering: Filter students by:

Branch: CSE, ECE, IT.

Year: 1st, 2nd, 3rd, 4th Year.

Section: A, B, C, D, E, F.

Real-time Database: Powered by Firebase for instant updates.

Student Management: View student details (Name, Email, Roll No) and remove records.

Live Student Count: Automatically counts students in the filtered view.

Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6 Modules).

Backend/Database: Firebase Firestore.

Authentication: Firebase Auth (Email/Password).

Icons: Google Material Symbols.

Project Structure

FriendsCampus/
├── frontend/
│   ├── admin/
│   │   ├── admin_login.html      # Login Page
│   │   ├── admin_login.js        # Login Logic
│   │   ├── admin_dashboard.html  # Main Dashboard
│   │   └── admin_dashboard.js    # Dashboard Logic
│   ├── CSS/
│   │   ├── login.css
│   │   └── admin_dashboard.css
│   └── JS/
│       └── firebaseConfig.js     # Firebase Keys
└── index.html


Database Structure
Ensure your Firestore follows this nested structure:

Collection: students

Document: Branch Name (e.g., CSE)

Sub-collection: Year (e.g., 2nd Year)

Document: StudentID (Auto-ID)

Fields: name, email, section, branch.

Running the Project
Open the project in VS Code.

Select "Open with Live Server".

Use the following credentials to log in:

Email: admin@friends.com

Password: admin123

📝 Important Notes
Access Denied: You cannot skip the login page. The dashboard checks for an active session.

Case Sensitivity: Ensure branch and year names in Firebase match the dropdown values exactly.