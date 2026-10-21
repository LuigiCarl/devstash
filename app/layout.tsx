import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DevStash", template: "%s · DevStash" },
  description: "Your developer resources, organized in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"><body><ThemeProvider>{children}<Toaster richColors position="bottom-right" /></ThemeProvider></body></html>;
}
