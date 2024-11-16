// TwitterLogin
'use client'

import Button from "@/components/UI/Button"
import { useAuth } from "@/context/AuthContext"
import { IFormLogin } from "@/modules/_types"
import { validateEmail } from "@/utils/utils"
import Image from "next/image"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FaTwitter } from "react-icons/fa"
import Header from "./Header"


const TwitterLogin = () => {
  const { signinTwitter } = useAuth()
  
  const handleClick = async () => {
    try {
      await signinTwitter()
    } catch (error) {
      console.log('error:', error);
    }  
  }
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-2">
          <button className="rounded-md bg-sky-500 text-white p-3 w-full text-lg" onClick={handleClick}>
            <FaTwitter className="inline" /> Enter
          </button>
        </div>
      </div>

    </div>
  )
}

export default TwitterLogin