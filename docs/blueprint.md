# **App Name**: GharSathi: Your Household Ally

## Core Features:

- Smart Task Management: Users can add, categorize (Cooking, Cleaning, etc.), schedule, and repeat tasks. Integration with Gemini suggests dish names for cooking tasks based on selected ingredients and time of day.
- Bill Payment Tracker: Track bills (Electricity, Water, etc.) with amounts, due dates, and payment methods. Reminders are sent before due dates. Alerts and Gemini AI tips are given based on bill history.
- Expense Tracker: Log expenses by category (Grocery, Transport, etc.) with optional notes. View monthly budget progress, spending breakdowns, and savings goals.
- AI-Powered Insights: Gemini AI provides daily household management tips, monthly spending summaries, and personalized saving suggestions based on user spending patterns. LLM uses budget tool.
- Comprehensive Reports: Generate monthly summaries with pie charts for spending categories, bar charts for historical comparisons, and task completion rates. Export summaries for sharing.
- Smart Notification System: Send task reminders, missed task alerts, and bill due notifications via the browser Notification API. Alerts are triggered according to schedules.
- Multilingual Support: Support English, Hindi, and Gujarati languages for UI labels, buttons, and notifications.
- Offline Support: Enables offline persistence for viewing and adding data. App will sync automatically to Firestore when the Internet comes back. Show an 'Offline Mode' indicator when the app has no Internet connection.
- Location Based Reminders: When user go out reminds to buy vegetable or as per needs. The LLM will use a tool to determine if the user is near a relevant store.

## Style Guidelines:

- Primary color: Saffron (#FF9933) to represent the spirit of India and positive energy.
- Background color: Light beige (#F5F5DC), subtly desaturated, to provide a warm and inviting backdrop without being too distracting.
- Accent color: Teal (#008080), analogous to saffron (though dramatically different in brightness and saturation), used for interactive elements and highlights to provide contrast and draw attention.
- Headline font: 'Poppins', sans-serif, for a clean, modern look. Body font: 'PT Sans', sans-serif, for readability.
- Simple icons from React Icons library to represent task categories, bill types, and menu items. Use filled icons for active states.
- Touch-friendly buttons (min 48px height). Use cards to present tasks, bills, and expenses. Bottom navigation bar for main sections. Empty state illustrations for pages without data.
- Smooth page transitions using Next.js' built-in animation features. Subtle loading spinner for all async operations. Success/error toast notifications to give the user a quick feedback.