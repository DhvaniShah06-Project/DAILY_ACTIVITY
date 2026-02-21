export type Task = {
  id: string;
  title: string;
  category: 'Cooking' | 'Cleaning' | 'Shopping' | 'Other';
  dueDate: Date;
  isCompleted: boolean;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  ingredients?: string[];
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'unpaid' | 'overdue';
  category: 'Utilities' | 'Subscription' | 'Rent' | 'Other';
  paymentDate?: Date;
  paymentMethod?: string;
};

export type Expense = {
  id: string;
  category: 'Grocery' | 'Transport' | 'Entertainment' | 'Bills' | 'Other';
  amount: number;
  date: Date;
  notes?: string;
};
