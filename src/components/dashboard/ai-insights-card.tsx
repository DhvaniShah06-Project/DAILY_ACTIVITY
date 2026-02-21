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
import { providePersonalizedSavingSuggestions } from '@/ai/flows/provide-personalized-saving-suggestions';
import { budget, expenses } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function AiInsightsCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const getSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const spendingCategories = expenses.reduce((acc, expense) => {
        const existing = acc.find((e) => e.category === expense.category);
        if (existing) {
          existing.amount += expense.amount;
        } else {
          acc.push({ category: expense.category, amount: expense.amount });
        }
        return acc;
      }, [] as { category: string; amount: number }[]);

      const result = await providePersonalizedSavingSuggestions({
        spendingCategories,
        budget: {
          totalBudget: budget.total,
          categoryBudgets: budget.categories.map((c) => ({
            category: c.name,
            amount: c.total,
          })),
        },
        financialGoals: 'Save for a vacation and reduce unnecessary spending.',
      });
      setSuggestion(result.suggestions);
    } catch (error) {
      console.error('Failed to get saving suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI suggestions. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
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
