'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Bill } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type PaymentTipsProps = {
  bills: Bill[];
};

export function PaymentTips({ bills }: PaymentTipsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);
  const { toast } = useToast();

  const getTips = async () => {
    setIsLoading(true);
    setTips(null);

    const mappedBills = bills.map(b => ({
        name: b.name,
        amount: b.amount,
        dueDate: b.dueDate.toISOString().split('T')[0],
        paymentDate: b.paymentDate?.toISOString().split('T')[0],
        status: b.status,
        category: b.category,
    }))

    try {
        const response = await fetch('/api/ai/bill-tips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ billHistory: mappedBills }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tips from API');
        }

        const result = await response.json();
        setTips(result.tips);
    } catch (error) {
        console.error('Error fetching payment tips:', error);
        toast({ variant: 'destructive', title: 'AI Error', description: 'Could not fetch payment tips.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={getTips}>
          <Sparkles className="mr-2 h-4 w-4" />
          Get AI Tips
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-primary" />
            Personalized Payment Tips
          </DialogTitle>
          <DialogDescription>
            Here are some AI-powered suggestions based on your bill history.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 min-h-[10rem] flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : tips ? (
            <p className="text-sm whitespace-pre-wrap font-sans">{tips}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Click the button to generate tips.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
