// ChallengesList
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/helpers/api'

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

const ChallengesList = () => {
  const { token } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await api.getChallenges(token)
        setChallenges(data)
      } catch (err: any) {
        setError(err.message || 'Errore nel caricamento delle challenge')
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [token])

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center p-8">
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Your Challenges
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="card-body">
              <h3 className="card-title text-lg font-bold">
                {challenge.name}
              </h3>
              
              <div className="space-y-2 my-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Importo iniziale:</span>
                  <span className="font-semibold">€{challenge.startAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Obiettivo:</span>
                  <span className="font-semibold">€{challenge.targetAmount.toFixed(2)}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min(100, (challenge.startAmount / challenge.targetAmount) * 100)}%` 
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">Partecipanti max:</span>
                  <span className="badge badge-primary">{challenge.maxParticipant}</span>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">
                Details
                </button>
                <button className="btn btn-outline btn-sm">
                Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChallengesList