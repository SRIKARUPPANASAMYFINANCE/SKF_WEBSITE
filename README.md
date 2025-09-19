# SKF WEBSITE

This project is a full-stack web application for "SRI KARUPPASAMY FINANCE". It consists of a React frontend and a Node.js backend.

## Backend

The backend is a Node.js application built with the Express.js framework. It provides the API for the SKF WEBSITE frontend.

### Key Features:

*   **Authentication:** User registration and login.
*   **Loan Management:** Creating, viewing, and managing loans.
*   **Customer Management:** Managing customer information.
*   **Loan Applications:** Handling new loan applications.
*   **Payments:** Processing and tracking payments.
*   **Dashboard:** Providing data for the admin dashboard.

### Tech Stack:

*   **Framework:** Node.js with Express.js
*   **Database:** (Not explicitly defined, but likely MongoDB or a similar NoSQL database given the Mongoose-like model names)
*   **Authentication:** JWT (likely, given the `authMiddleware.js`)
*   **Services:**
    *   Google Sheets API for data interaction.
    *   Email service for notifications.

### Development

#### Prerequisites:

*   Node.js and npm installed.
*   A `.env` file with the necessary environment variables.

#### Getting Started:

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Start the server: `npm start`

## Frontend

The frontend is a React application that provides the user interface for the SKF WEBSITE.

### Key Features:

*   User authentication (Login/Register).
*   Loan application form.
*   Loan calculator.
*   Customer and loan lists for admins.
*   Admin dashboard.
*   Static pages (About Us, Contact Us, etc.).

### Tech Stack:

*   **Framework:** React
*   **Routing:** (Likely React Router, given the `pages` structure)
*   **Styling:** CSS (as seen from `App.css`, `Navbar.css`)
*   **API Communication:** `axios` or `fetch` (in `services/api.js`)
*   **State Management:** React Context API (as seen from `context/AuthContext.js`)

### Development

#### Prerequisites:

*   Node.js and npm installed.

#### Getting Started:

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm start`
