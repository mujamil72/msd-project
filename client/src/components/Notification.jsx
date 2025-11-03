"use client"

import { useState, useEffect } from "react"

export default function Notification({ message, type = "info", duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor =
    {
      success: "bg-green-100 border-green-400 text-green-700",
      error: "bg-red-100 border-red-400 text-red-700",
      warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
      info: "bg-blue-100 border-blue-400 text-blue-700",
    }[type] || "bg-blue-100 border-blue-400 text-blue-700"

  const icon =
    {
      success: "✓",
      error: "✕",
      warning: "!",
      info: "ℹ",
    }[type] || "ℹ"

  return (
    <div className={`fixed top-4 right-4 border-l-4 px-4 py-3 rounded shadow-lg ${bgColor} max-w-md`}>
      <div className="flex items-center">
        <span className="font-bold text-lg mr-3">{icon}</span>
        <p>{message}</p>
      </div>
    </div>
  )
}
