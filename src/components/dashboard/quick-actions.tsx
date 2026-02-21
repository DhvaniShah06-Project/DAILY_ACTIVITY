import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Receipt, Wallet, ListChecks } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const actions = [
  {
    href: '/tasks#add',
    label: 'Add Task',
    icon: ListChecks,
  },
  {
    href: '/expenses#add',
    label: 'Log Expense',
    icon: Wallet,
  },
  {
    href: '/bills#add',
    label: 'Add Bill',
    icon: Receipt,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-headline text-lg font-semibold text-center sm:text-left">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
                {actions.map(({ href, label, icon: Icon }) => (
                <Button
                    key={href}
                    variant="outline"
                    className="justify-center gap-2 h-12 text-sm"
                    asChild
                >
                    <Link href={href}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    </Link>
                </Button>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
