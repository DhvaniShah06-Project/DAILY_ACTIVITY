'use client';
import { useState, useEffect } from 'react';
import type { Bill } from '@/lib/types';
import { bills as dummyBills } from '@/lib/data';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { BillList } from './components/bill-list';
import { PaymentTips } from './components/payment-tips';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { BillForm } from './components/bill-form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, onSnapshot, query, writeBatch } from 'firebase/firestore';


export default function BillsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setBills([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const billsQuery = query(collection(db, 'users', user.uid, 'bills'));
    const unsubscribe = onSnapshot(billsQuery, async (snapshot) => {
      if (snapshot.empty && user) {
        // One-time seed
        try {
          const batch = writeBatch(db);
          const billsCol = collection(db, 'users', user.uid, 'bills');
          dummyBills.forEach((bill) => {
            const docRef = doc(billsCol);
            const { id, ...billData } = bill;
            batch.set(docRef, { ...billData, createdAt: serverTimestamp() });
          });
          await batch.commit();
        } catch (e) {
          console.error("Error seeding bills: ", e);
          if (e instanceof Error) {
            toast({ variant: 'destructive', title: 'Seeding Error', description: `Could not pre-populate bills: ${e.message}` });
          }
        }
      } else {
        const fetchedBills = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(),
            paymentDate: data.paymentDate?.toDate ? data.paymentDate.toDate() : undefined,
          } as Bill;
        });
        setBills(fetchedBills);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching bills: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch bills.' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, db, toast]);


  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleAddBill = (billData: Omit<Bill, 'id' | 'status'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    const dataToSave: { [key: string]: any } = {
      name: billData.name,
      amount: billData.amount,
      category: billData.category,
      dueDate: billData.dueDate,
      status: 'unpaid',
      createdAt: serverTimestamp(),
    };

    if (billData.paymentMethod) {
        dataToSave.paymentMethod = billData.paymentMethod;
    }

    const collectionRef = collection(db, 'users', user.uid, 'bills');
    addDoc(collectionRef, dataToSave)
      .then(() => {
        toast({ title: 'Success', description: 'Bill added successfully.' });
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error adding bill: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not add bill. ${error instanceof Error ? error.message : ''}`,
        });
      });
  };

  const handleUpdateBillStatus = (billId: string, status: Bill['status']) => {
    if (!user) return;
    const billRef = doc(db, 'users', user.uid, 'bills', billId);
    
    const dataToUpdate: { [key: string]: any } = { status };
    if (status === 'paid') {
      dataToUpdate.paymentDate = serverTimestamp();
    } else {
      dataToUpdate.paymentDate = null;
    }

    updateDoc(billRef, dataToUpdate)
      .catch((error) => {
        console.error("Error updating bill: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not update bill. ${error instanceof Error ? error.message : ''}`,
        });
      });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Bills</h1>
          <p className="text-muted-foreground">
            Track your upcoming payments and manage due dates.
          </p>
        </div>
        <div className="flex gap-2">
          <PaymentTips bills={bills} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Add a new bill</DialogTitle>
                <DialogDescription>
                  Enter the details for a new bill to track.
                </DialogDescription>
              </DialogHeader>
              <BillForm onSubmit={handleAddBill} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : bills.length > 0 ? (
        <BillList bills={bills} onUpdateStatus={handleUpdateBillStatus} />
      ) : (
        <EmptyState
          title="No bills to show!"
          description="Add a bill to start tracking your payments."
          imageSrc="https://picsum.photos/seed/empty-bills/400/300"
          imageAlt="Empty bills list"
          imageHint="empty wallet"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Add a new bill</DialogTitle>
                <DialogDescription>
                  Enter the details for a new bill to track.
                </DialogDescription>
              </DialogHeader>
              <BillForm onSubmit={handleAddBill} />
            </DialogContent>
          </Dialog>
        </EmptyState>
      )}
    </div>
  );
}
