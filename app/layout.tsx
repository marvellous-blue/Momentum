import type { Metadata } from "next";
// import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import localFont from 'next/font/local';

const instrumentSerif = localFont({
  src: './fonts/InstrumentSerif-Regular.woff2', 
  variable: '--font-instrument-serif',
  display: 'swap',
});

// const instrumentSerif = Instrument_Serif({
//   variable: "--font-instrument",
//   subsets: ["latin"],
//   weight: "400",
// });

// const spaceGrotesk = Space_Grotesk({
//   variable: "--font-space",
//   subsets: ["latin"],
// });

const spaceGrotesk = localFont({
  src: './fonts/SpaceGrotesk-Variable.woff2',
  weight: '300 700',
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Momentum",
  description: "A simple way to get your day back on track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${spaceGrotesk.variable}`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}