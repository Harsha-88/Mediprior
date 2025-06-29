# Firebase Authentication Setup for MediPrior

## Prerequisites
- A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
- Node.js and npm installed

## Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "mediprior-app")
4. Follow the setup wizard

### 2. Enable Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable "Google" authentication for additional sign-in options

### 3. Get Firebase Configuration
1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "MediPrior Web App")
6. Copy the configuration object

### 4. Configure Environment Variables
Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration.

### 5. Install Dependencies
```bash
npm install
```

### 6. Start the Development Server
```bash
npm run dev
```

## Features Implemented

### Authentication Features
- ✅ Email/Password sign up and sign in
- ✅ User session management
- ✅ Protected routes
- ✅ Automatic logout
- ✅ Error handling for common auth issues
- ✅ Loading states during authentication

### User Management
- ✅ User profile creation
- ✅ Role-based access (Patient, Caregiver, Healthcare Provider, Family Member)
- ✅ Secure token storage
- ✅ Automatic user data synchronization

### Security Features
- ✅ Firebase security rules (configure in Firebase Console)
- ✅ Environment variable protection
- ✅ Token-based authentication
- ✅ Automatic session cleanup

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in the `.env` file
   - Ensure the `.env` file is in the project root

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable Email/Password authentication in Firebase Console
   - Go to Authentication > Sign-in methods > Email/Password

3. **"Firebase: Error (auth/network-request-failed)"**
   - Check your internet connection
   - Verify Firebase project is active

4. **Environment variables not loading**
   - Restart your development server after creating `.env` file
   - Ensure variable names start with `VITE_`

### Getting Help
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Next Steps

After setting up Firebase authentication, you can:

1. **Add Google Sign-in**: Enable Google authentication in Firebase Console
2. **Add Password Reset**: Implement password reset functionality
3. **Add Email Verification**: Enable email verification for new accounts
4. **Add Social Login**: Integrate Facebook, Twitter, or other providers
5. **Add User Profiles**: Store additional user data in Firestore
6. **Add Role-based Permissions**: Implement different access levels

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use Firebase Security Rules** to protect your data
3. **Enable HTTPS** in production
4. **Regularly update dependencies**
5. **Monitor authentication logs** in Firebase Console
6. **Implement rate limiting** for authentication attempts 