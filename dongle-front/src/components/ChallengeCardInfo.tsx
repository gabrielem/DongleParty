import { ChallengeCardInfoProps } from "@/modules/_types";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const ChallengeCardInfo = ({ challenge }: ChallengeCardInfoProps) => {
  const { user, myChallenge } = useAuth();

  const getOrdinal = (position: number): string => {
    if (position > 3) return `${position}th`;
    const suffixes = ["th", "st", "nd", "rd"];
    return `${position}${suffixes[position]}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-center p-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          Challenge Detail
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {/* Challenge Info - More compact now */}
        <div className="space-y-3">
          {/* Challenge ID and Prize - Horizontal layout */}
          <div className="space-y-2">
            <div className="bg-white p-2 rounded-lg shadow-sm flex justify-between items-center">
              <span className="text-sm text-gray-600">Challenge:</span>
              <span className="text-2xl font-bold text-gray-900">
                {challenge.name}
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm flex justify-between items-center">
              <span className="text-sm text-gray-600">Prize Pool:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${challenge.prize}
              </span>
            </div>
          </div>

          {/* Amount Info */}
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Start Amount</div>
                <div className="text-sm text-purple-600 font-semibold">
                  ${challenge.startAmount}
                </div>
              </div>
              <div className="h-px w-16 bg-purple-200 mx-4" />
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Target Amount</div>
                <div className="text-sm text-purple-600 font-semibold">
                  ${challenge.targetAmount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table - Simplified to 2 columns */}
        <div
          className="bg-white rounded-lg shadow-sm overflow-hidden flex-1"
          style={{ minHeight: "calc(70vh - 250px)" }}
        >
          <div
            className="overflow-auto"
            style={{ height: "calc(70vh - 300px)" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2 text-sm font-medium text-gray-600 border-r border-gray-200">
                    Ranking
                  </th>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600">
                    Holdings
                  </th>
                </tr>
              </thead>
              {challenge.participants.length > 0 ? (
                <tbody className="divide-y divide-gray-200">
                  {challenge.participants.map((participant) => (
                    <tr
                      key={participant.twitterHandle}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-sm border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-purple-600 min-w-[24px]">
                            {getOrdinal(participant.balance)}
                          </span>
                          <span className="text-gray-600">
                            @{participant.twitterHandle}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right font-medium">
                        ${participant.holdings}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-6 text-sm text-gray-500 text-center"
                    >
                      No participants yet. Be the first to join!
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3 bg-white border-t border-gray-200">
        {myChallenge
          ? <>
            {myChallenge === challenge.id
              ? <Link
                href={`/agent/${challenge.id}`}
                className="block w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                Go to Agent AI
              </Link>
              : <>
                <div className="text-center text-black p-1">
                  You can join only one Challenge at a time!!
                </div>
              {/* <Link
                href={`/agent/${myChallenge}`}
                className="block w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                Go to My Agent
              </Link> */}
              </>
            }
          </>
          : <>
            {
              <Link
                href={`/agent/${challenge.id}`}
                className="block w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                {!challenge?.participants?.[user?.uid] ? (
                  "Join Challenge"
                ) : (
                  <>
                    {challenge?.participants?.[user?.uid]?.balance
                      ? "Go to Agent AI"
                      : "Go to Wallet"}
                  </>
                )}
              </Link>
            }  
          </>

        }
        
      </div>
    </div>
  );
};
export default ChallengeCardInfo;
