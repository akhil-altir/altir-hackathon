import type { Metadata } from "next"

import "./globals.css"

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
