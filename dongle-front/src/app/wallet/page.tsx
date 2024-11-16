// app/wallet/page.tsx
'use client'
import { useState } from 'react';
import WalletBalance from '@/components/Wallet/WalletBalance';
import TransactionHistory from '@/components/Wallet/TransactionHistory';
import Header from '@/components/Header';
import Footer from "@/components/Footer";


export default function WalletPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Wallet</h1>
        <div className="space-y-4">
          <WalletBalance />
          <TransactionHistory />
        </div>
      </div>
      <Footer />
    </div>
  );
}
