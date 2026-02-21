'use client';

import { Button } from '@/components/ui/button';
import { Plus, ListChecks, Receipt, Wallet } from 'lucide-react';
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function Fab() {
  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rounded-full h-16 w-16 shadow-lg">
                    <Plus className="h-8 w-8" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-56 mb-2">
                <DropdownMenuItem asChild>
                     <Link href="/tasks#add">
                        <ListChecks className="mr-2 h-4 w-4" />
                        <span>Add Task</span>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/bills#add">
                        <Receipt className="mr-2 h-4 w-4" />
                        <span>Add Bill</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/expenses#add">
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Log Expense</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
