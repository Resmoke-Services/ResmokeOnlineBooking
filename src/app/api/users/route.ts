// src/app/api/users/route.ts

import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// --- START: MODIFICATION ---

// Explicitly load the admin credentials from the correct secret environment variable.
const serviceAccountJson = process.env.APP_FIREBASE_ADMIN_CREDENTIALS;

if (!serviceAccountJson) {
  // This error will be thrown if the secret is not configured correctly in your hosting environment.
  throw new Error('The APP_FIREBASE_ADMIN_CREDENTIALS environment variable is not set.');
}

// Parse the JSON string from the environment variable into an object.
const serviceAccount = JSON.parse(serviceAccountJson);

// Check if the app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// --- END: MODIFICATION ---


// This function will handle GET requests to /api/users
export async function GET(request: Request) {
  // ... your existing code ...
  try {
    const auth = admin.auth();
    const listUsersResult = await auth.listUsers(10); 
    const users = listUsersResult.users.map((userRecord) => userRecord.toJSON());
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}