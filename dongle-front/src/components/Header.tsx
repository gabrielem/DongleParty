import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

// components/Header.tsx
export default function Header(): JSX.Element {
  const {user, logout} = useAuth()
  return (
    <header className="flex justify-between items-center w-full">
      <Image src="/dongle-logo.png" alt="Dongle Logo" width={200} height={61} />
      {user && (
        <div className="flex items-center space-x-4">
          <button className="btn bg-slate-600 text-white hover:bg-slate-900 border-4 border-slate-400 p-1 ps-2 pe-2 rounded-lg" onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  )
}