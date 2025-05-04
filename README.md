# atp2-firebase-app

This is a React application that provides user registration and authentication using Firebase. The application consists of three main pages: Cadastro, Login, and Principal.

## Project Structure

```
atp2-firebase-app
├── public
│   ├── index.html          # Main HTML file
│   └── favicon.ico         # Favicon for the application
├── src
│   ├── components          # Reusable components
│   │   ├── Button.jsx      # Button component
│   │   ├── Input.jsx       # Input component
│   │   └── Navbar.jsx      # Navigation bar component
│   ├── config              # Firebase configuration
│   │   └── firebase.js     # Firebase initialization
│   ├── contexts            # Context API for authentication
│   │   └── AuthContext.jsx # Auth context provider
│   ├── hooks               # Custom hooks
│   │   └── useAuth.js      # Hook for authentication
│   ├── pages               # Application pages
│   │   ├── Cadastro        # Registration page
│   │   │   └── index.jsx   # Cadastro component
│   │   ├── Login           # Login page
│   │   │   └── index.jsx   # Login component
│   │   └── Principal       # Main user page
│   │       └── index.jsx   # Principal component
│   ├── routes              # Application routing
│   │   └── AppRoutes.jsx   # Routes configuration
│   ├── services            # Services for authentication and Firestore
│   │   ├── auth.js         # Authentication functions
│   │   └── firestore.js     # Firestore functions
│   ├── styles              # CSS styles
│   │   ├── global.css      # Global styles
│   │   └── components.css   # Component-specific styles
│   ├── utils               # Utility functions
│   │   └── validators.js    # Input validation functions
│   ├── App.jsx             # Main application component
│   ├── index.jsx           # Entry point for the React application
│   └── main.jsx            # React 18 root rendering
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .firebaserc            # Firebase project configuration
├── .gitignore              # Files to ignore in version control
├── firebase.json           # Firebase hosting configuration
├── package.json            # npm configuration
├── vite.config.js          # Vite build configuration
└── README.md               # Project documentation
```

## Features

- **Cadastro Page**: Allows users to register with email, password, name, surname, and date of birth. User data is stored in Firebase Authentication and Firestore.
- **Login Page**: Users can log in with their email and password. Successful login redirects to the Principal page.
- **Principal Page**: Displays the logged-in user's name, surname, and date of birth.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd atp2-firebase-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project and configure authentication and Firestore.
   - Update the `.env` file with your Firebase configuration.

5. Start the development server:
   ```
   npm run dev
   ```

6. Build the application for production:
   ```
   npm run build
   ```

7. Deploy to Firebase Hosting:
   ```
   firebase deploy
   ```

## License

This project is licensed under the MIT License.