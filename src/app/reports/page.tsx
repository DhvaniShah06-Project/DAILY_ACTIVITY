'use client';

import { useState } from 'react';
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
import { expenses as mockExpenses } from '@/lib/data';

// This defines the shape of the dummy data we'll create.
type DummySummaryOutput = {
    totalSpending: number;
    categoryBreakdown: any[]; // Not used in UI, can be empty
    summaryText: string;
    tips: string[];
}

export default function ReportsPage() {
    const { toast } = useToast();
    const [summary, setSummary] = useState<DummySummaryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expenses] = useState<Expense[]>(mockExpenses);

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
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const dummySummary: DummySummaryOutput = {
            totalSpending: expenses.reduce((acc, e) => acc + e.amount, 0),
            categoryBreakdown: [], // Not used in the UI, can be empty
            summaryText: "This month, your spending was highest in the 'Grocery' category. Your 'Entertainment' spending was moderate, which is great for your savings goals.",
            tips: [
                "Try meal planning to reduce grocery costs.",
                "Look for free community events to cut down on entertainment spending."
            ]
        };
        
        setSummary(dummySummary);
        setIsLoading(false);
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
                        <Button onClick={getSummary} disabled={expenses.length === 0}>Generate Summary</Button>
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
