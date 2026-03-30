import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASAT — Agent Sats Reserve Protocol',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/asat-agent-glyph.svg" type="image/svg+xml" />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
