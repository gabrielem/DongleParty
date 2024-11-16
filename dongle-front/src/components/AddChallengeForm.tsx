'use client'

import { useState } from 'react'
import Button from "@/components/UI/Button"
import { useAuth } from '@/context/AuthContext'
import api from '@/helpers/api'
import { toast } from 'react-toastify'

const AddChallengeForm = () => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [challenge, setChallenge] = useState({
    name: '',
    startAmount: 0,
    targetAmount: 0,
    maxParticipant: 1
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setChallenge(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Validazione
      if (!challenge.name.trim()) {
        throw ('The name is required.')
      }
      if (challenge.startAmount <= 0) {
        throw ("The initial amount must be greater than 0.")
      }
      if (challenge.targetAmount <= challenge.startAmount) {
        throw ("The goal must be greater than the initial amount.")
      }
      if (challenge.maxParticipant < 1) {
        throw ('The maximum number of participants must be at least 1.')
      }

      await api.setChallenge(challenge, token)
      setSuccess(true)
      setChallenge({
        name: '',
        startAmount: 0,
        targetAmount: 0,
        maxParticipant: 1
      })

      toast.success('Challenge successfuly created!')

    } catch (err: any) {
      setError(err.message || 'Error creating challenge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Add a new Challenge</h1>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <span>Challenge created!</span>
        </div>
      )}

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
          className=" bg-green-600 text-white hover:bg-green-700 w-full p-2 rounded-md"
        >
          Crea Challenge!
        </Button>
      </form>
    </div>
  );
}

export default AddChallengeForm