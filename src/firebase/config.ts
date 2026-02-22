import { FirebaseOptions } from 'firebase/app';

export function getFirebaseConfig(): FirebaseOptions {
    const firebaseConfig: FirebaseOptions = {
        apiKey: "AIzaSyA88EHq4bT1vzlAwe808Cb5pE3ak2GAn9s",
        authDomain: "gharsathi-app-43431.firebaseapp.com",
        projectId: "gharsathi-app-43431",
        storageBucket: "gharsathi-app-43431.appspot.com",
        messagingSenderId: "870624021289",
        appId: "1:870624021289:web:53163e79029729910a26d1",
        measurementId: "G-9XG183K90M"
    };

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
        throw new Error('Firebase config is missing or invalid.');
    }

    return firebaseConfig;
}
