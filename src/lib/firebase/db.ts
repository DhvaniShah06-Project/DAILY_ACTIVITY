import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import type { Bill, Expense, Task } from '@/lib/types';

/**
 * A robust utility to remove any properties from an object that have an `undefined` value.
 * Firestore throws an error for `undefined` field values.
 * This is the definitive way to prevent data submission errors.
 * @param obj The object to clean.
 * @returns A new object with `undefined` properties removed.
 */
function cleanUndefined(obj: any) {
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

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
  // The 'cleanUndefined' function will remove 'ingredients' if it is undefined.
  await addDoc(collection(db, 'users', userId, 'tasks'), cleanUndefined(dataToAdd));
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

  // The 'cleanUndefined' function will remove 'paymentMethod' if it is undefined.
  await addDoc(collection(db, 'users', userId, 'bills'), cleanUndefined(dataToAdd));
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
  
  // The 'cleanUndefined' function will remove 'notes' if it is undefined.
  await addDoc(collection(db, 'users', userId, 'expenses'), cleanUndefined(dataToAdd));
};
