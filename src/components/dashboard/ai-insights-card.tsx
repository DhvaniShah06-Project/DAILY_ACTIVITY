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

  const getSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);

    // Simulate API call with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dummySuggestion = `Based on your spending, you're doing great with your 'Transport' budget. However, you've gone slightly over on 'Entertainment'. Consider looking for free events or a movie night at home to save some extra cash for your vacation goal!`;

    setSuggestion(dummySuggestion);
    setIsLoading(false);
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
        <Button onClick={getSuggestion} disabled={isLoading} className="w-full">
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
