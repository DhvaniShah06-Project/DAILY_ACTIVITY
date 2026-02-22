import { FirebaseOptions } from 'firebase/app';

export function getFirebaseConfig(): FirebaseOptions {
    const firebaseConfig: FirebaseOptions = {
      projectId: "studio-4239788751-c788a",
      appId: "1:548998258478:web:5e074a9d6c252f6d5b24bf",
      apiKey: "AIzaSyA239TqRhHJ5FZYebwK1_IVpoBhDK2aN8I",
      authDomain: "studio-4239788751-c788a.firebaseapp.com",
      measurementId: "",
      messagingSenderId: "548998258478",
      storageBucket: "studio-4239788751-c788a.appspot.com"
    };

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
        throw new Error('Firebase config is missing or invalid.');
    }

    return firebaseConfig;
}
