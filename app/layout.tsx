export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"

import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Altir Tech Day Command Center",
  description: "Internal hackathon command center for Altir Tech Day.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
