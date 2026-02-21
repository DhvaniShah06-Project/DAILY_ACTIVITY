import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Receipt, Wallet, ListChecks } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const actions = [
  {
    href: '/tasks',
    label: 'Add Task',
    icon: ListChecks,
  },
  {
    href: '/expenses',
    label: 'Log Expense',
    icon: Wallet,
  },
  {
    href: '/bills',
    label: 'Add Bill',
    icon: Receipt,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <h3 className="font-headline text-lg font-semibold col-span-2 md:col-span-1 flex items-center">Quick Actions</h3>
            {actions.map(({ href, label, icon: Icon }) => (
            <Button
                key={href}
                variant="outline"
                className="justify-center gap-2 h-12 text-base"
                asChild
            >
                <Link href={href}>
                <Icon className="h-5 w-5" />
                {label}
                </Link>
            </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
