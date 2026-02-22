import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import type { Bill, Expense, Task } from '@/lib/types';

// Helper function to remove undefined properties from an object before saving to Firestore.
const cleanupObject = <T extends object>(obj: T): Partial<T> => {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

// Tasks
export const addTask = async (
  db: Firestore,
  userId: string,
  task: Omit<Task, 'id' | 'isCompleted'>
) => {
  const cleanTask = cleanupObject(task);
  await addDoc(collection(db, 'users', userId, 'tasks'), {
    ...cleanTask,
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
  const cleanBill = cleanupObject(bill);
  await addDoc(collection(db, 'users', userId, 'bills'), {
    ...cleanBill,
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
  const dataToUpdate: { status: Bill['status']; paymentDate?: Date | null } = {
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
  const cleanExpense = cleanupObject(expense);
  await addDoc(collection(db, 'users', userId, 'expenses'), {
    ...cleanExpense,
    createdAt: serverTimestamp(),
  });
};
