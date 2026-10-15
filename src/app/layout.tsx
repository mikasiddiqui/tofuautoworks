import type { Metadata } from "next";
import "./globals.css";
import { pixel } from "./fonts"; 

export const metadata: Metadata = {
  title: "Tofu Auto Works",
  description: "Custom car builds, workshop videos, and a little Super Famicom radio. Welcome to Tofu Auto Works.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${pixel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
