# Gemini Project: SKF WEBSITE - Backend

This document provides instructions and context for the backend of the SKF WEBSITE project.

## Project Overview

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

## Development

### Prerequisites:

*   Node.js and npm installed.
*   A `.env` file with the necessary environment variables.

### Getting Started:

1.  Install dependencies: `npm install`
2.  Start the server: `npm start` (assuming a `start` script in `package.json`)

### Project Structure:

*   `controllers/`: Request handlers for different API endpoints.
*   `models/`: Database schemas/models.
*   `routes/`: API route definitions.
*   `middleware/`: Custom middleware (e.g., for authentication).
*   `utils/`: Utility functions and services (Google Sheets, email).
*   `config/`: Application configuration.
*   `server.js`: The main entry point of the application.
