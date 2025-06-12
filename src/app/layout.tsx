import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MessageProvider } from "./messageContext";
import { AuthProvider } from "./authContext";
import { LoadingProvider } from "./loaderContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedding Organizer JeWePe",
  description: "Wedding Organizer JeWePe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingProvider>
          <AuthProvider>
            <MessageProvider>{children}</MessageProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
