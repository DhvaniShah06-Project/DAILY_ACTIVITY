import type { Task, Bill, Expense } from '@/lib/types';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Prepare dinner',
    category: 'Cooking',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    isCompleted: false,
    repeat: 'daily',
    ingredients: ['Chicken', 'Broccoli', 'Rice'],
  },
  {
    id: '2',
    title: 'Clean the kitchen',
    category: 'Cleaning',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    isCompleted: false,
    repeat: 'weekly',
  },
  {
    id: '3',
    title: 'Buy groceries',
    category: 'Shopping',
    dueDate: new Date(new Date().setDate(new Date().getDate())),
    isCompleted: true,
  },
];

export const bills: Bill[] = [
  {
    id: 'b1',
    name: 'Electricity Bill',
    amount: 75.5,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'unpaid',
    category: 'Utilities',
  },
  {
    id: 'b2',
    name: 'Internet Subscription',
    amount: 50,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'unpaid',
    category: 'Subscription',
  },
  {
    id: 'b3',
    name: 'Water Bill',
    amount: 30.0,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    status: 'paid',
    category: 'Utilities',
    paymentDate: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
];

export const expenses: Expense[] = [
  {
    id: 'e1',
    category: 'Grocery',
    amount: 120.75,
    date: new Date(),
    notes: 'Weekly shopping',
  },
  {
    id: 'e2',
    category: 'Transport',
    amount: 45.5,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    notes: 'Fuel for car',
  },
  {
    id: 'e3',
    category: 'Entertainment',
    amount: 30.0,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    notes: 'Movie tickets',
  },
  {
    id: 'e4',
    category: 'Bills',
    amount: 150.0,
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
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
