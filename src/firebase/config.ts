import { FirebaseOptions } from 'firebase/app';

// This configuration is automatically generated and public.
// It's safe to commit this to your repository.
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyAzP8x4KGsgx_j342_LTWad324D-Ac",
    authDomain: "ghar-sathi-3a795.firebaseapp.com",
    projectId: "ghar-sathi-3a795",
    storageBucket: "ghar-sathi-3a795.appspot.com",
    messagingSenderId: "263884351273",
    appId: "1:263884351273:web:0267c7e0c4a45a698a9643"
};

export function getFirebaseConfig(): FirebaseOptions {
    // Basic validation to ensure the config object isn't empty.
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
        // This error should not be thrown in practice if the config is filled out.
        throw new Error('Firebase config is missing or invalid. Please check src/firebase/config.ts');
    }

    return firebaseConfig;
}
