import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'cnpmweb',
  description: 'A missing ui for cnpmcore.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
