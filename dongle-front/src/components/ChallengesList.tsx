// ChallengesList
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/helpers/api'
import ChallengeCard from './ChallengeCard'
import { toast } from 'react-toastify'

// Definizione dei tipi
interface Challenge {
  id: string
  name: string
  startAmount: number
  targetAmount: number
  maxParticipant: number
  // aggiungi altri campi se necessario
}

const Loading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
)

const ChallengesList = ({refresh}: any) => {
  const { token } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(false)
      try {
        const data = await api.getChallenges(token)
        setChallenges(data)
      } catch (err: any) {
        toast.error(typeof err === "string" ? err : err.message || 'Error fetching challenges')
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [token, refresh])

  if (loading) return <Loading />


  if (!challenges || Object.keys(challenges).length === 0) {
    return (
      <div className="text-center p-2 mt-4">
        <div className="bg-base-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-lg mb-2">No Challenge found.</h3>
          <p className="text-gray-600">
          There are no active challenges at the moment. Create a new one to get started!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(challenges).map((key: any) => {
            const challenge = challenges[key]
            return (
                <ChallengeCard key={key} challenge={{...challenge, id: key}} />
            )
        })}
      </div>
    </div>
  )
}

export default ChallengesList