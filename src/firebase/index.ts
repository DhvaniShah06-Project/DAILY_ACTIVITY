'use client';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

type FirebaseInstances = {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export const initializeFirebase = (): FirebaseInstances => {
    if (firebaseInstances) {
        return firebaseInstances;
    }

    const config = getFirebaseConfig();

    if (!config) {
        throw new Error('Firebase configuration is missing or invalid. Check your .env file and src/firebase/config.ts');
    }

    const app = getApps().length ? getApp() : initializeApp(config);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    firebaseInstances = { app, auth, firestore };
    return firebaseInstances;
};

export * from './provider';
export * from './auth/use-user';
