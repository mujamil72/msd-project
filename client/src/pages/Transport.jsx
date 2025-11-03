import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Transport() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState('')
  const [transports, setTransports] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    type: 'flight',
    from: '',
    to: '',
    departureDate: '',
    arrivalDate: '',
    departureTime: '',
    arrivalTime: '',
    bookingReference: '',
    cost: '',
    provider: '',
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
          fetchTransports(data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const fetchTransports = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/transport/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTransports(data)
      }
    } catch (error) {
      console.error('Error fetching transports:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingId ? `${API_URL}/transport/${editingId}` : `${API_URL}/transport`
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
          cost: parseFloat(formData.cost) || 0
        })
      })
      
      if (response.ok) {
        fetchTransports(selectedTrip)
        setShowForm(false)
        setEditingId(null)
        setFormData({
          type: 'flight',
          from: '',
          to: '',
          departureDate: '',
          arrivalDate: '',
          departureTime: '',
          arrivalTime: '',
          bookingReference: '',
          cost: '',
          provider: '',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error saving transport:', error)
    }
  }

  const handleEdit = (transport) => {
    setFormData({
      ...transport,
      departureDate: new Date(transport.departureDate).toISOString().split('T')[0],
      arrivalDate: transport.arrivalDate ? new Date(transport.arrivalDate).toISOString().split('T')[0] : ''
    })
    setEditingId(transport._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transport/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        fetchTransports(selectedTrip)
      }
    } catch (error) {
      console.error('Error deleting transport:', error)
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      flight: '✈️',
      train: '🚆',
      bus: '🚌',
      car: '🚗',
      taxi: '🚕',
      other: '🚐'
    }
    return icons[type] || '🚐'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`
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
            <h1 className="text-4xl font-black text-white drop-shadow-lg">🚗 Transport Management</h1>
            <p className="text-white/80 mt-2">Manage your travel bookings and transport details</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Add Transport
          </button>
        </div>

        <div className="mb-6">
          <select
            value={selectedTrip}
            onChange={(e) => {
              setSelectedTrip(e.target.value)
              fetchTransports(e.target.value)
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
          {transports.map((transport) => (
            <div key={transport._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getTypeIcon(transport.type)}</span>
                  <div>
                    <h3 className="text-white font-bold capitalize">{transport.type}</h3>
                    <p className="text-white/60 text-sm">{transport.provider}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(transport)}
                    className="text-blue-300 hover:text-blue-200"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(transport._id)}
                    className="text-red-300 hover:text-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-white/80">From:</span>
                  <span className="text-white font-medium">{transport.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">To:</span>
                  <span className="text-white font-medium">{transport.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Date:</span>
                  <span className="text-white font-medium">
                    {new Date(transport.departureDate).toLocaleDateString()}
                  </span>
                </div>
                {transport.departureTime && (
                  <div className="flex justify-between">
                    <span className="text-white/80">Time:</span>
                    <span className="text-white font-medium">{transport.departureTime}</span>
                  </div>
                )}
                {transport.bookingReference && (
                  <div className="flex justify-between">
                    <span className="text-white/80">Ref:</span>
                    <span className="text-white font-medium">{transport.bookingReference}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/80">Cost:</span>
                  <span className="text-green-300 font-bold">${transport.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Edit Transport' : 'Add Transport'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option value="flight">Flight</option>
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="car">Car</option>
                  <option value="taxi">Taxi</option>
                  <option value="other">Other</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="From"
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    required
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    required
                  />
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
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
                  <input
                    type="text"
                    placeholder="Provider"
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
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