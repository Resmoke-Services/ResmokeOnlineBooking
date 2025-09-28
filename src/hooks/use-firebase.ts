"use client";
import { auth, db } from "@/lib/firebase-client";

export const useFirebase = () => {
    return { auth, db };
}
