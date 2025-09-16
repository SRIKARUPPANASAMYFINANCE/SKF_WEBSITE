# Gemini Project: SKF WEBSITE - Frontend

This document provides instructions and context for the frontend of the SKF WEBSITE project.

## Project Overview

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

## Development

### Prerequisites:

*   Node.js and npm installed.

### Getting Started:

1.  Install dependencies: `npm install`
2.  Start the development server: `npm start`

### Project Structure:

*   `components/`: Reusable UI components.
*   `pages/`: Top-level page components.
*   `services/`: API communication layer.
*   `context/`: React context for state management.
*   `public/`: Static assets and `index.html`.
