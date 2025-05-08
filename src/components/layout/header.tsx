
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Settings, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';
import { LogoIcon } from '@/components/icons/logo-icon';
import { mockUser } from '@/lib/mock-data'; 
import { cn } from '@/lib/utils';

export function Header() {
  
  const user = mockUser; 

  const navItems = [
    { href: '/', label: 'コース一覧', icon: BookOpen },
    { href: '/admin', label: '管理ダッシュボード', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="mr-auto hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <LogoIcon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              CourseFlow
            </span>
          </Link>
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Button variant="ghost" asChild key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden mr-auto">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">メニューを開閉</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 w-72 bg-card">
              <Link href="/" className="flex items-center space-x-2 px-4 py-4 border-b border-border">
                <LogoIcon className="h-7 w-7 text-primary" />
                <span className="font-bold text-xl tracking-tight text-foreground">CourseFlow</span>
              </Link>
              <div className="space-y-1 p-4">
                {navItems.map((item) => (
                  <Button variant="ghost" asChild key={item.label} className="w-full justify-start">
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-3 text-base font-medium rounded-md text-foreground hover:bg-muted hover:text-primary"
                    >
                       <item.icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile Centered Logo (only visible when menu is closed) */}
        <Link href="/" className="flex items-center space-x-2 md:hidden absolute left-1/2 -translate-x-1/2">
            <LogoIcon className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl tracking-tight text-foreground">CourseFlow</span>
        </Link>


        <div className="ml-auto flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-primary/50 hover:border-primary transition-colors">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? 'User'} data-ai-hint="user profile" />
                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 py-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>マイ進捗</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="#" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>設定</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ログアウト</span> 
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">ログイン</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
