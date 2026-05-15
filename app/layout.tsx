import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Katsina LGA — Project Impact Dashboard',
  description: 'Explore development projects completed under the Executive Chairman of Katsina Local Government Area. Interactive map, ward heatmaps, and project certificates.',
  keywords: 'Katsina LGA, government projects, Nigeria, local government, development',
  openGraph: {
    title: 'Katsina LGA Project Impact Dashboard',
    description: 'Interactive civic accountability platform for Katsina Local Government Area.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable}`}>
      <body className="font-sans bg-navy text-white antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
