import { useState } from "react";
import ModalContent from "./UI/ModalContent";
import ChallengeCardInfo from "./ChallengeCardInfo";
import { ChallengeCardData, ChallengeDetail } from "@/modules/_types";

interface ChallengeCardProps {
  challenge: ChallengeCardData;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [joinShow, setJoinShow] = useState<boolean>(false);

  function calculateCompletionPercentage(
    maxParticipants: number,
    currentParticipants: number
  ): number {
    if (maxParticipants === 0) {
      return 0;
    }
    return Math.floor((currentParticipants / maxParticipants) * 100);
  }

  const maxParticipant = challenge?.maxParticipant || 0;
  const actualParticipant = challenge?.participants?.length || 0;
  const actualPerc = calculateCompletionPercentage(
    maxParticipant,
    actualParticipant
  );

  // Transform challenge data to match ChallengeDetail interface
  const challengeDetail: ChallengeDetail = {
    id: challenge.id,
    name: challenge.name,
    prize: 0, // Add prize if available in your data
    startAmount: challenge.startAmount,
    targetAmount: challenge.targetAmount,
    participants: challenge.participants || [], // Provide empty array as fallback
    hasJoined: false, // Add logic to determine if user has joined
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setJoinShow(true);
  };

  return (
    <>
      <ModalContent handleShow={{ show, setShow }}>
        <ChallengeCardInfo challenge={challengeDetail} />
      </ModalContent>

      <ModalContent handleShow={{ show: joinShow, setShow: setJoinShow }}>
        <div className="bg-white p-1 text-black rounded-md shadow-sm">
          <div className="p-3 text-center">
            <div className="text-gray-500 text-sm text-center">Challenge:</div>
            <b className="text-2xl text-purple-600 text-center">
              {challenge?.name}
            </b>
          </div>

          <button
            onClick={() => {}}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Create Wallet
          </button>
          <div className="p-3 text-lg text-center">& Join the Challenge!</div>
        </div>
      </ModalContent>

      <div
        className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShow(true)}
      >
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-gray-600">${challenge.startAmount}</span>
            <span className="mx-2">→</span>
            <span className="text-gray-600">${challenge.targetAmount}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Challenge {challenge?.name}</span>
            <span>{actualPerc}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${actualPerc}%` }}
            />
          </div>
          <div className="flex justify-between w-full">
            <div className="text-sm font-medium text-purple-600">Active!</div>
            {/* <button
              className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              onClick={handleJoinClick}
            >
              Join
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallengeCard;
