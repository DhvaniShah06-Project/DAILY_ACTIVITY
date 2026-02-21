'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const data = [
  { month: 'Jan', spending: 400 },
  { month: 'Feb', spending: 300 },
  { month: 'Mar', spending: 500 },
  { month: 'Apr', spending: 450 },
  { month: 'May', spending: 600 },
  { month: 'Jun', spending: 550 },
];

export function HistoricalBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Historical Spending</CardTitle>
        <CardDescription>Your spending over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Bar dataKey="spending" fill="hsl(var(--primary))" name="Spending ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
