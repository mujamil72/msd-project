"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTrip } from "../context/TripContext"
import AddExpenseModal from "../components/AddExpenseModal"
import SplitBillModal from "../components/SplitBillModal"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { trips, fetchTrips, loading } = useTrip()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    activeTrips: 0,
    upcomingTrips: 0,
  })
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showSplitBill, setShowSplitBill] = useState(false)
  const [currencyFrom, setCurrencyFrom] = useState('USD')
  const [currencyTo, setCurrencyTo] = useState('EUR')
  const [convertAmount, setConvertAmount] = useState('100')
  const [convertedAmount, setConvertedAmount] = useState('85.50')

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    fetchTrips()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [trips])

  const calculateStats = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalTrips: data.totalTrips || 0,
          totalSpent: data.totalSpent || 0,
          activeTrips: trips.filter((t) => t.status === "active").length,
          upcomingTrips: trips.filter((t) => new Date(t.startDate) > new Date()).length,
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const upcomingTrips = trips.filter((t) => new Date(t.startDate) > new Date()).slice(0, 6)
  const activeTrips = trips.filter((t) => t.status === "active").slice(0, 6)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <header className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg">
                🏠 Dashboard
              </h1>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg">Welcome back, <span className="font-bold text-blue-300">{user?.name}</span></p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate("/profile")}
                className="text-white/90 hover:text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/20 text-sm sm:text-base text-center"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-xl text-sm sm:text-base text-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-full">
          {[
            { label: 'Total Trips', value: stats.totalTrips, icon: '✈️', color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Spent', value: `$${stats.totalSpent.toLocaleString()}`, icon: '💰', color: 'from-green-500 to-emerald-500' },
            { label: 'Active Trips', value: stats.activeTrips, icon: '🎯', color: 'from-purple-500 to-pink-500' },
            { label: 'Upcoming', value: stats.upcomingTrips, icon: '📅', color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <div key={index} className="group bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/80 text-xs sm:text-sm font-bold mb-2 sm:mb-3 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r ${stat.color} text-transparent bg-clip-text drop-shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`text-2xl sm:text-3xl lg:text-4xl p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${stat.color} bg-opacity-20 group-hover:scale-125 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            { title: 'Plan New Trip', desc: 'Create and manage new adventures', icon: '✈️', color: 'from-blue-500 to-blue-600', action: () => navigate('/trips') },
            { title: 'Track Expenses', desc: 'Add and manage trip expenses', icon: '💸', color: 'from-green-500 to-green-600', action: () => setShowAddExpense(true) },
            { title: 'View Analytics', desc: 'See detailed spending insights', icon: '📊', color: 'from-purple-500 to-purple-600', action: () => navigate('/reports') },
            { title: 'Invite Friends', desc: 'Collaborate with travel buddies', icon: '👥', color: 'from-pink-500 to-rose-600', action: () => navigate('/trips') },
            { title: 'Plan Route', desc: 'Map destinations and routes', icon: '🗺️', color: 'from-indigo-500 to-blue-600', action: () => navigate('/map-route') },
            { title: 'Manage Transport', desc: 'Book flights, trains & more', icon: '🚗', color: 'from-orange-500 to-red-600', action: () => navigate('/transport') },
            { title: 'Book Hotels', desc: 'Manage accommodation bookings', icon: '🏨', color: 'from-teal-500 to-cyan-600', action: () => navigate('/accommodation') }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`group bg-gradient-to-br ${action.color} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 text-left relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-300">{action.icon}</div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2 text-white drop-shadow-lg">{action.title}</h3>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed">{action.desc}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          ))}
        </div>

        {/* Recent Activity & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white drop-shadow-lg">🕰️ Recent Activity</h2>
              <button className="text-blue-300 hover:text-blue-200 font-bold transition-colors duration-300">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Created new trip', detail: 'Summer Europe Tour', time: '2 hours ago', icon: '✈️' },
                { action: 'Added expense', detail: '$45.50 for dinner', time: '5 hours ago', icon: '🍽️' },
                { action: 'Invited member', detail: 'john@example.com', time: '1 day ago', icon: '👥' },
                { action: 'Updated budget', detail: 'Increased to $3,000', time: '2 days ago', icon: '💰' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-white/70 text-sm">{activity.detail}</p>
                  </div>
                  <p className="text-white/50 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Insights */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-black text-white drop-shadow-lg mb-6">📈 Budget Insights</h2>
            <div className="space-y-6">
              {/* Spending Trend */}
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">This Month's Spending</h3>
                  <span className="text-green-300 text-sm font-bold">+12% ↑</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-white/70 text-sm">$2,040 of $3,000 budget used</p>
              </div>

              {/* Top Categories */}
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Top Spending Categories</h3>
                <div className="space-y-3">
                  {[
                    { category: 'Accommodation', amount: '$850', percentage: 42 },
                    { category: 'Food & Dining', amount: '$620', percentage: 30 },
                    { category: 'Transportation', amount: '$380', percentage: 19 }
                  ].map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <span className="text-white/90 text-sm">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-sm">{cat.amount}</p>
                        <p className="text-white/60 text-xs">{cat.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-black text-white drop-shadow-lg mb-8">💳 Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Monthly Summary */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Monthly Summary</h3>
                <span className="text-3xl">📅</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Income</span>
                  <span className="text-green-300 font-bold">+$4,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Expenses</span>
                  <span className="text-red-300 font-bold">-$2,040</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Net</span>
                    <span className="text-blue-300 font-bold">$2,160</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Goal */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Savings Goal</h3>
                <span className="text-3xl">🎯</span>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-black text-green-300">$8,500</p>
                  <p className="text-white/70 text-sm">of $10,000 goal</p>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-center text-white/80 text-sm">85% Complete</p>
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-400/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Upcoming</h3>
                <span className="text-3xl">⏰</span>
              </div>
              <div className="space-y-3">
                {[
                  { item: 'Hotel Booking', amount: '$320', date: 'Dec 15' },
                  { item: 'Flight Tickets', amount: '$680', date: 'Dec 20' }
                ].map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">{payment.item}</p>
                      <p className="text-white/60 text-xs">{payment.date}</p>
                    </div>
                    <p className="text-orange-300 font-bold">{payment.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trip Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-12">
          {/* Active Trips */}
          {activeTrips.length > 0 && (
            <div className="lg:col-span-3 xl:col-span-3 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-white drop-shadow-lg">🏡 Active Trips</h2>
                <button
                  onClick={() => navigate("/trips")}
                  className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors duration-300 hover:underline"
                >
                  View All →
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                  <p className="text-white/80 text-lg">Loading trips...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeTrips.slice(0, 4).map((trip) => (
                    <div
                      key={trip._id}
                      onClick={() => navigate(`/trip/${trip._id}`)}
                      className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors duration-300">
                          {trip.name}
                        </h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold border border-green-400/30">
                          Active
                        </span>
                      </div>

                      {trip.destination && (
                        <p className="text-white/80 mb-3 flex items-center gap-2">
                          <span className="text-lg">📍</span> {trip.destination}
                        </p>
                      )}

                      {trip.startDate && (
                        <p className="text-white/60 mb-4 text-sm">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      )}

                      <div className="pt-4 border-t border-white/20">
                        <p className="text-blue-300 font-bold">
                          Budget: {trip.currency} {trip.budget?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Stats & Tools */}
          <div className="lg:col-span-1 xl:col-span-2 space-y-6">
            {/* Currency Converter */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                💱 Currency Converter
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={convertAmount}
                    onChange={(e) => {
                      setConvertAmount(e.target.value)
                      // Mock conversion
                      setConvertedAmount((parseFloat(e.target.value || 0) * 0.855).toFixed(2))
                    }}
                    placeholder="100" 
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <select 
                    value={currencyFrom}
                    onChange={(e) => setCurrencyFrom(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                <div className="text-center text-white/60">↓</div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={convertedAmount}
                    readOnly 
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
                  />
                  <select 
                    value={currencyTo}
                    onChange={(e) => setCurrencyTo(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">📊 Expense Categories</h3>
              <div className="space-y-3">
                {[
                  { name: 'Food', amount: '$420', color: 'bg-red-400' },
                  { name: 'Transport', amount: '$280', color: 'bg-blue-400' },
                  { name: 'Hotels', amount: '$650', color: 'bg-green-400' },
                  { name: 'Activities', amount: '$190', color: 'bg-purple-400' }
                ].map((cat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${cat.color} rounded-full`}></div>
                      <span className="text-white/90 text-sm">{cat.name}</span>
                    </div>
                    <span className="text-white font-bold text-sm">{cat.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddExpense(true)}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 border border-blue-400/30 hover:scale-105 transform"
                >
                  Add Expense
                </button>
                <button 
                  onClick={() => setShowSplitBill(true)}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 border border-green-400/30 hover:scale-105 transform"
                >
                  Split Bill
                </button>
                <button 
                  onClick={() => navigate('/reports')}
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 border border-purple-400/30 hover:scale-105 transform"
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Trips & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {/* Upcoming Trips */}
          {upcomingTrips.length > 0 && (
            <div className="xl:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white drop-shadow-lg">📅 Upcoming Trips</h2>
                <button
                  onClick={() => navigate("/trips")}
                  className="text-blue-300 hover:text-blue-200 font-bold transition-colors duration-300 hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {upcomingTrips.slice(0, 3).map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => navigate(`/trip/${trip._id}`)}
                    className="group flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 hover:border-l-4 hover:border-blue-400 transition-all duration-300 cursor-pointer border border-white/10"
                  >
                    <div>
                      <p className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{trip.name}</p>
                      <p className="text-white/70 flex items-center gap-2 mt-1 text-sm">
                        <span>📍</span> {trip.destination} • {new Date(trip.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        {trip.currency} {trip.budget?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-blue-300 capitalize font-medium">{trip.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications & Alerts */}
          <div className="xl:col-span-1 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-black text-white drop-shadow-lg mb-6">🔔 Notifications</h2>
            <div className="space-y-4">
              {[
                { type: 'warning', message: 'Budget limit reached for "Food" category', time: '2h ago', icon: '⚠️' },
                { type: 'info', message: 'New expense added by John Doe', time: '4h ago', icon: '💸' },
                { type: 'success', message: 'Trip "Beach Vacation" completed successfully', time: '1d ago', icon: '✅' },
                { type: 'reminder', message: 'Flight booking reminder for next week', time: '2d ago', icon: '⏰' }
              ].map((notification, index) => (
                <div key={index} className={`p-4 rounded-xl border-l-4 ${
                  notification.type === 'warning' ? 'bg-orange-500/10 border-orange-400' :
                  notification.type === 'info' ? 'bg-blue-500/10 border-blue-400' :
                  notification.type === 'success' ? 'bg-green-500/10 border-green-400' :
                  'bg-purple-500/10 border-purple-400'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{notification.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{notification.message}</p>
                      <p className="text-white/50 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/notifications')}
              className="w-full mt-4 text-blue-300 hover:text-blue-200 font-medium text-sm transition-colors duration-300 hover:underline"
            >
              View All Notifications
            </button>
          </div>
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/20">
            <div className="text-8xl mb-6 animate-bounce">✈️</div>
            <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">No trips yet</h2>
            <p className="text-white/80 mb-8 text-xl">Start planning your next adventure</p>
            <button
              onClick={() => navigate("/trips")}
              className="group bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10">Create Your First Trip 🚀</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddExpenseModal 
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSubmit={(data) => {
          console.log('Add expense:', data)
          // Handle expense addition
        }}
      />
      
      <SplitBillModal 
        isOpen={showSplitBill}
        onClose={() => setShowSplitBill(false)}
        onSubmit={(data) => {
          console.log('Split bill:', data)
          // Handle bill splitting
        }}
      />
    </div>
  )
}
