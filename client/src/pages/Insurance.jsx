import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Insurance() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    startDate: '',
    endDate: ''
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
        }
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const purchaseInsurance = async () => {
    if (!selectedPlan || !selectedTrip) return
    
    const plan = plans.find(p => p.id === selectedPlan)
    const coverage = {
      medical: plan.id === 1 ? 50000 : plan.id === 2 ? 100000 : 250000,
      baggage: plan.id === 1 ? 1000 : plan.id === 2 ? 2500 : 5000,
      cancellation: plan.id === 1 ? 5000 : plan.id === 2 ? 10000 : 25000,
      delay: plan.id === 1 ? 500 : plan.id === 2 ? 1000 : 2000
    }
    
    try {
      const response = await fetch(`${API_URL}/insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          trip: selectedTrip,
          planType: plan.id === 1 ? 'basic' : plan.id === 2 ? 'standard' : 'premium',
          coverage,
          premium: parseInt(plan.price.replace('$', '')),
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      })
      if (response.ok) {
        alert('Insurance purchased successfully!')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error purchasing insurance:', error)
    }
  }

  const plans = [
    {
      id: 1,
      name: 'Basic Coverage',
      price: '$25',
      features: ['Medical Emergency', 'Trip Cancellation', 'Lost Luggage'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Premium Coverage',
      price: '$45',
      features: ['All Basic Features', 'Adventure Sports', 'Rental Car Coverage', '24/7 Support'],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 3,
      name: 'Comprehensive',
      price: '$75',
      features: ['All Premium Features', 'Business Equipment', 'Pre-existing Conditions', 'Cancel for Any Reason'],
      color: 'from-emerald-500 to-teal-500'
    }
  ]

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

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-blue-300 hover:text-blue-200 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">🛡️ Travel Insurance</h1>
          <p className="text-white/80 mt-2">Protect your travel investment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className={`text-4xl font-black bg-gradient-to-r ${plan.color} text-transparent bg-clip-text`}>
                  {plan.price}
                </div>
                <p className="text-white/60 text-sm">per person</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/90 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? `bg-gradient-to-r ${plan.color} text-white`
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Complete Your Purchase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Select Trip</label>
                  <select
                    value={selectedTrip}
                    onChange={(e) => setSelectedTrip(e.target.value)}
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
                  <label className="block text-white/90 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Departure Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Return Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Plan:</span>
                    <span className="text-white font-bold">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Price:</span>
                    <span className="text-white font-bold">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-green-300">
                        {plans.find(p => p.id === selectedPlan)?.price}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={purchaseInsurance}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300"
                >
                  Purchase Insurance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}