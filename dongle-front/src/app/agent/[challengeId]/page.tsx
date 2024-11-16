'use client'
import AgentChat from "@/components/AgentChat"
import DepositOnWallet from "@/components/DepositOnWallet"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Loading from "@/components/UI/Loading"
// components/AgentPage.tsx

import { useAuth } from "@/context/AuthContext"
import api from "@/helpers/api"
import { use, useEffect, useState } from "react"
import { toast } from "react-toastify"


export default function AgentPage({params}: any): JSX.Element {
  const { token, user, getWallet } = useAuth()
  const { challengeId } = use(params) as any;

  console.log('🍎🍎🍎 AgentPage - params', {params, challengeId});
  
  const [challenge, setChallenge] = useState<any>(null)

    useEffect(() => {
      const joinChallenge = async () => {
        console.log('🍎🍎🍎 joinChallenge', {challengeId});
        
        try {
          const result = await api.joinChallenge({challengeId: challengeId}, token)
          // getUser()
          setChallenge(result)

        } catch (error: any) {
          toast.error(typeof error === "string" ? error : error.message || 'Error joining challenge')
        }
      }
      if(token) joinChallenge()
    }, [token])

    useEffect(() => {
      getWallet()
    }, [challenge])

    console.log('🔑🔑🔑 AgentPage - params - token', {params, token});
    
    const myPartecipation = challenge?.participants?.[user?.uid]
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        {myPartecipation 
          ? (<div className="w-full h-full flex-1">
            {myPartecipation?.balance
              ? <AgentChat challengeId={challengeId} challenge={challenge} myPartecipation={myPartecipation} />
              : <DepositOnWallet challenge={challenge} myPartecipation={myPartecipation} />
            }
          </div>) 
          : <div><Loading /></div>
        }
        <Footer />
      </div>
    )
  }