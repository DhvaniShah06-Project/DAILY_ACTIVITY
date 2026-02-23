'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Globe, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppHeader() {
  const pathname = usePathname();

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard';
    const page = path.split('/')[1];
    switch (page) {
      case 'tasks':
        return 'My Tasks';
      case 'bills':
        return 'Bills';
      case 'expenses':
        return 'Expenses';
      case 'reports':
        return 'Reports';
      case 'reminders':
        return 'Smart Reminders';
      case 'settings':
        return 'Settings';
      default:
        return page.charAt(0).toUpperCase() + page.slice(1);
    }
  };
  
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h2 className="text-lg font-semibold font-headline">{pageTitle}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Switch Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem disabled>हिंदी (coming soon)</DropdownMenuItem>
            <DropdownMenuItem disabled>ગુજરાતી (coming soon)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="ghost" size="icon">
          <Link href="/settings">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage
                src={"https://picsum.photos/seed/user-avatar/100/100"}
                alt="User avatar"
                data-ai-hint="person portrait"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
                <p className="font-medium">My Account</p>
                <p className="text-xs text-muted-foreground">demo@user.com</p>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
