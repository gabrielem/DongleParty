import { NextApiRequest } from "next";

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  databaseURL: string | undefined;
}

interface IFormLogin {
  email: string;
  password: string;
}

interface ModalContentProps {
  children: React.ReactNode;
  overlayClassName?: string;
  modalClassName?: string;
  handleShow?: any;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  originalUrl?: string;
  isAdmin?: boolean;
  ip?: string;
  authId?: string;
  uid?: string;
  userFirebase?: any;
  user: any;
  isDashboard?: boolean;
  isApi?: boolean;
  userData?: any;
  apiAuthKey?: any;
}

interface Challenge {
  id: string;
  name: string;
  startAmount: number;
  targetAmount: number;
  participants: ParticipantsMap;
  maxParticipants: number;
}
interface Participant {
  joinedAt: number;
  twitterHandler: string;
  uid: string;
  wallet_address: string;
  balance?: number; // Add if available
}

interface ParticipantsMap {
  [key: string]: Participant;
}

interface ChallengeDetail {
  id: string;
  name: string;
  prize: number;
  startAmount: number;
  targetAmount: number;
  participants: ParticipantsMap;
  hasJoined?: boolean;
}

interface ChallengeCardInfoProps {
  challenge: ChallengeDetail;
}

export type {
  FirebaseConfig,
  IFormLogin,
  ExtendedNextApiRequest,
  ModalContentProps,
  Challenge,
  Participant,
  ChallengeDetail,
  ChallengeCardInfoProps,
};
