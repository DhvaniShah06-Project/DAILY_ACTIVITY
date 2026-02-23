'use client';
import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    return (
        <FirebaseProvider>
            <UserProvider>
                {children}
                <FirebaseErrorListener />
            </UserProvider>
        </FirebaseProvider>
    );
}
