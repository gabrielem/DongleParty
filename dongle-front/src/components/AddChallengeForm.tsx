'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Button from "@/components/UI/Button"
import { useAuth } from '@/context/AuthContext'
import api from '@/helpers/api'
import { toast } from 'react-toastify'
import { Challenge } from '@/modules/_types'

interface AddChallengeFormProps {
  successCb?: (challenge: Challenge) => void;
}

interface ChallengeFormState {
  name: string;
  startAmount: number;
  targetAmount: number;
  maxParticipant: number;
}

const initialChallengeState: ChallengeFormState = {
  name: '',
  startAmount: 0,
  targetAmount: 0,
  maxParticipant: 1
}

const AddChallengeForm = ({ successCb }: AddChallengeFormProps) => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [challenge, setChallenge] = useState<ChallengeFormState>(initialChallengeState)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setChallenge(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validation
      if (!challenge.name.trim()) {
        throw new Error('The name is required.')
      }
      if (challenge.startAmount <= 0) {
        throw new Error("The initial amount must be greater than 0.")
      }
      if (challenge.targetAmount <= challenge.startAmount) {
        throw new Error("The goal must be greater than the initial amount.")
      }
      if (challenge.maxParticipant < 1) {
        throw new Error('The maximum number of participants must be at least 1.')
      }

      const result = await api.setChallenge(challenge, token)
      if(successCb) successCb(result)

      // Reset form to initial state
      setChallenge(initialChallengeState)
      toast.success('Challenge successfully created!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating challenge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Add a new Challenge</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Challenge Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={challenge.name}
            onChange={handleChange}
            className="input input-bordered w-full p-2 border-gray-300 border rounded-md"
            placeholder="Challenge Name"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Starting Amount</span>
          </label>
          <input
            type="number"
            name="startAmount"
            value={challenge.startAmount}
            onChange={handleChange}
            className="input input-bordered w-full p-2 border-gray-300 border rounded-md"
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Target Amount</span>
          </label>
          <input
            type="number"
            name="targetAmount"
            value={challenge.targetAmount}
            onChange={handleChange}
            className="input input-bordered w-full p-2 border-gray-300 border rounded-md"
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Maximum Number of Participants</span>
          </label>
          <input
            type="number"
            name="maxParticipant"
            value={challenge.maxParticipant}
            onChange={handleChange}
            className="input input-bordered w-full p-2 border-gray-300 border rounded-md"
            min="1"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="bg-green-600 text-white hover:bg-green-700 w-full p-2 rounded-md"
        >
          Create Challenge!
        </Button>
      </form>
    </div>
  )
}

export default AddChallengeForm
