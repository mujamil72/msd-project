import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BudgetPlanner() {
  const navigate = useNavigate()
  const [budgetData, setBudgetData] = useState({
    totalBudget: '',
    duration: '',
    destination: '',
    categories: {
      accommodation: 40,
      food: 25,
      transport: 20,
      activities: 10,
      other: 5
    }
  })
  const [selectedTrip, setSelectedTrip] = useState('')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

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
          loadBudget(data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBudget = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/budget/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const budget = await response.json()
        if (budget) {
          setBudgetData({
            totalBudget: budget.totalBudget,
            categories: budget.categories
          })
        }
      }
    } catch (error) {
      console.error('Error loading budget:', error)
    }
  }

  const saveBudget = async () => {
    if (!selectedTrip) return
    
    try {
      const response = await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          trip: selectedTrip,
          categories: budgetData.categories,
          totalBudget: budgetData.totalBudget,
          currency: 'USD'
        })
      })
      if (response.ok) {
        alert('Budget saved successfully!')
      }
    } catch (error) {
      console.error('Error saving budget:', error)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-blue-300 hover:text-blue-200 font-medium mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">📊 Budget Planner</h1>
            <p className="text-white/80 mt-2">Plan and optimize your travel budget</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Create Budget Plan</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-medium mb-2">Select Trip</label>
                <select
                  value={selectedTrip}
                  onChange={(e) => {
                    setSelectedTrip(e.target.value)
                    loadBudget(e.target.value)
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  {trips.map(trip => (
                    <option key={trip._id} value={trip._id} className="bg-gray-800">
                      {trip.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/90 font-medium mb-2">Total Budget</label>
                <input
                  type="number"
                  value={budgetData.totalBudget}
                  onChange={(e) => setBudgetData({...budgetData, totalBudget: e.target.value})}
                  placeholder="5000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Duration (days)</label>
                  <input
                    type="number"
                    value={budgetData.duration}
                    onChange={(e) => setBudgetData({...budgetData, duration: e.target.value})}
                    placeholder="7"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-2">Destination</label>
                  <input
                    type="text"
                    value={budgetData.destination}
                    onChange={(e) => setBudgetData({...budgetData, destination: e.target.value})}
                    placeholder="Paris, France"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Budget Allocation</h3>
                <div className="space-y-4">
                  {Object.entries(budgetData.categories).map(([category, percentage]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/90 capitalize">{category}</span>
                        <span className="text-white font-bold">{percentage}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={(e) => setBudgetData({
                          ...budgetData,
                          categories: {...budgetData.categories, [category]: parseInt(e.target.value)}
                        })}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={saveBudget}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
              >
                Save Budget Plan
              </button>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Budget Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(budgetData.categories).map(([category, percentage]) => {
                const amount = (budgetData.totalBudget * percentage / 100) || 0
                return (
                  <div key={category} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium capitalize">{category}</span>
                      <span className="text-blue-300 font-bold">${amount.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-sm mt-1">{percentage}% of total budget</p>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Daily Budget:</span>
                <span className="text-green-300">
                  ${budgetData.duration ? (budgetData.totalBudget / budgetData.duration).toFixed(0) : '0'}/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}