import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import type { Bill, Expense, Task } from '@/lib/types';

// This utility function removes any keys with `undefined` values from an object.
// Firestore throws an error if you try to save a document with an `undefined` field.
const removeUndefinedFields = (obj: { [key: string]: any }) => {
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
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
  const dataToAdd = {
    ...task,
    isCompleted: false,
    createdAt: serverTimestamp(),
  };

  // Clean the object before sending it to Firestore.
  const cleanedData = removeUndefinedFields(dataToAdd);

  await addDoc(collection(db, 'users', userId, 'tasks'), cleanedData);
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
  const dataToAdd = {
    ...bill,
    status: 'unpaid',
    createdAt: serverTimestamp(),
  };
  
  const cleanedData = removeUndefinedFields(dataToAdd);
  await addDoc(collection(db, 'users', userId, 'bills'), cleanedData);
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
  const dataToAdd = {
    ...expense,
    createdAt: serverTimestamp(),
  };

  const cleanedData = removeUndefinedFields(dataToAdd);
  await addDoc(collection(db, 'users', userId, 'expenses'), cleanedData);
};
