import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter, Geist_Mono } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalSidebar } from "@/components/global-sidebar"
import { TopHeader } from "@/components/top-header"
import { GlobalDrawer } from "@/components/global-drawer"

import { Toaster } from "sonner"
import "./globals.css"

export const dynamic = "force-dynamic"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Momentum OS",
  description: "Financial operations dashboard for agency founders",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:border focus:border-border focus:shadow-lg">
              Skip to main content
            </a>
            <div className="flex h-screen">
              <GlobalSidebar />
              <div className="lg:ml-64 flex-1 flex flex-col overflow-hidden">
                <TopHeader />
                <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-zinc-50/40 dark:bg-background">
                  {children}
                </main>
              </div>
            </div>
            <Suspense><GlobalDrawer /></Suspense>

            <Toaster position="bottom-right" theme="system" />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
