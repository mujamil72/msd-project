import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MapRoute() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState('')
  const [destinations, setDestinations] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)

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
          loadDestinations(data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const loadDestinations = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/transport/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const transports = await response.json()
        const dests = [...new Set([
          ...transports.map(t => t.from),
          ...transports.map(t => t.to)
        ])]
        setDestinations(dests)
      }
    } catch (error) {
      console.error('Error loading destinations:', error)
    }
  }

  const calculateRoute = () => {
    if (destinations.length >= 2) {
      setRouteInfo({
        distance: '1,250 km',
        duration: '14h 30m',
        stops: destinations.length
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-blue-300 hover:text-blue-200 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">🗺️ Map & Route Management</h1>
          <p className="text-white/80 mt-2">Plan your travel routes and view destinations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Trip Selection</h2>
            <select
              value={selectedTrip}
              onChange={(e) => {
                setSelectedTrip(e.target.value)
                loadDestinations(e.target.value)
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white mb-4"
            >
              {trips.map(trip => (
                <option key={trip._id} value={trip._id} className="bg-gray-800">
                  {trip.name}
                </option>
              ))}
            </select>

            <h3 className="text-white font-bold mb-3">Destinations</h3>
            <div className="space-y-2 mb-4">
              {destinations.map((dest, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                  <span className="text-blue-300 font-bold">{index + 1}</span>
                  <span className="text-white">{dest}</span>
                </div>
              ))}
            </div>

            <button
              onClick={calculateRoute}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold"
            >
              Calculate Route
            </button>

            {routeInfo && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-bold mb-2">Route Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Distance:</span>
                    <span className="text-white">{routeInfo.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Duration:</span>
                    <span className="text-white">{routeInfo.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Stops:</span>
                    <span className="text-white">{routeInfo.stops}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Route Map</h2>
            <div className="h-96 bg-white/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-white/60">Interactive map would be displayed here</p>
                <p className="text-white/40 text-sm mt-2">Integration with Google Maps or Mapbox</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}