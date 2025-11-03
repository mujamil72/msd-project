"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTrip } from "../context/TripContext"

export default function Expenses() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { selectedTrip, getTrip, fetchExpenses, expenses, createExpense, updateExpense, deleteExpense, loading } =
    useTrip()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [formData, setFormData] = useState({
    category: "Food",
    amount: "",
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    description: "",
    payer: "",
  })

  useEffect(() => {
    getTrip(tripId)
    fetchExpenses(tripId)
  }, [tripId])

  const handleAddExpense = async (e) => {
    e.preventDefault()
    await createExpense({
      ...formData,
      trip: tripId,
    })
    setFormData({
      category: "Food",
      amount: "",
      currency: "USD",
      date: new Date().toISOString().split("T")[0],
      description: "",
      payer: "",
    })
    setShowForm(false)
    await fetchExpenses(tripId)
  }

  const handleDelete = async (expenseId) => {
    if (window.confirm("Delete this expense?")) {
      await deleteExpense(expenseId)
      await fetchExpenses(tripId)
    }
  }

  const filteredExpenses = expenses.filter((e) => (filter === "all" ? true : e.category === filter))

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date) - new Date(a.date)
    if (sortBy === "amount") return b.amount - a.amount
    if (sortBy === "category") return a.category.localeCompare(b.category)
    return 0
  })

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categoryTotals = {}
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/trip/${tripId}`)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Trip
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Trip Expenses</h1>
          {selectedTrip && (
            <p className="text-gray-600">
              {selectedTrip.name} - {selectedTrip.destination}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900">{expenses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-blue-600">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Average Expense</p>
            <p className="text-3xl font-bold text-green-600">
              ${expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Categories</p>
            <p className="text-3xl font-bold text-purple-600">{Object.keys(categoryTotals).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Expense</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              {showForm ? "Cancel" : "New Expense"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAddExpense}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Food</option>
                <option>Accommodation</option>
                <option>Transport</option>
                <option>Activities</option>
                <option>Miscellaneous</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Add Expense
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Filters & Sort</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {Object.keys(categoryTotals).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date (Newest First)</option>
                <option value="amount">Amount (Highest First)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedExpenses.length > 0 ? (
                  sortedExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {expense.currency} {expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-600">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
