// components/Wallet/TransactionHistory.tsx
interface Transaction {
  id: string;
  type: "send" | "receive" | "swap";
  amount: number;
  token: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  from?: string;
  to?: string;
}

const TransactionHistory = ({history}: any) => {
  // Temporary mock data
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "send",
      amount: 0.5,
      token: "ETH",
      timestamp: new Date(),
      status: "completed",
      to: "0x1234...5678",
    },
    {
      id: "2",
      type: "receive",
      amount: 1000,
      token: "USDT",
      timestamp: new Date(Date.now() - 86400000),
      status: "completed",
      from: "0x8765...4321",
    },
    {
      id: "3",
      type: "swap",
      amount: 100,
      token: "USDC",
      timestamp: new Date(Date.now() - 172800000),
      status: "pending",
      from: "ETH",
      to: "USDC",
    },
  ];

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction History
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {tx.type === "swap"
                    ? `Swap ${tx.from} to ${tx.token}`
                    : `${tx.type} ${tx.token}`}
                </div>
                <div className="text-sm text-gray-500">
                  {tx.timestamp.toLocaleDateString()}{" "}
                  {tx.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {tx.type === "send" ? "-" : "+"}
                  {tx.amount} {tx.token}
                </div>
                <div
                  className={`text-sm ${getStatusColor(tx.status)} capitalize`}
                >
                  {tx.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
