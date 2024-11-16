import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiCopy } from "react-icons/fi";
import { IoMdInformationCircle } from "react-icons/io";
import Button from "@/components/UI/Button";
import { useAuth } from "@/context/AuthContext";

export default function DepositOnWallet() {
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
      <div className="flex h-14 px-4 justify-center items-center border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold">Deposit</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 p-4">
        {/* QR Code */}
        <div className="w-56 h-56 p-3 bg-white rounded-xl shadow-sm">
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

        {/* Warning message */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg text-purple-800 border border-purple-100">
          <IoMdInformationCircle className="text-xl flex-shrink-0" />
          <p className="text-sm">
            Please only send tokens on BASE and the amount specified for the challenge.
          </p>
        </div>
      </div>
    </div>
  );
}