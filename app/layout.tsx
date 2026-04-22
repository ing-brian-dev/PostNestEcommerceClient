import type { Metadata } from "next";
import { Outfit} from "next/font/google";
import "./globals.css";

const outfi = Outfit({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Post - Next.js",
  description: "Post - Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfi.className} bg-gray-200`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
