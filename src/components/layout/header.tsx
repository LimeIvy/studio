
"use client";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'; 
import { Menu, Settings, LogOut, LayoutDashboard, Users, Globe, Zap, ChevronUp } from 'lucide-react';
import { LogoIcon } from '@/components/icons/logo-icon';
import { mockUser, XP_PER_LEVEL, getXpForNextLevel } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator'; 
import React, { useState, useEffect } from 'react';

export function Header() {
  // Use state to ensure mockUser updates are reflected if it changes during session
  const [user, setUser] = useState(mockUser);

  useEffect(() => {
    // This effect could subscribe to a global user state if using a state manager
    // For now, it just ensures initial state is set and could be updated if mockUser was reactive
    setUser(mockUser);
  }, []); // Re-run if mockUser identity changes (though it won't in this mock setup)
  
  // Recalculate derived values if user state changes
  const currentLevelXp = (user.level - 1) * XP_PER_LEVEL;
  const xpIntoCurrentLevel = user.xp - currentLevelXp;
  const xpForNextLevelUp = getXpForNextLevel(user.level);
  const xpNeededForNextLevel = xpForNextLevelUp - currentLevelXp;
  const progressPercentage = xpNeededForNextLevel > 0 ? (xpIntoCurrentLevel / xpNeededForNextLevel) * 100 : 0;

  const navItems = [
    { href: '/public-courses', label: '公開コース', icon: Globe },
    { href: '/team-hub', label: 'チームハブ', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center max-w-full px-4 sm:px-6 lg:px-8">
        <div className="mr-auto hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <LogoIcon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              CourseFlow
            </span>
          </Link>
        </div>

        <div className="md:hidden mr-auto">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">メニューを開閉</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 w-72 bg-card">
              <SheetTitle className="sr-only">メインメニュー</SheetTitle>
              {/* Adding a visually hidden description for accessibility */}
              <SheetDescription className="sr-only">サイトナビゲーションとアクションのためのメインメニューパネル。</SheetDescription>
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
                 <Separator className="my-2" /> 
                 <Button variant="ghost" asChild className="w-full justify-start">
                    <Link
                      href="/admin"
                      className="flex items-center px-3 py-3 text-base font-medium rounded-md text-foreground hover:bg-muted hover:text-primary"
                    >
                       <LayoutDashboard className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      管理
                    </Link>
                  </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <Link href="/" className="flex items-center space-x-2 md:hidden absolute left-1/2 -translate-x-1/2">
            <LogoIcon className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl tracking-tight text-foreground md:hidden">CourseFlow</span>
        </Link>


        <div className="ml-auto flex items-center space-x-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <div className="flex items-center">
                   <ChevronUp className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold text-foreground">レベル {user.level}</span>
                </div>
                <div className="w-28 mt-0.5">
                  <Progress value={progressPercentage} aria-label={`XP ${xpIntoCurrentLevel}/${xpNeededForNextLevel}`} className="h-1.5 [&>div]:bg-yellow-500" />
                  <p className="text-xs text-muted-foreground text-right mt-0.5">{xpIntoCurrentLevel} / {xpNeededForNextLevel} XP</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-primary/50 hover:border-primary transition-colors">
                      <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? 'User'} data-ai-hint="user profile"/>
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
                       <div className="sm:hidden mt-2"> {/* XP/Level for mobile dropdown */}
                          <div className="flex items-center">
                            <ChevronUp className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-xs font-semibold text-foreground">レベル {user.level}</span>
                          </div>
                           <Progress value={progressPercentage} aria-label={`XP ${xpIntoCurrentLevel}/${xpNeededForNextLevel}`} className="h-1.5 mt-1 [&>div]:bg-yellow-500" />
                           <p className="text-xs text-muted-foreground text-right mt-0.5">{xpIntoCurrentLevel} / {xpNeededForNextLevel} XP</p>
                       </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>管理ダッシュボード</span>
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
            </>
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
