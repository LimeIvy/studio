
"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  // The key prop on the div will cause React to re-mount the component
  // (and its children) when the pathname changes, triggering animations defined in CSS.
  return (
    <div key={pathname} className="page-transition-wrapper">
      {children}
    </div>
  );
}
