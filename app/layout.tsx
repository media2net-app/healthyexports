import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Healthy Exports - AI-gedreven distributeur zoeken',
  description: 'Vind en beheer distributeurs wereldwijd voor de health industrie met geautomatiseerde AI intelligentie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className="dark">
      <body>{children}</body>
    </html>
  )
}


