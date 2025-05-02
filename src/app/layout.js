import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bygglovsagenten',
  description: 'AI-driven bygglovsrådgivning för privatpersoner och småhusägare i Sverige',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
