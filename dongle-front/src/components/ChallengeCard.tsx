import { useState } from "react";
import ModalContent from "./UI/ModalContent";

const ChallengeCard = ({ challenge }: any) => {
  const [show, setShow] = useState<boolean>(false)
  const [joinShow, setJoinShow] = useState<boolean>(false)

    function calculateCompletionPercentage(maxParticipants: number, currentParticipants: number): number {
        if (maxParticipants === 0) {
          return 0; // Avoid division by zero
        }
        return Math.floor((currentParticipants / maxParticipants) * 100);
      }
      const maxParticipant = challenge?.maxParticipant || 0
      const actualParticipant = challenge?.participants?.length || 0
      const actualPerc = calculateCompletionPercentage(maxParticipant, actualParticipant)
      
    return (
      <>
      <ModalContent handleShow={{show, setShow}}>
        <div className="bg-white p-1 text-black rounded-md shadow-sm">
          Card.. INFO
        </div>
      </ModalContent>
      <ModalContent handleShow={{show: joinShow, setShow: setJoinShow}}>
        <div className="bg-white p-1 text-black rounded-md shadow-sm">
          <div className="p-3 text-center">
            <div className="text-gray-500 text-sm text-center">Challenge:</div>
            <b className=" text-2xl text-purple-600 text-center">{challenge?.name}</b>
            <div>
              
            </div>
          </div>

          <button
            onClick={() => {}}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Create Wallet
          </button>
          <div className="p-3 text-lg text-center">
            & Join the Challenge!
          </div>

        </div>
      </ModalContent>
      <div className="bg-white p-4 rounded-lg shadow-md" onClick={() => setShow(true)}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-gray-600">${challenge.startAmount}</span>
            <span className="mx-2">→</span>
            <span className="text-gray-600">${challenge.targetAmount}</span>
          </div>
          {/* <span className="font-semibold">${challenge.currentValue}</span> */}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Challenge {challenge?.name}</span>
            <span>{actualPerc}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${actualPerc}%` }}
            />
          </div>
          <div className="flex justify-between w-full">
            <div className="text-sm font-medium text-purple-600">
                Active!
                {/* {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)} */}
            </div>
            <button className="btn bg-purple-600 text-white rounded-md ps-1 pe-1" onClick={() => setShow(true)}>
              Join
            </button>
          </div>
        </div>
      </div>
      </>
    )
  }

  export default ChallengeCard;