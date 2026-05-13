import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Smart Bus Transit | Executive Dashboard",
  description: "Advanced transit authority management dashboard",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex overflow-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Sidebar />
            <div className="flex-grow flex flex-col min-w-0 bg-surface h-screen overflow-hidden">
              <TopBar />
              <main className="flex-grow overflow-y-auto no-scrollbar pb-8">
                {children}
              </main>
            </div>
            <Toaster position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
