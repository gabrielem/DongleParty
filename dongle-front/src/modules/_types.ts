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

interface TokenAction {
  chainId: string;
  address: string;
  standard: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  direction: "In" | "Out" | "On";
}

interface TransactionDetails {
  txHash: string;
  chainId: number;
  blockNumber: number;
  blockTimeSec: number;
  status: "completed" | "pending" | "failed";
  type: string;
  tokenActions: TokenAction[];
  fromAddress: string;
  toAddress: string;
  orderInBlock: number;
  nonce: number;
  feeInWei: string;
}

interface Transaction {
  timeMs: number;
  address: string;
  type: number;
  rating: string;
  direction: "in" | "out";
  details: TransactionDetails;
  id: string;
  eventOrderInTransaction: number;
}

interface TokenBalance {
  address: string;
  balance: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  providers: string[];
  logoURI?: string;
  eip2612: boolean;
  tags: string[];
  rating: number;
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
  Transaction,
  TransactionDetails,
  TokenAction,
  TokenBalance,
};
