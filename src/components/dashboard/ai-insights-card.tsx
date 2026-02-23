'use client';

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/lib/types';

type BudgetData = {
  total: number;
  categories: {
    name: string;
    total: number;
    spent: number;
  }[];
};

type AiInsightsCardProps = {
  expenses: Expense[];
  budget: BudgetData;
};

export function AiInsightsCard({ expenses, budget }: AiInsightsCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const getSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);

    // Simulate AI response with a delay
    setTimeout(() => {
      if (expenses.length > 0) {
        setSuggestion("Based on your spending, you're doing a great job managing your budget. Your largest expense category is 'Grocery'. Consider looking for sales to save more!");
      } else {
        setSuggestion("Start logging expenses to get personalized saving tips.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Get personalized tips to manage your household better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestion && (
          <div className="mb-4 rounded-lg border bg-background p-3 text-sm">
            <p className="whitespace-pre-wrap font-sans">{suggestion}</p>
          </div>
        )}
        <Button onClick={getSuggestion} disabled={isLoading || expenses.length === 0} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Get Saving Tips'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
