import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter, Geist_Mono } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalSidebar } from "@/components/global-sidebar"
import { TopHeader } from "@/components/top-header"
import { GlobalDrawer } from "@/components/global-drawer"
import { GlobalDrawers } from "@/components/drawers/global-drawers"
import "./globals.css"

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
            <div className="flex h-screen">
              <GlobalSidebar />
              <div className="ml-64 flex-1 flex flex-col overflow-hidden">
                <TopHeader />
                <main className="flex-1 overflow-y-auto p-8 bg-zinc-50/40 dark:bg-black">
                  {children}
                </main>
              </div>
            </div>
            <Suspense><GlobalDrawer /></Suspense>
            <Suspense fallback={null}><GlobalDrawers /></Suspense>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
