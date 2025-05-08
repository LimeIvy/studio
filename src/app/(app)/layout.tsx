
import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <Header />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <Toaster />
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CourseFlow. 愛情を込めて作られました。
          </p>
        </div>
      </footer>
    </div>
  );
}
