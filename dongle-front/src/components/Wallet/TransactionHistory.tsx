// components/Wallet/TransactionHistory.tsx
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { Transaction } from "@/modules/_types";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const formatAmount = (amount: string): string => {
    const ethAmount = parseFloat(amount) / 1e18;
    return ethAmount.toFixed(4);
  };

  const getTransactionIcon = (type: string, direction: string) => {
    if (type === "Receive" || direction === "In") {
      return <FiArrowDownLeft className="text-green-500 text-xl" />;
    }
    return <FiArrowUpRight className="text-purple-500 text-xl" />;
  };

  const getTokenSymbol = (tokenAddress: string): string => {
    return tokenAddress.toLowerCase() ===
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ? "ETH"
      : "ERC20";
  };

  const getTransactionLabel = (tx: Transaction) => {
    const { type, tokenActions } = tx.details;

    // Handle Contract Interaction
    if (type === "Unknown") {
      return "Contract Interaction";
    }

    // Handle Swap case (two different transfers)
    if (
      tokenActions.length === 2 &&
      tokenActions[0].direction !== tokenActions[1].direction
    ) {
      return "Swap";
    }

    // For other cases, just return the type
    return type;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction History
        </h2>
      </div>

      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {!transactions?.length ? (
          <div className="p-4 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx.details.type, tx.direction)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {getTransactionLabel(tx)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(tx.timeMs, { addSuffix: true })}
                    </div>
                    <a
                      href={`https://basescan.org/tx/${tx.details.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      View on Explorer
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  {tx.details.tokenActions.map((action, index) => (
                    <div key={index}>
                      <div
                        className={`font-medium ${
                          action.direction === "In"
                            ? "text-green-600"
                            : "text-purple-600"
                        }`}
                      >
                        {action.direction === "In" ? "+" : "-"}
                        {formatAmount(action.amount)}{" "}
                        {getTokenSymbol(action.address)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.details.status}
                      </div>
                    </div>
                  ))}
                  {tx.details.tokenActions.length === 0 && (
                    <div className="text-xs text-gray-500">
                      {tx.details.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
