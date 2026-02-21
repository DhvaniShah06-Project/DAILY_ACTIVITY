'use client';

import { useUser } from "@/firebase";

export function WelcomeHeader() {
  const { user } = useUser();
  // A real app would get the name from the user's profile.
  const name = user?.displayName || 'Dhvani';

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">{getGreeting()}, {name}! ☀️</h1>
      <p className="text-muted-foreground">
        Here is your household summary for today.
      </p>
    </div>
  );
}
