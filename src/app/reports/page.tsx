'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { SpendingPieChart } from './components/spending-pie-chart';
import { HistoricalBarChart } from './components/historical-bar-chart';
import { TaskCompletionReport } from './components/task-completion-report';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/lib/types';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

type SummaryOutput = {
    totalSpending: number;
    categoryBreakdown: any[];
    summaryText: string;
    tips: string[];
}

export default function ReportsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const db = useFirestore();
    const [summary, setSummary] = useState<SummaryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoadingExpenses(false);
            return;
        }
        const expensesQuery = query(collection(db, 'users', user.uid, 'expenses'));
        const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
            const fetchedExpenses = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.toDate ? data.date.toDate() : new Date(),
                } as Expense;
            });
            setExpenses(fetchedExpenses);
            setIsLoadingExpenses(false);
        });
        return () => unsubscribe();
    }, [user, db]);

    const getSummary = async () => {
        if (!expenses || expenses.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data',
                description: 'There are no expenses to analyze.',
            });
            return;
        }
        setIsLoading(true);
        setSummary(null);
        
        const apiExpenses = expenses.map(e => ({
            category: e.category,
            amount: e.amount,
            description: e.notes,
        }));

        try {
            const response = await fetch('/api/ai/spending-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
                    expenses: apiExpenses,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch summary from API');
            }
            
            const result = await response.json();
            setSummary(result);

        } catch (error) {
             console.error('Error fetching summary:', error);
             toast({ variant: 'destructive', title: 'AI Error', description: 'Could not fetch summary.' });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your spending and productivity.
          </p>
        </div>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Export Summary
        </Button>
      </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">AI Monthly Summary</CardTitle>
                <CardDescription>An AI-generated summary of your spending patterns and habits.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex items-center justify-center min-h-[10rem]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : summary ? (
                    <div className="space-y-4">
                        <p className="whitespace-pre-wrap font-sans">{summary.summaryText}</p>
                        <div>
                            <h4 className="font-semibold mb-2">Saving Tips:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {summary.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Generate an AI summary of your monthly finances.</p>
                        <Button onClick={getSummary} disabled={isLoadingExpenses || expenses.length === 0}>
                            {isLoadingExpenses ? 'Loading expenses...' : 'Generate Summary'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <SpendingPieChart />
        <TaskCompletionReport />
      </div>
      <HistoricalBarChart />
    </div>
  );
}
