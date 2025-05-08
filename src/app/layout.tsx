
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { PageTransition } from '@/components/layout/page-transition';

export const metadata: Metadata = {
  title: {
    default: 'CourseFlow - インタラクティブ学習プラットフォーム',
    template: '%s | CourseFlow',
  },
  description: 'マークダウン形式のコースと進捗追跡機能を備えたインタラクティブな学習プラットフォーム。',
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
