import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Itinerary() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState('')
  const [itineraries, setItineraries] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    type: 'sightseeing',
    startTime: '',
    endTime: '',
    location: '',
    cost: '',
    notes: ''
  })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
        if (data.length > 0) {
          setSelectedTrip(data[0]._id)
          fetchItineraries(data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const fetchItineraries = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/itinerary/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setItineraries(data)
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error)
    }
  }

  const handleActivitySubmit = async (e) => {
    e.preventDefault()
    if (!selectedDate) return

    try {
      let itinerary = itineraries.find(i => 
        new Date(i.date).toDateString() === new Date(selectedDate).toDateString()
      )

      if (!itinerary) {
        // Create new itinerary for this date
        const response = await fetch(`${API_URL}/itinerary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            trip: selectedTrip,
            date: selectedDate,
            activities: [{
              ...activityForm,
              cost: parseFloat(activityForm.cost) || 0
            }]
          })
        })
        
        if (response.ok) {
          fetchItineraries(selectedTrip)
        }
      } else {
        // Update existing itinerary
        const updatedActivities = editingActivity !== null
          ? itinerary.activities.map((activity, index) => 
              index === editingActivity 
                ? { ...activityForm, cost: parseFloat(activityForm.cost) || 0 }
                : activity
            )
          : [...itinerary.activities, { ...activityForm, cost: parseFloat(activityForm.cost) || 0 }]

        const response = await fetch(`${API_URL}/itinerary/${itinerary._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            activities: updatedActivities
          })
        })
        
        if (response.ok) {
          fetchItineraries(selectedTrip)
        }
      }

      setShowActivityForm(false)
      setEditingActivity(null)
      setActivityForm({
        title: '',
        description: '',
        type: 'sightseeing',
        startTime: '',
        endTime: '',
        location: '',
        cost: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error saving activity:', error)
    }
  }

  const handleEditActivity = (itinerary, activityIndex) => {
    const activity = itinerary.activities[activityIndex]
    setActivityForm(activity)
    setSelectedDate(new Date(itinerary.date).toISOString().split('T')[0])
    setEditingActivity(activityIndex)
    setShowActivityForm(true)
  }

  const handleDeleteActivity = async (itinerary, activityIndex) => {
    try {
      const updatedActivities = itinerary.activities.filter((_, index) => index !== activityIndex)
      
      const response = await fetch(`${API_URL}/itinerary/${itinerary._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          activities: updatedActivities
        })
      })
      
      if (response.ok) {
        fetchItineraries(selectedTrip)
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      sightseeing: '🏛️',
      food: '🍽️',
      rest: '😴',
      transport: '🚗',
      other: '📝'
    }
    return icons[type] || '📝'
  }

  const groupedItineraries = itineraries.reduce((acc, itinerary) => {
    const date = new Date(itinerary.date).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(itinerary)
    return acc
  }, {})

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-blue-300 hover:text-blue-200 font-medium mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">📅 Itinerary Management</h1>
            <p className="text-white/80 mt-2">Plan your day-wise travel activities</p>
          </div>
          <button
            onClick={() => setShowActivityForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Add Activity
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <select
            value={selectedTrip}
            onChange={(e) => {
              setSelectedTrip(e.target.value)
              fetchItineraries(e.target.value)
            }}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          >
            {trips.map(trip => (
              <option key={trip._id} value={trip._id} className="bg-gray-800">
                {trip.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          />
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItineraries).map(([date, dayItineraries]) => (
            <div key={date} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                📅 {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              
              {dayItineraries.map((itinerary) => (
                <div key={itinerary._id} className="space-y-3">
                  {itinerary.activities.map((activity, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                        <div>
                          <h3 className="text-white font-bold">{activity.title}</h3>
                          <p className="text-white/80 text-sm">{activity.description}</p>
                          {activity.location && (
                            <p className="text-blue-300 text-sm">📍 {activity.location}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-sm text-white/60">
                            {activity.startTime && <span>🕐 {activity.startTime}</span>}
                            {activity.cost > 0 && <span>💰 ${activity.cost}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditActivity(itinerary, index)}
                          className="text-blue-300 hover:text-blue-200"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(itinerary, index)}
                          className="text-red-300 hover:text-red-200"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {showActivityForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingActivity !== null ? 'Edit Activity' : 'Add Activity'}
              </h2>
              <form onSubmit={handleActivitySubmit} className="space-y-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  required
                />

                <input
                  type="text"
                  placeholder="Activity Title"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({...activityForm, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  required
                />

                <select
                  value={activityForm.type}
                  onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option value="sightseeing">Sightseeing</option>
                  <option value="food">Food</option>
                  <option value="rest">Rest</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  placeholder="Description"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  rows="3"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={activityForm.location}
                  onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                />

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="time"
                    value={activityForm.startTime}
                    onChange={(e) => setActivityForm({...activityForm, startTime: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  />
                  <input
                    type="time"
                    value={activityForm.endTime}
                    onChange={(e) => setActivityForm({...activityForm, endTime: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  />
                  <input
                    type="number"
                    placeholder="Cost"
                    value={activityForm.cost}
                    onChange={(e) => setActivityForm({...activityForm, cost: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowActivityForm(false)
                      setEditingActivity(null)
                    }}
                    className="flex-1 px-6 py-3 border border-white/30 text-white rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium"
                  >
                    {editingActivity !== null ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}