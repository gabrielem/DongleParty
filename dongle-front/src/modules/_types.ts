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
  name: string;
  startAmount: number;
  targetAmount: number;
  maxParticipant: number;
  status?: string;
  completion?: number;
}

interface Participant {
  twitterHandle: string;
  balance: number;
  holdings?: number;
}

interface ChallengeDetail {
  id: number;
  name: string;
  prize: number;
  startAmount: number;
  targetAmount: number;
  participants: Participant[];
  hasJoined?: boolean;
}
interface ChallengeCardData extends Challenge {
  id: number;
  participants?: Participant[];
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
  ChallengeCardData,
  ChallengeCardInfoProps,
};
