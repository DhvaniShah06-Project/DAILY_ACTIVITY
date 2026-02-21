import { LocationReminderCard } from "./components/location-reminder-card";

export default function RemindersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Smart Reminders</h1>
        <p className="text-muted-foreground">
          Get reminders for your errands when you're nearby.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <LocationReminderCard />
      </div>
    </div>
  );
}
