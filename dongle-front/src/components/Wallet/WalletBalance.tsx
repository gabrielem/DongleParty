// components/Wallet/WalletBalance.tsx
import { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import api from "@/helpers/api";
import { TokenBalance } from "@/modules/_types";
import { toast } from "react-toastify";
import { formatBalance } from "@/utils/utils";

const WalletBalance = () => {
  const { wallet } = useAuth();
  const [hideBalances, setHideBalances] = useState(false);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!wallet) return;

      try {
        const result = await api.getBalances({ address: wallet });
        // Filter out tokens with zero balance and sort by USD value
        const filteredBalances = result
          .filter((token: TokenBalance) => parseFloat(token.balance) > 0)
          .sort((a: TokenBalance, b: TokenBalance) => {
            const aValue =
              parseFloat(formatBalance(a.balance, a.decimals)) *
              parseFloat(a.price);
            const bValue =
              parseFloat(formatBalance(b.balance, b.decimals)) *
              parseFloat(b.price);
            return bValue - aValue;
          });
        setBalances(filteredBalances);
      } catch (error: any) {
        toast.error(
          typeof error === "string"
            ? error
            : error.message || "Error fetching balances"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [wallet]);

  // Calculate total value in USD with 2 decimal places
  const totalValue = balances
    .reduce((sum, token) => {
      const tokenBalance = parseFloat(
        formatBalance(token.balance, token.decimals)
      );
      const tokenPrice = parseFloat(token.price);
      return sum + tokenBalance * tokenPrice;
    }, 0)
    .toFixed(2);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          {hideBalances ? "****" : `$${totalValue}`}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {balances.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No tokens found</div>
        ) : (
          balances.map((token) => (
            <div
              key={token.address}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {token.logoURI ? (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      {token.symbol[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {token.name}
                    </div>
                    <div className="text-sm text-gray-500">{token.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {hideBalances
                      ? "****"
                      : `${formatBalance(token.balance, token.decimals)} ${
                          token.symbol
                        }`}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletBalance;
