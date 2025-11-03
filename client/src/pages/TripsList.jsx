"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTrip } from "../context/TripContext"

export default function TripsList() {
  const { trips, fetchTrips, loading, createTrip, deleteTrip } = useTrip()
  const navigate = useNavigate()
  const [showNewTrip, setShowNewTrip] = useState(false)
  const [filter, setFilter] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    currency: "USD",
    description: "",
  })

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields")
      return
    }

    await createTrip(formData)
    setFormData({
      name: "",
      destination: "",
      startDate: "",
      endDate: "",
      totalBudget: "",
      currency: "USD",
      description: "",
    })
    setShowNewTrip(false)
    await fetchTrips()
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      await deleteTrip(tripId)
    }
  }

  const filteredTrips = trips.filter((t) => {
    if (filter === "active") return t.status === "active"
    if (filter === "upcoming") return new Date(t.startDate) > new Date()
    if (filter === "past") return new Date(t.endDate) < new Date()
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Trips</h1>
          <button
            onClick={() => setShowNewTrip(!showNewTrip)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {showNewTrip ? "Cancel" : "New Trip"}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {["all", "active", "upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {showNewTrip && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Trip</h2>
            <form onSubmit={handleCreateTrip} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Summer Europe Tour"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Trip details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5000"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: Number.parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="INR">INR</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Create Trip
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading trips...</p>
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition transform hover:scale-105 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <h3 className="text-xl font-semibold text-white">{trip.name}</h3>
                  {trip.destination && <p className="text-blue-100">{trip.destination}</p>}
                </div>

                <div className="p-6">
                  {trip.startDate && (
                    <p className="text-gray-600 mb-3 text-sm">
                      <span className="font-semibold">📅</span> {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  )}

                  {trip.description && <p className="text-gray-600 mb-4 text-sm line-clamp-2">{trip.description}</p>}

                  {trip.totalBudget && (
                    <p className="text-lg font-bold text-blue-600 mb-4">
                      Budget: {trip.currency} {trip.totalBudget.toLocaleString()}
                    </p>
                  )}

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                      trip.status === "active"
                        ? "bg-green-100 text-green-800"
                        : trip.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/trip/${trip._id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips found</h2>
            <p className="text-gray-600 mb-6">Create your first trip or adjust your filters</p>
            <button
              onClick={() => setShowNewTrip(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Create New Trip
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
