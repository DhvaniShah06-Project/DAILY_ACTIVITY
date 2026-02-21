'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { AppHeader } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { OfflineIndicator } from '@/components/layout/offline-indicator';
import { Button } from '@/components/ui/button';
import { Bell, HelpCircle } from 'lucide-react';
import { AuthGuard } from '../auth/auth-guard';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-4">
        {children}
      </div>
    );
  }
  
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <h1 className="font-headline text-2xl font-bold text-primary">
              GharSathi
            </h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="ghost" className="justify-start gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Support</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
        <BottomNav />
        <OfflineIndicator />
      </SidebarProvider>
    </AuthGuard>
  );
}
