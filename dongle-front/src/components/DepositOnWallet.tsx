import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiCopy } from "react-icons/fi";
import { IoMdInformationCircle } from "react-icons/io";
import Button from "@/components/UI/Button";
import { useAuth } from "@/context/AuthContext";
import { Challenge } from "@/modules/_types";

interface DepositOnWalletProps {
  challenge: Challenge;
  myPartecipation: {
    balance?: number;
    // Add other participation properties if needed
  };
}

export default function DepositOnWallet({ challenge, myPartecipation }: DepositOnWalletProps) {
  const { wallet } = useAuth();
  const [qrCodeValue, setQrCodeValue] = useState<string>("");

  useEffect(() => {
    setQrCodeValue(wallet);
  }, [wallet]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeValue);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex flex-col h-20 px-4 justify-center items-center border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold">Deposit</h1>
        <p className="text-purple-600 font-medium mt-1">
          {challenge.startAmount} ETH
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 p-4">
        {/* QR Code */}
        <div className="w-48 h-48 p-3 bg-white rounded-xl shadow-sm">
          <QRCodeSVG
            value={qrCodeValue}
            bgColor="#FFFFFF"
            fgColor="#111111"
            size={170}
            className="w-full h-full"
          />
        </div>

        {/* Address with Copy Button */}
        <div className="w-full bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-gray-600 font-medium truncate">
              {qrCodeValue}
            </div>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              aria-label="Copy address"
            >
              <FiCopy className="text-xl" />
            </button>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="w-full bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">Challenge Details:</p>
            <p>Name: <span className="text-purple-600">{challenge.name}</span></p>
            <p>Required Deposit: <span className="text-purple-600">{challenge.startAmount} ETH</span></p>
            <p>Target Amount: <span className="text-purple-600">{challenge.targetAmount} ETH</span></p>
          </div>
        </div>

        {/* Warning message */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg text-purple-800 border border-purple-100">
          <IoMdInformationCircle className="text-xl flex-shrink-0" />
          <p className="text-sm">
            Please only send {challenge.startAmount} ETH tokens on BASE network.
          </p>
        </div>
      </div>
    </div>
  );
}