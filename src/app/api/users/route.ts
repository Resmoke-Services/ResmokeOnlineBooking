// src/app/api/users/route.ts

import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// This is the path to your service account key file
// Ensure you have set GOOGLE_APPLICATION_CREDENTIALS in your .env.local file
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
    admin.initializeApp(); // The SDK finds the env variable automatically!
  }

// This function will handle GET requests to /api/users
export async function GET(request: Request) {
  try {
    const auth = admin.auth();
    const listUsersResult = await auth.listUsers(10); // Get up to 10 users

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