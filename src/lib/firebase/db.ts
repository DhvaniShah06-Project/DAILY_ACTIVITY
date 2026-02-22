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
  await addDoc(collection(db, 'users', userId, 'tasks'), {
    ...task,
    isCompleted: false,
    createdAt: serverTimestamp(),
  });
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
  await addDoc(collection(db, 'users', userId, 'bills'), {
    ...bill,
    status: 'unpaid',
    createdAt: serverTimestamp(),
  });
};

export const updateBillStatus = async (
  db: Firestore,
  userId: string,
  billId: string,
  status: Bill['status']
) => {
  const billRef = doc(db, 'users', userId, 'bills', billId);
  await updateDoc(billRef, {
    status,
    paymentDate: status === 'paid' ? new Date() : null,
  });
};

// Expenses
export const addExpense = async (
  db: Firestore,
  userId: string,
  expense: Omit<Expense, 'id'>
) => {
  await addDoc(collection(db, 'users', userId, 'expenses'), {
    ...expense,
    createdAt: serverTimestamp(),
  });
};
