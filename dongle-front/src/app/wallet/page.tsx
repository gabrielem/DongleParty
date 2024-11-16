// app/wallet/page.tsx
'use client'
import { useEffect, useState } from 'react';
import WalletBalance from '@/components/Wallet/WalletBalance';
import TransactionHistory from '@/components/Wallet/TransactionHistory';
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import { useAuth } from '@/context/AuthContext';
import api from '@/helpers/api';
import { toast } from 'react-toastify';


export default function WalletPage() {
  const { token, wallet } = useAuth()

  const [history, setHistory] = useState<any>()
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const getHistory = async () => {
      setLoadingHistory(true)
      try {
        const result = await api.getHistory({wallet}, token)
        console.log('--> getHistory', { result });
        setHistory(result?.items)
        
      } catch (error: any) {
        toast.error(typeof error === "string" ? error : error.message || 'Error getting history')
      } finally {
        setLoadingHistory(false)
      }
    }
    getHistory()
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Wallet</h1>
        <div className="space-y-4">
          <WalletBalance />
          <TransactionHistory transactions={history} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
