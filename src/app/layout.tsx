import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Updated import
import './globals.css';

// const geistSans = Geist({ // Removed, using GeistSans directly
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({ // Removed, not explicitly used in this design
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: {
    default: 'CourseFlow - Learn Interactively',
    template: '%s | CourseFlow',
  },
  description: 'Interactive learning platform with markdown courses and progress tracking.',
  icons: {
    icon: "/favicon.ico", // Placeholder, will not generate actual file
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}> {/* Updated className */}
        {children}
      </body>
    </html>
  );
}
