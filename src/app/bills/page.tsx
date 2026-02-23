'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Bill } from '@/lib/types';
import { Loader2, PlusCircle } from 'lucide-react';
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
import { useUser, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, Timestamp } from 'firebase/firestore';
import { addBill, updateBillStatus } from '@/lib/firebase/db';
import { useToast } from '@/hooks/use-toast';

export default function BillsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const billsRef = useMemo(() => (user ? collection(firestore, 'users', user.uid, 'bills') : null), [user, firestore]);
  const { data: rawBills, isLoading } = useCollection<Bill>(billsRef);

  const bills = useMemo(() => {
    if (!rawBills) return [];
    return rawBills.map(bill => ({
      ...bill,
      dueDate: bill.dueDate instanceof Timestamp ? bill.dueDate.toDate() : bill.dueDate,
      paymentDate: bill.paymentDate instanceof Timestamp ? bill.paymentDate.toDate() : bill.paymentDate,
    }));
  }, [rawBills]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleAddBill = async (newBill: Omit<Bill, 'id' | 'status'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to add a bill.' });
      return;
    }
    try {
      await addBill(firestore, user.uid, newBill);
      toast({ title: 'Success', description: 'Bill added successfully.' });
      (document.activeElement as HTMLElement)?.blur();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add bill.' });
      console.error(error);
    }
  };
  
  const handleUpdateBillStatus = async (billId: string, status: Bill['status']) => {
    if (!user) return;
    try {
      await updateBillStatus(firestore, user.uid, billId, status);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update bill status.' });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {bills.length > 0 ? (
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
