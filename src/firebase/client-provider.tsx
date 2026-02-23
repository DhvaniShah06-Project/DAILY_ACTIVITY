'use client';
import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    return (
        <FirebaseProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </FirebaseProvider>
    );
}
