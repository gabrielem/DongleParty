// TwitterLogin.tsx
'use client'

import Button from "@/components/UI/Button"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dongle Party
            </h1>
            <p className="text-gray-600">
              Join challenges and compete with other traders
            </p>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-gray-700 font-medium mb-4 text-center">
                Connect with your Twitter account to:
              </h2>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Participate in trading challenges
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Use AI-powered trading assistance
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Track your performance and rankings
                </li>
              </ul>
            </div>

            <button
              onClick={handleClick}
              className="w-full flex items-center justify-center gap-3 bg-[#1DA1F2] text-white py-4 rounded-xl hover:bg-[#1a8cd8] transition-colors font-medium text-lg group"
            >
              <FaTwitter className="text-2xl group-hover:scale-110 transition-transform" />
              Continue with Twitter
            </button>

            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Optional: Add some decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  )
}

export default TwitterLogin