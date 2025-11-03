import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Reports() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('month')
  const [reportType, setReportType] = useState('overview')
  const [analytics, setAnalytics] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    fetchAnalytics()
    fetchTrips()
  }, [timeRange, reportType])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-blue-300 hover:text-blue-200 font-medium mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">📊 Reports & Analytics</h1>
            <p className="text-white/80 mt-2">Comprehensive insights into your travel spending</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-white/90 font-medium mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div>
              <label className="block text-white/90 font-medium mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="overview">Overview</option>
                <option value="categories">By Category</option>
                <option value="trips">By Trip</option>
                <option value="members">By Member</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Spending Overview</h2>
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl">
              <p className="text-white/60">Chart visualization would go here</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/80">Total Spent</span>
                  <span className="text-white font-bold">
                    ${analytics?.totalSpent?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Total Trips</span>
                  <span className="text-white font-bold">{analytics?.totalTrips || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Budget Used</span>
                  <span className="text-white font-bold">
                    {analytics?.budgetUsed?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">Export Options</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg font-medium transition-colors duration-300">
                  Export as PDF
                </button>
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-4 rounded-lg font-medium transition-colors duration-300">
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}