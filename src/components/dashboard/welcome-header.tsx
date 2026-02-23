'use client';

import { useState, useEffect } from 'react';

export function WelcomeHeader() {
  const [greeting, setGreeting] = useState('');
  // A real app would get the name from the user's profile.
  const name = 'Dhvani';

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) return 'Good Morning';
      if (hours < 18) return 'Good Afternoon';
      return 'Good Evening';
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">
        {greeting ? `${greeting}, ${name}!` : `Welcome, ${name}!`} ☀️
      </h1>
      <p className="text-muted-foreground">
        Here is your household summary for today.
      </p>
    </div>
  );
}
