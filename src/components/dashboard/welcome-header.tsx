import { tasks, bills } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { ListChecks, Receipt } from 'lucide-react';

export function WelcomeHeader() {
  const pendingTasks = tasks.filter((t) => !t.isCompleted).length;
  const unpaidBills = bills.filter((b) => b.status === 'unpaid').length;

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">Welcome Back!</h1>
      <p className="text-muted-foreground">
        Here is your household summary for today.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-lg">
                <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingTasks}</p>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-lg">
                <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unpaidBills}</p>
              <p className="text-sm text-muted-foreground">Unpaid Bills</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
