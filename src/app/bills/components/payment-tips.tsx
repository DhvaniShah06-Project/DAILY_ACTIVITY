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

    // Simulate AI response with a delay
    setTimeout(() => {
        setTips("To better manage your bills, consider setting up automatic payments for recurring expenses like subscriptions. Also, review your bills for any unusual charges to catch errors early.");
        setIsLoading(false);
    }, 1500);
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
