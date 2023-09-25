import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Providers from "./dashboard/provider";
import { ContextProvider } from "@/contexts/Context";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-dmSans",
});

export const metadata: Metadata = {
  title: "Organiza",
  description: "Organiza Application control Finances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans`}>
        <ContextProvider>
          <Providers>{children}</Providers>
        </ContextProvider>
      </body>
    </html>
  );
}
