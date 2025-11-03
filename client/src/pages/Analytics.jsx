"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTrip } from "../context/TripContext"
import { CategoryChart, TimelineChart, CategoryBreakdown } from "../components/ExpenseChart"

export default function Analytics() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { selectedTrip, getTrip, fetchExpenses, expenses } = useTrip()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        await getTrip(tripId)
        await fetchExpenses(tripId)

        // Fetch analytics data
        const response = await fetch(`${API_URL}/analytics/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setAnalyticsData(data)
        }
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [tripId])

  if (loading || !selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const totalSpent = analyticsData?.totalSpent || 0
  const remaining = selectedTrip.totalBudget - totalSpent
  const percentageSpent = selectedTrip.totalBudget > 0 ? (totalSpent / selectedTrip.totalBudget) * 100 : 0

  // Calculate per-person statistics
  const userSpending = {}
  expenses.forEach((expense) => {
    const payerId = expense.payer?._id || "unknown"
    const payerName = expense.payer?.name || "Unknown"
    if (!userSpending[payerId]) {
      userSpending[payerId] = {
        name: payerName,
        amount: 0,
        count: 0,
      }
    }
    userSpending[payerId].amount += expense.amount
    userSpending[payerId].count += 1
  })

  const topSpender = Object.values(userSpending).sort((a, b) => b.amount - a.amount)[0]
  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <button
              onClick={() => navigate(`/trip/${tripId}`)}
              className="mb-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              ← Back to Trip
            </button>
            <h1 className="text-4xl font-bold text-gray-900">{selectedTrip.name}</h1>
            <p className="text-gray-600 mt-1">Analytics & Insights</p>
          </div>
          <button
            onClick={() => navigate(`/trip/${tripId}/expenses`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Manage Expenses
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-blue-600">${totalSpent.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{expenses.length} transactions</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${remaining >= 0 ? "border-green-500" : "border-red-500"} hover:shadow-lg transition`}
          >
            <p className="text-gray-600 text-sm font-medium mb-2">Remaining Budget</p>
            <p className={`text-3xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${remaining.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">{percentageSpent.toFixed(1)}% spent</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg. Expense</p>
            <p className="text-3xl font-bold text-purple-600">${averageExpense.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Per transaction</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Daily Avg.</p>
            <p className="text-3xl font-bold text-orange-600">
              ${analyticsData?.averageDailySpend ? analyticsData.averageDailySpend.toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-gray-500 mt-2">Per day</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500 hover:shadow-lg transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Top Spender</p>
            <p className="text-lg font-bold text-pink-600">{topSpender?.name || "N/A"}</p>
            <p className="text-xs text-gray-500 mt-2">${topSpender?.amount.toFixed(2) || "0.00"}</p>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all flex items-center justify-center text-white text-xs font-bold ${
                remaining >= 0
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
              style={{ width: `${Math.min(percentageSpent, 100)}%` }}
            >
              {Math.min(percentageSpent, 100).toFixed(1)}%
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium">
            <span className="text-gray-700">Budget: ${selectedTrip.totalBudget.toFixed(2)}</span>
            <span className="text-gray-700">Spent: ${totalSpent.toFixed(2)}</span>
            <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
              {remaining >= 0 ? "Remaining" : "Over"}: ${Math.abs(remaining).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryChart expenses={expenses} />
          <TimelineChart expenses={expenses} />
        </div>

        {/* Category and Person Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryBreakdown expenses={expenses} />

          {/* Per-Person Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Person</h3>
            {Object.values(userSpending).length > 0 ? (
              <div className="space-y-4">
                {Object.values(userSpending)
                  .sort((a, b) => b.amount - a.amount)
                  .map((person, idx) => {
                    const personPercentage = (person.amount / totalSpent) * 100
                    return (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{person.name}</p>
                            <p className="text-xs text-gray-500">{person.count} transactions</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${person.amount.toFixed(2)}</p>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${personPercentage}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{personPercentage.toFixed(1)}% of total</p>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No spending data available</div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
          <p className="text-gray-600 text-sm mb-4">Download your trip analytics and expense data</p>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Export as CSV
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
