import { useRouter } from 'next/navigation';
import { ChallengeCardInfoProps } from '@/modules/_types';
import Button from '@/components/UI/Button';
import { useState } from 'react';

const ChallengeCardInfo = ({ challenge }: ChallengeCardInfoProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      // API call to join challenge
      // await api.joinChallenge(challenge.id);
    } catch (error) {
      console.error('Error joining challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    router.push(`/agent?challenge=${challenge.id}`);
  };

  const getOrdinal = (position: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = position <= 3 ? suffixes[position] : suffixes[0];
    return `${position}${suffix}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">Challenge Detail</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Challenge Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <span className="text-gray-600">Challenge #{challenge.id}</span>
            <span className="text-purple-600 font-semibold">
              Prize: ${challenge.prize}
            </span>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{challenge.name}</h3>
            
            {/* Amount Info */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Start Amount</div>
                <div className="text-purple-600 font-semibold">${challenge.startAmount}</div>
              </div>
              <div className="h-px w-16 bg-purple-200 mx-4" />
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Target Amount</div>
                <div className="text-purple-600 font-semibold">${challenge.targetAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
            <h4 className="text-sm font-semibold text-gray-900">Participants Ranking</h4>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Twitter
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  Holdings
                </th>
              </tr>
            </thead>
            {challenge.participants.length > 0 ? (
              <tbody className="divide-y divide-gray-100">
                {challenge.participants.map((participant) => (
                  <tr key={participant.twitterHandle} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <span className="font-medium text-purple-600">
                        {getOrdinal(participant.position)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-600">
                      @{participant.twitterHandle}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      ${participant.holdings}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-sm text-gray-500 text-center">
                    No participants yet. Be the first to join!
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        {!challenge.hasJoined ? (
          <Button
            onClick={handleJoin}
            loading={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Join Challenge
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Setup Trading Bot
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChallengeCardInfo;