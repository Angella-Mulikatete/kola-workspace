import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Kola Workspace - AI-Powered Freelance Command Center",
  description: "Automate gig discovery, project scoping, proposals, and earnings forecasting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <ConvexClientProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
