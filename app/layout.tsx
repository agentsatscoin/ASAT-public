import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASAT Quest',
  description:
    'ASAT is the reserve and coordination unit for the autonomous economy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
