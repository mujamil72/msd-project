"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTrip } from "../context/TripContext"

export default function TripDetail() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { selectedTrip, getTrip, fetchExpenses, expenses, loading } = useTrip()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    getTrip(tripId)
    fetchExpenses(tripId)
  }, [tripId])

  if (loading || !selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading trip details...</p>
      </div>
    )
  }

  const totalSpent = Array.isArray(expenses) ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0
  const remaining = (selectedTrip?.totalBudget || 0) - totalSpent
  const percentageSpent = selectedTrip?.totalBudget > 0 ? (totalSpent / selectedTrip.totalBudget) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate("/trips")} className="mb-6 text-blue-600 hover:text-blue-800 font-semibold">
          ← Back to Trips
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedTrip.name}</h1>
              {selectedTrip.destination && (
                <p className="text-gray-600">
                  <span className="text-lg">📍</span> {selectedTrip.destination}
                </p>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedTrip.status === "active"
                  ? "bg-green-100 text-green-800"
                  : selectedTrip.status === "completed"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Budget</p>
              <p className="text-2xl font-bold text-blue-600">
                {selectedTrip.currency} {selectedTrip.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Spent</p>
              <p className="text-2xl font-bold text-red-600">
                {selectedTrip.currency} {totalSpent.toFixed(2)}
              </p>
            </div>
            <div className={`${remaining >= 0 ? "bg-green-50" : "bg-orange-50"} p-4 rounded-lg`}>
              <p className="text-gray-600 text-sm">Remaining</p>
              <p className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-orange-600"}`}>
                {selectedTrip.currency} {remaining.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${remaining >= 0 ? "bg-blue-600" : "bg-red-600"}`}
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{percentageSpent.toFixed(1)}% of budget used</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="border-b border-gray-200 flex">
            {["overview", "expenses", "members", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                  activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {selectedTrip.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedTrip.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Trip Dates</h3>
                  <p className="text-gray-600">
                    {selectedTrip.startDate && selectedTrip.endDate
                      ? `${new Date(selectedTrip.startDate).toLocaleDateString()} - ${new Date(selectedTrip.endDate).toLocaleDateString()}`
                      : "No dates set"}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => navigate(`/trip/${tripId}/expenses`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Manage Expenses
                  </button>
                  <button
                    onClick={() => navigate(`/trip/${tripId}/members`)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Manage Members
                  </button>
                  <button
                    onClick={() => navigate(`/analytics/${tripId}`)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            )}

            {activeTab === "expenses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                  <button
                    onClick={() => navigate(`/trip/${tripId}/expenses`)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View All
                  </button>
                </div>
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses.slice(0, 5).map((expense) => (
                      <div key={expense._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{expense.category}</p>
                          <p className="text-sm text-gray-600">{expense.description}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No expenses yet</p>
                )}
              </div>
            )}

            {activeTab === "members" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Members</h3>
                {selectedTrip.owner && (
                  <div className="p-4 bg-blue-50 rounded-lg mb-4 border-l-4 border-blue-600">
                    <p className="font-semibold text-gray-900">{selectedTrip.owner.name}</p>
                    <p className="text-sm text-gray-600">{selectedTrip.owner.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                      Owner
                    </span>
                  </div>
                )}
                {selectedTrip.invitedUsers && selectedTrip.invitedUsers.length > 0 && (
                  <div className="space-y-3">
                    {selectedTrip.invitedUsers.map((user) => (
                      <div key={user._id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => navigate(`/trip/${tripId}/members`)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Manage Members
                </button>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">View detailed analytics and spending insights</p>
                <button
                  onClick={() => navigate(`/analytics/${tripId}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Open Analytics Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
