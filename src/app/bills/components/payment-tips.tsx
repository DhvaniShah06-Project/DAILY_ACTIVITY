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
import { provideBillPaymentTips } from '@/ai/flows/provide-bill-payment-tips';
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
    try {
      const result = await provideBillPaymentTips({
        billHistory: bills.map((b) => ({
          ...b,
          dueDate: b.dueDate.toISOString().split('T')[0],
          paymentDate: b.paymentDate?.toISOString().split('T')[0],
        })),
        userName: 'User',
      });
      setTips(result.tips);
    } catch (error) {
      console.error('Failed to get payment tips:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI tips. Please try again later.',
      });
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
