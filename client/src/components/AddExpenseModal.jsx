import { useState, useEffect } from 'react'
import Modal from './Modal'

export default function AddExpenseModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    category: 'food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    trip: ''
  })
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    if (isOpen) {
      fetchTrips()
    }
  }, [isOpen])

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, trip: data[0]._id }))
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      })
      
      if (response.ok) {
        onSubmit(formData)
        setFormData({
          category: 'food',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          trip: trips[0]?._id || ''
        })
        onClose()
      }
    } catch (error) {
      console.error('Error adding expense:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💸 Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 font-medium mb-2">Select Trip</label>
          <select
            value={formData.trip}
            onChange={(e) => setFormData({...formData, trip: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            required
          >
            {trips.map(trip => (
              <option key={trip._id} value={trip._id} className="bg-gray-800">
                {trip.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-white/90 font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          >
            <option value="food">🍽️ Food & Dining</option>
            <option value="accommodation">🏨 Accommodation</option>
            <option value="transport">🚗 Transportation</option>
            <option value="activities">🎯 Activities</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="other">📦 Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white/90 font-medium mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
          />
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="What was this expense for?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
          />
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  )
}