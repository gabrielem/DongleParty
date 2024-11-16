// components/Wallet/WalletBalance.tsx
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  icon?: string;
}

const WalletBalance = () => {
  const [hideBalances, setHideBalances] = useState(false);

  // Temporary mock data
  const tokens: Token[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 1.234,
      value: 2345.67,
      icon: "⟠",
    },
    { symbol: "USDT", name: "Tether", balance: 500.0, value: 500.0, icon: "₮" },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: 750.5,
      value: 750.5,
      icon: "$",
    },
  ];

  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Balances</h2>
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {hideBalances ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>
        <div className="text-2xl font-bold text-purple-600">
          {hideBalances ? "****" : `$${totalValue.toFixed(2)}`}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  {token.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {hideBalances ? "****" : `${token.balance} ${token.symbol}`}
                </div>
                <div className="text-sm text-gray-500">
                  {hideBalances ? "****" : `$${token.value.toFixed(2)}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletBalance;
