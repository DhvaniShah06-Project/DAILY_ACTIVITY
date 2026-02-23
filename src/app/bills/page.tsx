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
import { useUser } from '@/firebase';


export default function BillsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [bills, setBills] = useState<Bill[]>(dummyBills);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    
    const newBill: Bill = {
      ...billData,
      id: Date.now().toString(),
      status: 'unpaid',
    };

    setBills(prevBills => [...prevBills, newBill]);
    toast({ title: 'Success', description: 'Bill added successfully.' });
    setIsDialogOpen(false);
  };

  const handleUpdateBillStatus = (billId: string, status: Bill['status']) => {
    setBills(prevBills => prevBills.map(bill => {
      if (bill.id === billId) {
        return {
          ...bill,
          status,
          paymentDate: status === 'paid' ? new Date() : undefined,
        };
      }
      return bill;
    }));
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
