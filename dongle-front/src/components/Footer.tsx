// components/Footer.jsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className="bg-white border-t fixed bottom-0 w-full">
      <nav className="flex justify-around items-center h-16">
        <Link 
          href="/"
          className={`flex flex-col items-center ${
            pathname === '/' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">Party</span>
        </Link>
        <Link 
          href="/agent"
          className={`flex flex-col items-center ${
            pathname === '/agent' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">Agent</span>
        </Link>
        <Link 
          href="/wallet"
          className={`flex flex-col items-center ${
            pathname === '/wallet' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">Wallet</span>
        </Link>
      </nav>
    </footer>
  )
}