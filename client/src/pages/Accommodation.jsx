import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Accommodation() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState('')
  const [accommodations, setAccommodations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'hotel',
    location: '',
    checkIn: '',
    checkOut: '',
    bookingReference: '',
    cost: '',
    rating: '',
    amenities: [],
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
          fetchAccommodations(data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const fetchAccommodations = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/accommodation/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAccommodations(data)
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingId ? `${API_URL}/accommodation/${editingId}` : `${API_URL}/accommodation`
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          trip: selectedTrip,
          cost: parseFloat(formData.cost) || 0,
          rating: parseInt(formData.rating) || null
        })
      })
      
      if (response.ok) {
        fetchAccommodations(selectedTrip)
        setShowForm(false)
        setEditingId(null)
        setFormData({
          name: '',
          type: 'hotel',
          location: '',
          checkIn: '',
          checkOut: '',
          bookingReference: '',
          cost: '',
          rating: '',
          amenities: [],
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error saving accommodation:', error)
    }
  }

  const handleEdit = (accommodation) => {
    setFormData({
      ...accommodation,
      checkIn: new Date(accommodation.checkIn).toISOString().split('T')[0],
      checkOut: new Date(accommodation.checkOut).toISOString().split('T')[0]
    })
    setEditingId(accommodation._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/accommodation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        fetchAccommodations(selectedTrip)
      }
    } catch (error) {
      console.error('Error deleting accommodation:', error)
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      hotel: '🏨',
      hostel: '🏠',
      apartment: '🏢',
      resort: '🏖️',
      other: '🏘️'
    }
    return icons[type] || '🏘️'
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating || 0)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
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
            <h1 className="text-4xl font-black text-white drop-shadow-lg">🏨 Accommodation Management</h1>
            <p className="text-white/80 mt-2">Manage your hotel bookings and accommodation details</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Add Accommodation
          </button>
        </div>

        <div className="mb-6">
          <select
            value={selectedTrip}
            onChange={(e) => {
              setSelectedTrip(e.target.value)
              fetchAccommodations(e.target.value)
            }}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          >
            {trips.map(trip => (
              <option key={trip._id} value={trip._id} className="bg-gray-800">
                {trip.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <div key={accommodation._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getTypeIcon(accommodation.type)}</span>
                  <div>
                    <h3 className="text-white font-bold">{accommodation.name}</h3>
                    <p className="text-white/60 text-sm capitalize">{accommodation.type}</p>
                    {accommodation.rating && (
                      <p className="text-yellow-400 text-sm">{renderStars(accommodation.rating)}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(accommodation)}
                    className="text-blue-300 hover:text-blue-200"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(accommodation._id)}
                    className="text-red-300 hover:text-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-white/80">Location:</span>
                  <span className="text-white font-medium">{accommodation.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Check-in:</span>
                  <span className="text-white font-medium">
                    {new Date(accommodation.checkIn).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Check-out:</span>
                  <span className="text-white font-medium">
                    {new Date(accommodation.checkOut).toLocaleDateString()}
                  </span>
                </div>
                {accommodation.bookingReference && (
                  <div className="flex justify-between">
                    <span className="text-white/80">Ref:</span>
                    <span className="text-white font-medium">{accommodation.bookingReference}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/80">Cost:</span>
                  <span className="text-green-300 font-bold">${accommodation.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Edit Accommodation' : 'Add Accommodation'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Hotel/Accommodation Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  required
                />

                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartment">Apartment</option>
                  <option value="resort">Resort</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    required
                  />
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Booking Reference"
                  value={formData.bookingReference}
                  onChange={(e) => setFormData({...formData, bookingReference: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Cost"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  >
                    <option value="">Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    className="flex-1 px-6 py-3 border border-white/30 text-white rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium"
                  >
                    {editingId ? 'Update' : 'Add'}
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