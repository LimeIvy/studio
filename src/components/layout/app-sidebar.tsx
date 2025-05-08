
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Globe, Users, Home, Settings, LayoutDashboard, PlusCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockUser, getUserTeams } from '@/lib/mock-data';

const mainNavItems = [
  { href: '/public-courses', label: '公開コース', icon: Globe },
  { href: '/team-hub', label: 'チームハブ', icon: Users },
];

const bottomNavItems = [
   { href: '/admin', label: '管理', icon: LayoutDashboard },
   { href: '#', label: '設定', icon: Settings }, // Placeholder
];


export function AppSidebar() {
  const pathname = usePathname();
  const userTeams = getUserTeams(mockUser.id).filter(team => team.members.some(m => m.userId === mockUser.id && (m.role === 'leader' || m.role === 'editor')));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          <h2 className="px-2 text-lg font-semibold tracking-tight text-foreground">
            ナビゲーション
          </h2>
          {mainNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}

          {userTeams.length > 0 && (
             <Accordion type="multiple" className="w-full">
              <AccordionItem value="teams-navigation" className="border-none">
                <AccordionTrigger className={cn(
                  "py-2 px-3 text-sm font-medium hover:bg-muted hover:no-underline rounded-md",
                  pathname.startsWith('/teams/') && !pathname.startsWith('/teams/new') && "bg-muted text-primary"
                )}>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    マイチーム
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1">
                  <div className="space-y-1 pl-6">
                    {getUserTeams(mockUser.id).map(team => ( // Show all teams user is part of for navigation
                      <Button
                        key={team.id}
                        variant={pathname === `/teams/${team.id}` ? 'secondary' : 'ghost'}
                        className="w-full justify-start h-8 text-xs"
                        asChild
                      >
                        <Link href={`/teams/${team.id}`}>
                           {team.name}
                        </Link>
                      </Button>
                    ))}
                     <Button
                      variant='ghost'
                      className="w-full justify-start h-8 text-xs text-muted-foreground"
                      asChild
                    >
                      <Link href="/teams/new">
                        <PlusCircle className="mr-2 h-3 w-3" />
                        新しいチームを作成
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="course-creation" className="border-none">
              <AccordionTrigger className={cn(
                  "py-2 px-3 text-sm font-medium hover:bg-muted hover:no-underline rounded-md",
                  pathname === '/courses/new' && "bg-muted text-primary"
              )}>
                 <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  コース作成
                 </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1">
                 <div className="space-y-1 pl-6">
                    <Button
                        variant={pathname === `/courses/new` && new URLSearchParams(window.location.search).get('target') === 'public' ? 'secondary' : 'ghost'}
                        className="w-full justify-start h-8 text-xs"
                        asChild
                      >
                        <Link href="/courses/new?target=public">
                          公開コースを作成
                        </Link>
                    </Button>
                    {userTeams.map(team => ( // Only show teams where user can create courses
                       <Button
                        key={`create-for-${team.id}`}
                        variant={pathname === `/courses/new` && new URLSearchParams(window.location.search).get('teamId') === team.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start h-8 text-xs"
                        asChild
                      >
                        <Link href={`/courses/new?teamId=${team.id}`}>
                          {team.name}用コース作成
                        </Link>
                      </Button>
                    ))}
                    {userTeams.length === 0 && (
                       <Button
                        variant='ghost'
                        className="w-full justify-start h-8 text-xs text-muted-foreground italic"
                        disabled
                      >
                        (編集権限のあるチームなし)
                      </Button>
                    )}
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>


        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-border mt-auto">
        {bottomNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
        ))}
      </div>
    </aside>
  );
}
