import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sengonnmai · செங்கொன்னமை",
  description: "Tamil Nadu government departments explained in plain language. Every claim sourced. No opinion. Your right to know.",
  keywords: "Tamil Nadu, government, budget, departments, transparency, public accounts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
