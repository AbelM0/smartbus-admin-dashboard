import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Smart Bus Transit | Executive Dashboard",
  description: "Advanced transit authority management dashboard",
};

export default async function LocaleLayout({
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
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers>
        <Sidebar />
        <div className="flex-grow flex flex-col min-w-0 bg-surface h-screen overflow-hidden">
          <TopBar />
          <main className="flex-grow overflow-y-auto no-scrollbar pb-12 p-6">
            <div className="max-w-[1600px] mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>

        <Toaster position="top-right" />
      </Providers>
    </NextIntlClientProvider>
  );
}

