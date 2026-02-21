'use client';
import { Bill } from '@/lib/types';
import { format, isPast, isToday } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type BillListProps = {
  bills: Bill[];
  onUpdateStatus: (billId: string, status: Bill['status']) => void;
};

export function BillList({ bills, onUpdateStatus }: BillListProps) {
  const unpaidBills = bills.filter(
    (bill) => bill.status === 'unpaid' && !isPast(bill.dueDate)
  );
  const overdueBills = bills.filter(
    (bill) => bill.status === 'unpaid' && isPast(bill.dueDate) && !isToday(bill.dueDate)
  );
  const paidBills = bills.filter((bill) => bill.status === 'paid');

  return (
    <div className="space-y-6">
      <BillCategory title="Overdue" bills={overdueBills} onUpdateStatus={onUpdateStatus} />
      <BillCategory title="Unpaid" bills={unpaidBills} onUpdateStatus={onUpdateStatus} />
      <BillCategory title="Paid" bills={paidBills} onUpdateStatus={onUpdateStatus} />
    </div>
  );
}

function BillCategory({
  title,
  bills,
  onUpdateStatus,
}: {
  title: string;
  bills: Bill[];
  onUpdateStatus: BillListProps['onUpdateStatus'];
}) {
    if (bills.length === 0) {
        return null;
    }
  return (
    <div>
      <h2 className="text-xl font-bold font-headline mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bills.map((bill) => (
          <BillItem key={bill.id} bill={bill} onUpdateStatus={onUpdateStatus} />
        ))}
      </div>
    </div>
  );
}

function BillItem({
  bill,
  onUpdateStatus,
}: {
  bill: Bill;
  onUpdateStatus: BillListProps['onUpdateStatus'];
}) {
  const isOverdue = bill.status === 'unpaid' && isPast(bill.dueDate) && !isToday(bill.dueDate);
  return (
    <Card className={cn('relative', isOverdue && 'border-destructive bg-destructive/10')}>
      <CardContent className="p-4 flex justify-between items-start">
        <div>
          <p className="font-semibold">{bill.name}</p>
          <p className="text-sm text-muted-foreground">{bill.category}</p>
          <p className="text-sm text-muted-foreground">
            Due: {format(bill.dueDate, 'MMM dd, yyyy')}
          </p>
          {bill.status === 'paid' && bill.paymentDate && (
            <p className="text-sm text-muted-foreground">
              Paid: {format(bill.paymentDate, 'MMM dd, yyyy')}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${bill.amount.toFixed(2)}</p>
          <Badge
            variant={
              isOverdue
                ? 'destructive'
                : bill.status === 'paid'
                ? 'default'
                : 'secondary'
            }
            className={cn(bill.status === 'paid' && 'bg-accent text-accent-foreground')}
          >
            {isOverdue ? 'Overdue' : bill.status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {bill.status !== 'paid' && (
                <DropdownMenuItem onClick={() => onUpdateStatus(bill.id, 'paid')}>
                  Mark as Paid
                </DropdownMenuItem>
              )}
              {bill.status === 'paid' && (
                <DropdownMenuItem onClick={() => onUpdateStatus(bill.id, 'unpaid')}>
                  Mark as Unpaid
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
