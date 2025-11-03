import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Notifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.map(n => ({
          ...n,
          id: n._id,
          read: n.isRead,
          time: new Date(n.createdAt).toLocaleString()
        })))
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || 
    (filter === 'unread' && !n.read) || 
    (filter === 'read' && n.read)
  )

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      case 'success': return '✅'
      case 'reminder': return '⏰'
      default: return '📢'
    }
  }

  const getColor = (type) => {
    switch(type) {
      case 'warning': return 'border-orange-400 bg-orange-500/10'
      case 'info': return 'border-blue-400 bg-blue-500/10'
      case 'success': return 'border-green-400 bg-green-500/10'
      case 'reminder': return 'border-purple-400 bg-purple-500/10'
      default: return 'border-gray-400 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-blue-300 hover:text-blue-200 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">🔔 Notifications</h1>
          <p className="text-white/80 mt-2">Stay updated with your travel activities</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex gap-4">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'unread' && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-l-4 ${getColor(notification.type)} border border-white/20 transition-all duration-300 hover:bg-white/15 ${
                !notification.read ? 'ring-2 ring-blue-400/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold">{notification.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">{notification.time}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-white/80">{notification.message}</p>
                  <div className="flex gap-2 mt-4">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-300 hover:text-blue-200 text-sm font-medium"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button className="text-red-300 hover:text-red-200 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">No notifications</h2>
            <p className="text-white/70">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}