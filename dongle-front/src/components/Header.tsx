import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { IoMdExit } from "react-icons/io";

// components/Header.tsx
export default function Header(): JSX.Element {
  const {user, logout} = useAuth()
  return (
    <header className="flex justify-between items-center w-full">
      <Image src="/dongle-logo.png" alt="Dongle Logo" width={200} height={61} />
      {user && (
        <div className="flex items-center space-x-4">
          <button className="btn text-white hover:bg-slate-900 p-1 ps-2 pe-2 rounded-lg text-3xl" onClick={logout}>
            <IoMdExit />
          </button>
        </div>
      )}
    </header>
  )
}