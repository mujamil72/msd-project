"use client"

import { useEffect } from "react"
import { useNotification } from "../context/NotificationContext"

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function Notification({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, notification.duration || 5000)
    return () => clearTimeout(timer)
  }, [notification.duration, onClose])

  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  }

  return (
    <div
      className={`${typeClasses[notification.type] || typeClasses.info} px-6 py-4 rounded-lg shadow-lg flex justify-between items-center animate-slide-in`}
    >
      <span className="font-medium">{notification.message}</span>
      <button onClick={onClose} className="ml-4 opacity-75 hover:opacity-100 transition">
        ✕
      </button>
    </div>
  )
}
