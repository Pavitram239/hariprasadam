import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { EnquiryProvider } from '@/components/EnquiryContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import FloatingCTA from '@/components/FloatingCTA';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HariPrasadam | Premium Dry Fruits, Flavoured Nuts & Luxury Gifting',
    template: '%s | HariPrasadam Pvt. Ltd.',
  },
  description:
    'HariPrasadam Pvt. Ltd. (Surat, Gujarat) offers premium roasted California almonds, creamy cashews, chocolate dates, sundried raisins, hazelnuts, and curated 2026 corporate and festive gifting collections.',
  keywords: [
    'Premium Dry Fruits',
    'Flavoured Nuts',
    'Dry Fruit Gifting',
    'Corporate Gifting',
    'Premium Gifting Surat',
    'Dry Fruits Surat',
    'Corporate Dry Fruit Gifting',
    'HariPrasadam',
    'Festive Dry Fruit Box',
    'Honey Rose Almond',
    'Lotus Biscoff Cashew',
    'Kunafa Dates',
  ],
  authors: [{ name: 'HariPrasadam Pvt. Ltd.' }],
  creator: 'HariPrasadam Pvt. Ltd.',
  publisher: 'HariPrasadam Pvt. Ltd.',
  metadataBase: new URL('https://www.hariprasadam.com'),
  openGraph: {
    title: 'HariPrasadam | Premium Dry Fruits & Luxury Gifting',
    description:
      'Pure Fruit. Pure Health. Explore our complete collection of 27 artisanal flavours, signature combos, and bespoke corporate gift hampers.',
    url: 'https://www.hariprasadam.com',
    siteName: 'HariPrasadam',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/gifting/gifting-spread.jpg',
        width: 1200,
        height: 630,
        alt: 'HariPrasadam Premium Gifting Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HariPrasadam | Premium Dry Fruits & Luxury Gifting',
    description:
      'Artisanal dry fruits, signature flavoured nuts, and luxury gifting boxes from Surat, Gujarat.',
    images: ['/images/gifting/gifting-spread.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1412] font-sans">
        <EnquiryProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <EnquiryModal />
          <FloatingCTA />
        </EnquiryProvider>
      </body>
    </html>
  );
}
