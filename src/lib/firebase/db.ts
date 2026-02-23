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
  const dataToAdd = {
    title: task.title,
    category: task.category,
    dueDate: task.dueDate,
    isCompleted: false,
    createdAt: serverTimestamp(),
    ...(task.ingredients && task.ingredients.length > 0 && { ingredients: task.ingredients }),
  };

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
  const dataToAdd = {
    name: bill.name,
    amount: bill.amount,
    category: bill.category,
    dueDate: bill.dueDate,
    status: 'unpaid',
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'users', userId, 'bills'), dataToAdd);
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
    const dataToAdd = {
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        createdAt: serverTimestamp(),
        ...(expense.notes && { notes: expense.notes }),
    };

  await addDoc(collection(db, 'users', userId, 'expenses'), dataToAdd);
};
