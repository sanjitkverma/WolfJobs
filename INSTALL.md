# Installation Guide

This guide explains how to set up and run WolfJobs on your local machine.

## Prerequisites

- Ensure that you have Node.js version 18.0 installed. If not, download and install it from [Node.js Official Website](https://nodejs.org/en/download/package-manager).
- Download and install the latest version of MongoDB from [MongoDB Official Website](https://www.mongodb.com/try/download/community).
- Make sure you have React version 18.0

## Installation Steps

1. **Clone the repository:**

   Open a terminal and run the following command to clone the repository to your local machine:

   ```bash
   git clone https://github.com/hsalway1/WolfJobs/tree/dev

2. **Backend Setup**

   - Open a terminal window and navigate to the backend directory by executing the command: *cd backend*
   - Install the necessary packages by running: *npm install*
   - Start the backend service with the following command: *npm start*

3. **Frontend Setup**

    - Open a new terminal window and navigate to the frontend directory: *cd frontend*
    - Install the required packages: *npm install*
    - Start the development server: *npm run dev*

4. **Open http://localhost:5173 to view it in the browser.**

## Additional Commands for React App

In the project directory, you can run:

```bash
npm test
```

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://create-react-app.dev/docs/running-tests/) for more information.

```bash
npm run build
```

Builds the app for production to the *build* folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
