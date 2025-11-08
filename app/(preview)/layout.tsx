import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://cursor-gen-ui.vercel.app'),
  title: "Generative UI",
  description: "Ask questions & generate UI to display the answers",
  keywords: ["generative ui", "cursor", "ai", "ui generation", "data visualization"],
  authors: [{ name: "Cursor" }],
  creator: "Cursor",
  openGraph: {
    title: "Generative UI",
    description: "Ask questions & generate UI to display the answers",
    type: "website",
    locale: "en_US",
    siteName: "Generative UI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generative UI",
    description: "Ask questions & generate UI to display the answers",
    creator: "@cursor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
