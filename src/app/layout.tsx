import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IslamInvest IQ | Shariah-Compliant AI Investment Platform",
  description: "The future of ethical wealth management. Analyze stocks, cryptos, ETFs, and startups using advanced Shariah compliance screening and AI advisors.",
  metadataBase: new URL("https://islaminvest.iq"),
  openGraph: {
    title: "IslamInvest IQ | Shariah-Compliant AI Investment Platform",
    description: "The future of ethical wealth management. Analyze stocks, cryptos, ETFs, and startups using advanced Shariah compliance screening and AI advisors.",
    images: [{ url: "/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#0CCB8E]/30 selection:text-white">{children}</body>
    </html>
  );
}
