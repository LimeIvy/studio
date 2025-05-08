
import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
      <Toaster />
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CourseFlow. 愛情を込めて作られました。
          </p>
        </div>
      </footer>
    </div>
  );
}
