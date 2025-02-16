# PostSphere-Post-Management-System

PostSphere is a full-stack web application that allows users to sign up, log in, and create, edit, and delete posts. The project is built using React, Firebase, and Node.js, ensuring a responsive, secure, and optimized performance.

## Features
- **User Authentication** using Firebase (Email/Password & Google OAuth )
- **Protected Routes** for authenticated users
- **CRUD Operations** for posts (Create, Read, Update, Delete)
- **CRUD Operations** for user (Create, Update, Delete)
- **Responsive UI** built with React and Tailwind CSS
- **Backend API** built using Node.js and Express
- **Firestore** as the database for user data and posts
- **Form Validation** with user-friendly error messages

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Firebase Account** (to configure authentication and Firestore)

### Steps to Run the Project

1. **Clone the Repository**
   ```sh
   git clone https://github.com/AsheemRahman/PostSphere-Post-Management-System.git
   cd PostSphere-Post-Management-System
   ```

2. **Install Dependencies**
   ```sh
   # Install frontend dependencies
   cd Frontend
   npm install
   
   # Install backend dependencies
   cd ../Backend
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Email/Password Authentication** (Google OAuth optional)
   - Create a **Firestore Database** 
   - Obtain Firebase config credentials and create a `.env` file in the `Frontend` directory:
     ```ini
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_CLOUD_NAME=your_clound_name
     ```
   - In the `Backend` directory, create another `.env` file:
     ```ini
     PORT=5000
     JWT_SECRET=your_jsonwebtoken_secret
     FIREBASE_SERVICE_ACCOUNT="your_private_key"
     FIREBASE_DB_URL=your_firebase_database_name
     ```

4. **Start the Development Server**
   - **Backend Server:**
     ```sh
     cd backend
     npm start
     ```
   - **Frontend Server:**
     ```sh
     cd frontend
     npm run dev
     ```
   - The application should now be running at `http://localhost:5000`.

## Folder Structure
```sh
PostSphere/
│-- client/ (Frontend - React)
│-- server/ (Backend - Node.js & Express)
│-- README.md (Project Documentation)
```

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /google` - Google login
- `GET /signout` - User signout

### users
- `GET /user/posts` - Retrieve all posts created by User
- `POST /user/update/` - Update user Details
- `DELETE /user/delete` - Delete User

### Posts
- `POST /addPost` - Create a post
- `GET /posts` - Retrieve all posts
- `PUT /updatePost/:id` - Edit a post (Only author can edit)
- `DELETE /deletePost/:id` - Delete a post (Only author can delete)

## Contributing
If you would like to contribute, feel free to **fork** the repository and submit a **pull request**.


