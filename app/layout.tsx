import './globals.css';
import { ReactNode } from 'react';

export const metadata = { title: 'FB Ads Dashboard' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
