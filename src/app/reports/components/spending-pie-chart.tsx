'use client';
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo } from 'react';
import { type Expense } from '@/lib/types';

type SpendingPieChartProps = {
    expenses: Expense[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function SpendingPieChart({ expenses }: SpendingPieChartProps) {
  const data = useMemo(() => {
    if (!expenses) return [];
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [expenses]);
  
  if (data.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Spending by Category</CardTitle>
                <CardDescription>
                A breakdown of your expenses for this month.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full flex items-center justify-center">
                <p className="text-muted-foreground">No spending data available.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Spending by Category</CardTitle>
        <CardDescription>
          A breakdown of your expenses for this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend formatter={(value) => <span className="text-foreground capitalize">{value}</span>}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
