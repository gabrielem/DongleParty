// components/Footer.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHomeOutline, IoWalletOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function Footer(): JSX.Element {
  const { user, myChallenge } = useAuth();

  const pathname = usePathname();

  const getTabStyle = (path: string) => {
    return `flex flex-col items-center px-3 py-2 ${
      pathname === path
        ? "text-purple-600 border-t-2 border-purple-600"
        : "text-gray-500 hover:text-purple-400"
    } transition-colors duration-200`;
  };

  return (
    <footer className="bg-white border-t border-purple-100 fixed bottom-0 w-full shadow-lg">
      <nav className="flex justify-between items-center h-16 max-w-screen-xl mx-auto px-4">
        <Link href="/" className={getTabStyle("/")}>
          <IoHomeOutline className="text-xl mb-1" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <div className="w-px h-8 bg-purple-100" /> {/* Separator */}
        <Link
          href={myChallenge ? `/agent/${myChallenge}` : "#"}
          className={getTabStyle("/agent")}
          onClick={
            myChallenge
              ? () => {}
              : (e: any) => {
                  e.preventDefault();
                  toast.error("join a Challenge to Access the Agent!");
                }
          }
        >
          <RiRobot2Line className="text-xl mb-1" />
          <span className="text-xs font-medium">AI Agent</span>
        </Link>
        <div className="w-px h-8 bg-purple-100" /> {/* Separator */}
        {/* <Link href="/leaderboard" className={getTabStyle('/leaderboard')}>
          <MdLeaderboard className="text-xl mb-1" />
          <span className="text-xs font-medium">Leaderboard</span>
        </Link> */}
        <Link href="/wallet" className={getTabStyle("/wallet")}>
          <IoWalletOutline className="text-xl mb-1" />
          <span className="text-xs font-medium">Wallet</span>
        </Link>
      </nav>
    </footer>
  );
}
