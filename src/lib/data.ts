import type { Task, Bill, Expense } from '@/lib/types';

// Use a fixed date for consistency to avoid hydration errors.
const today = new Date('2024-07-20T10:00:00');

// Helper function to get a date relative to 'today'
const getDate = (dayOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + dayOffset);
  return date;
};

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Prepare dinner',
    category: 'Cooking',
    dueDate: getDate(1),
    isCompleted: false,
    repeat: 'daily',
    ingredients: ['Chicken', 'Broccoli', 'Rice'],
  },
  {
    id: '2',
    title: 'Clean the kitchen',
    category: 'Cleaning',
    dueDate: getDate(2),
    isCompleted: false,
    repeat: 'weekly',
  },
  {
    id: '3',
    title: 'Buy groceries',
    category: 'Shopping',
    dueDate: getDate(0),
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Pay internet bill',
    category: 'Other',
    dueDate: getDate(0),
    isCompleted: false,
  },
];

export const bills: Bill[] = [
  {
    id: 'b1',
    name: 'Electricity Bill',
    amount: 75.5,
    dueDate: getDate(5),
    status: 'unpaid',
    category: 'Utilities',
  },
  {
    id: 'b2',
    name: 'Internet Subscription',
    amount: 50,
    dueDate: getDate(10),
    status: 'unpaid',
    category: 'Subscription',
  },
  {
    id: 'b3',
    name: 'Water Bill',
    amount: 30.0,
    dueDate: getDate(-3),
    status: 'paid',
    category: 'Utilities',
    paymentDate: getDate(-4),
  },
];

export const expenses: Expense[] = [
  {
    id: 'e1',
    category: 'Grocery',
    amount: 120.75,
    date: getDate(0),
    notes: 'Weekly shopping',
  },
  {
    id: 'e2',
    category: 'Transport',
    amount: 45.5,
    date: getDate(-1),
    notes: 'Fuel for car',
  },
  {
    id: 'e3',
    category: 'Entertainment',
    amount: 30.0,
    date: getDate(-2),
    notes: 'Movie tickets',
  },
  {
    id: 'e4',
    category: 'Bills',
    amount: 150.0,
    date: getDate(-3),
  },
];

export const budget = {
  total: 1000,
  categories: [
    { name: 'Grocery', spent: 250, total: 400 },
    { name: 'Transport', spent: 100, total: 150 },
    { name: 'Entertainment', spent: 80, total: 100 },
    { name: 'Bills', spent: 200, total: 250 },
    { name: 'Other', spent: 50, total: 100 },
  ],
};
