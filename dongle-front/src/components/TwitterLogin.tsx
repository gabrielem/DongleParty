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
        <button className="rounded-md bg-sky-500 text-white p-1" onClick={handleClick}>
            <FaTwitter />Enter
        </button>
    </div>
  )
}

export default TwitterLogin