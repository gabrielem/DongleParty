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
import { FiCopy } from 'react-icons/fi';

export default function WalletPage() {
  const { token, wallet } = useAuth()

  const [history, setHistory] = useState<any>()
  const [loadingHistory, setLoadingHistory] = useState(true)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
      toast.success('Address copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  useEffect(() => {
    const getHistory = async () => {
      setLoadingHistory(true)
      try {
        const result = await api.getHistory({wallet}, token)
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
        <div className="flex flex-col mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Wallet</h1>
          <div className="flex items-center mt-1 bg-white rounded-lg p-2 shadow-sm">
            <span className="text-sm text-gray-600 font-medium">
              {wallet}
            </span>
            <button
              onClick={handleCopyAddress}
              className="ml-2 p-1.5 text-gray-500 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
              aria-label="Copy wallet address"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <WalletBalance />
          <TransactionHistory transactions={history} />
        </div>
      </div>
      <Footer />
    </div>
  );
}