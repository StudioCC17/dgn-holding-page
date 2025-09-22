import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DGN Holding Page",
  description: "DGN Studio Holding Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-['ABC_Arizona_Mix']">
        {children}
      </body>
    </html>
  );
}