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
import type { Expense, Task } from '@/lib/types';
import { expenses as dummyExpenses, tasks as dummyTasks } from '@/lib/data';
import { useUser } from '@/firebase';

type SummaryOutput = {
    totalSpending: number;
    categoryBreakdown: any[];
    summaryText: string;
    tips: string[];
}

export default function ReportsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const [summary, setSummary] = useState<SummaryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const getStorageKey = (key: string) => user ? `${key}_${user.uid}` : key;

    useEffect(() => {
        if (!user || !isInitialLoad) return;
        try {
            const storedExpenses = localStorage.getItem(getStorageKey('expenses'));
            if (storedExpenses) {
                const parsedExpenses = JSON.parse(storedExpenses).map((expense: any) => ({
                    ...expense,
                    date: new Date(expense.date),
                }));
                setExpenses(parsedExpenses);
            } else {
                setExpenses(dummyExpenses);
            }

            const storedTasks = localStorage.getItem(getStorageKey('tasks'));
            if (storedTasks) {
                const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
                    ...task,
                    dueDate: new Date(task.dueDate),
                }));
                setTasks(parsedTasks);
            } else {
                setTasks(dummyTasks);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            setExpenses(dummyExpenses);
            setTasks(dummyTasks);
        } finally {
            setIsInitialLoad(false);
        }
    }, [user, isInitialLoad]);

    useEffect(() => {
        if (!isInitialLoad && user) {
            localStorage.setItem(getStorageKey('expenses'), JSON.stringify(expenses));
            localStorage.setItem(getStorageKey('tasks'), JSON.stringify(tasks));
        }
    }, [expenses, tasks, isInitialLoad, user]);


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
        
        // Simulate AI response with a delay
        setTimeout(() => {
          setSummary({
            totalSpending: expenses.reduce((acc, e) => acc + e.amount, 0),
            categoryBreakdown: [], // Not used in UI
            summaryText: "Based on your spending, you're doing a great job managing your budget. Your largest expense category is 'Grocery'.",
            tips: ["Consider looking for sales on groceries.", "Review your entertainment spending for potential savings."]
          });
          setIsLoading(false);
        }, 1500);
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
                        <Button onClick={getSummary} disabled={expenses.length === 0}>
                            Generate Summary
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <SpendingPieChart expenses={expenses} />
        <TaskCompletionReport tasks={tasks} />
      </div>
      <HistoricalBarChart />
    </div>
  );
}
