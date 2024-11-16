// components/ChallengeList.jsx
export default function ChallengeList() {
  const challenges = [
    {
      id: 1,
      startAmount: 10,
      targetAmount: 100,
      currentValue: 45,
      completion: 45,
      status: 'active'
    }
    // Add more challenges as needed
  ]

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  )
}

function ChallengeCard({ challenge }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-gray-600">${challenge.startAmount}</span>
          <span className="mx-2">→</span>
          <span className="text-gray-600">${challenge.targetAmount}</span>
        </div>
        <span className="font-semibold">${challenge.currentValue}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Challenge #{challenge.id}</span>
          <span>{challenge.completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full" 
            style={{ width: `${challenge.completion}%` }}
          />
        </div>
        <div className="text-sm font-medium text-purple-600">
          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
        </div>
      </div>
    </div>
  )
}