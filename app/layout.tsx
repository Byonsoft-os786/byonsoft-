import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byonsoft Academy | Premium Learning",
  description: "Learn and Earn with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
