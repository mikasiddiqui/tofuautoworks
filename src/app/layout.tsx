import type { Metadata } from "next";
import "./globals.css";
import { pixel } from "./fonts"; 

export const metadata: Metadata = {
  title: "Tofu Auto Works",
  description: "Custom car kits and builds from Japan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${pixel.variable}`}>
      <body className="font-pixel">{children}</body>
    </html>
  );
}
