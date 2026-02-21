'use client';
import { useState } from 'react';
import type { Bill } from '@/lib/types';
import { bills as initialBills } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { BillForm } from './components/bill-form';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddBill = (newBill: Omit<Bill, 'id' | 'status'>) => {
    const billToAdd: Bill = {
      ...newBill,
      id: Date.now().toString(),
      status: 'unpaid',
    };
    setBills((prevBills) => [billToAdd, ...prevBills]);
    setIsDialogOpen(false);
  };
  
  const handleUpdateBillStatus = (billId: string, status: Bill['status']) => {
    setBills(
      bills.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status,
              paymentDate: status === 'paid' ? new Date() : undefined,
            }
          : bill
      )
    );
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
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bill
            </Button>
          </DialogTrigger>
        </EmptyState>
      )}
    </div>
  );
}
