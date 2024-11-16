// app/page.tsx
'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import CreateChallengeButton from '@/components/CreateChallengeButton'
import ChallengeList from '@/components/ChallengeList'
import Footer from '@/components/Footer'
import CreateChallengeModal from '@/components/CreateChallengeModal'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <CreateChallengeButton onClick={() => setIsModalOpen(true)} />
        <div className="my-6 border-t border-gray-300" />
        <ChallengeList />
      </main>
      <Footer />
      <CreateChallengeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}