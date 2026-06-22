import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grade 8 Ministry & Model Exam Prep",
  description: "Dynamic exam prep engine with native MySQL database support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {/* Universal Top Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-black text-xl text-blue-600 tracking-tight flex items-center gap-2">
              🎓 Grade8Prep
            </Link>
            <nav className="flex items-center gap-4 text-sm font-semibold text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition">Student Panel</Link>
              <Link href="/admin" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-1.5 rounded-lg transition">Admin Portal</Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}