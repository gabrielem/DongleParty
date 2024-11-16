'use client'

import { useEffect, useState } from "react"

const Button: React.FC<any> = ({
  loading, 
  children,
  IconStart, 
  IconEnd, 
  className = ' bg-green-600 text-white hover:bg-green-700 w-full p-2 rounded-md', 
  onClick,
  ...props 
}) => {

  const [localClassName, setLocalClassName] = useState<string>(className || 'btn btn-primary')
  
  useEffect(() => {
    const incomingClassName = className || 'btn btn-primary'
    const newClass = loading 
      ? incomingClassName + 'btn-loading disabled' 
      : '' + incomingClassName
    
    setLocalClassName(newClass)
  }, [loading])

  return (
    <button 
      // disabled={ loading || false} 
      onClick={loading ? ()=>{} : onClick}
      {...props}
      className={localClassName}
    >
      <div className="inline-flex items-center gap-2">
        {IconStart && !loading && IconStart}
        {loading && (
          <span className="loading loading-spinner w-4 h-4" />
        )}
        {children}
        {IconEnd && !loading && IconEnd}
      </div>
    </button>
  )
}

export default Button

