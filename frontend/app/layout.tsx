import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Smart Seed Availability & Stock Management System | NIXTION TN Seeds',
  description: 'Find the right hybrid seed near you, check real-time stock availability, and connect directly with seed sellers across Tamil Nadu.',
  keywords: 'hybrid seeds, paddy seeds, maize hybrid, seed availability, seed ERP, TN agriculture, NIXTION',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-slate-50">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
