import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import type { Bill, Expense, Task } from '@/lib/types';

// Tasks
export const addTask = async (
  db: Firestore,
  userId: string,
  task: Omit<Task, 'id' | 'isCompleted'>
) => {
  const dataToAdd: { [key: string]: any } = {
    title: task.title,
    category: task.category,
    dueDate: task.dueDate,
    isCompleted: false,
    createdAt: serverTimestamp(),
  };

  // Only include ingredients if they are provided and not an empty array.
  if (task.ingredients && task.ingredients.length > 0) {
    dataToAdd.ingredients = task.ingredients;
  }

  await addDoc(collection(db, 'users', userId, 'tasks'), dataToAdd);
};

export const updateTaskCompletion = async (
  db: Firestore,
  userId: string,
  taskId: string,
  isCompleted: boolean
) => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await updateDoc(taskRef, { isCompleted });
};

// Bills
export const addBill = async (
  db: Firestore,
  userId: string,
  bill: Omit<Bill, 'id' | 'status'>
) => {
  const dataToAdd: { [key: string]: any } = {
    name: bill.name,
    amount: bill.amount,
    category: bill.category,
    dueDate: bill.dueDate,
    status: 'unpaid',
    createdAt: serverTimestamp(),
  };
  
  if (bill.paymentMethod) {
    dataToAdd.paymentMethod = bill.paymentMethod;
  }

  await addDoc(collection(db, 'users', userId, 'bills'), dataToAdd);
};

export const updateBillStatus = async (
  db: Firestore,
  userId: string,
  billId: string,
  status: Bill['status']
) => {
  const billRef = doc(db, 'users', userId, 'bills', billId);
  const dataToUpdate: { [key: string]: any } = {
    status,
  };
  if (status === 'paid') {
    dataToUpdate.paymentDate = new Date();
  } else {
    dataToUpdate.paymentDate = null;
  }
  await updateDoc(billRef, dataToUpdate);
};

// Expenses
export const addExpense = async (
  db: Firestore,
  userId: string,
  expense: Omit<Expense, 'id'>
) => {
  const dataToAdd: { [key: string]: any } = {
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    createdAt: serverTimestamp(),
  };
  
  // Only include notes if it's a non-empty string.
  if (expense.notes && expense.notes.trim() !== '') {
    dataToAdd.notes = expense.notes;
  }

  await addDoc(collection(db, 'users', userId, 'expenses'), dataToAdd);
};
