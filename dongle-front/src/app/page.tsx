// app/page.tsx
'use client'
<<<<<<< HEAD
import AddChallengeForm from "@/components/AddChallengeForm";
import { useAuth } from "@/context/AuthContext";
=======
import { useState } from 'react'
import Header from '@/components/Header'
import CreateChallengeButton from '@/components/CreateChallengeButton'
import ChallengeList from '@/components/ChallengeList'
import Footer from '@/components/Footer'
import CreateChallengeModal from '@/components/CreateChallengeModal'
>>>>>>> 5537810b4034aea663c3e7df95b4680a7cd73e16

export default function Home() {
  const { user, logout } = useAuth()
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
<<<<<<< HEAD
        <button onClick={logout}>Logout</button>

        <AddChallengeForm />

=======
        main
      <button onClick={logout}>Logout</button>
>>>>>>> 5537810b4034aea663c3e7df95b4680a7cd73e16
      </main>
      <Footer />
      <CreateChallengeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}