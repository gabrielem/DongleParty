'use client'

import { useState } from 'react'
import Button from "@/components/UI/Button"
import { useAuth } from '@/context/AuthContext'
import api from '@/helpers/api'

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
        throw new Error('Il nome è obbligatorio')
      }
      if (challenge.startAmount <= 0) {
        throw new Error("L'importo iniziale deve essere maggiore di 0")
      }
      if (challenge.targetAmount <= challenge.startAmount) {
        throw new Error("L'obiettivo deve essere maggiore dell'importo iniziale")
      }
      if (challenge.maxParticipant < 1) {
        throw new Error('Il numero massimo di partecipanti deve essere almeno 1')
      }

      await api.setChallenge(challenge, token)
      setSuccess(true)
      setChallenge({
        name: '',
        startAmount: 0,
        targetAmount: 0,
        maxParticipant: 1
      })
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Crea una nuova Challenge</h1>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <span>Challenge creata con successo!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Nome Challenge</span>
          </label>
          <input
            type="text"
            name="name"
            value={challenge.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Inserisci il nome della challenge"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Importo Iniziale</span>
          </label>
          <input
            type="number"
            name="startAmount"
            value={challenge.startAmount}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Obiettivo</span>
          </label>
          <input
            type="number"
            name="targetAmount"
            value={challenge.targetAmount}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Numero Massimo Partecipanti</span>
          </label>
          <input
            type="number"
            name="maxParticipant"
            value={challenge.maxParticipant}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="1"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="btn btn-primary w-full"
        >
          Crea Challenge
        </Button>
      </form>
    </div>
  );
}

export default AddChallengeForm