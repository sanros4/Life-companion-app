import type { Metadata } from 'next';
import { ThemeProvider } from '@/src/context/ThemeContext';
import './globals.css';

export const metadata: Metadata = { title: 'Life Companion 🌸' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="app-bg">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
