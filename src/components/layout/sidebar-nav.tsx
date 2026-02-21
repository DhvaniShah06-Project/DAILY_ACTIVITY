'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ListChecks,
  Receipt,
  Wallet,
  AreaChart,
  LocateFixed,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/bills', label: 'Bills', icon: Receipt },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/reports', label: 'Reports', icon: AreaChart },
  { href: '/reminders', label: 'Reminders', icon: LocateFixed },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === '/' ? pathname === href : pathname.startsWith(href);
        return (
          <SidebarMenuItem key={href}>
            <Link href={href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={isActive}
                className={cn(
                  'font-headline',
                  isActive && 'bg-primary/20 text-primary hover:bg-primary/30'
                )}
                tooltip={{ children: label }}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
