"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useTrip } from "../context/TripContext"
import { useAuth } from "../context/AuthContext"

export default function SplitBillForm() {
  const { tripId } = useParams()
  const { selectedTrip, getTrip, createExpense, loading } = useTrip()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    category: "Food",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    payer: user?.id,
    splitType: "equal", // equal or custom
    currency: "USD",
  })
  const [splitAmounts, setSplitAmounts] = useState({})
  const [members, setMembers] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Build split between array
    const splitBetween = members.map((member) => ({
      user: member._id,
      amount: formData.splitType === "equal" ? formData.amount / members.length : splitAmounts[member._id] || 0,
    }))

    await createExpense({
      ...formData,
      trip: tripId,
      splitBetween,
    })

    // Reset form
    setFormData({
      category: "Food",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      payer: user?.id,
      splitType: "equal",
      currency: "USD",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Expense & Split Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Food</option>
              <option>Accommodation</option>
              <option>Transport</option>
              <option>Activities</option>
              <option>Miscellaneous</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Split Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Split Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="equal"
                checked={formData.splitType === "equal"}
                onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
                className="mr-2"
              />
              <span className="text-gray-700">Equal Split</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="custom"
                checked={formData.splitType === "custom"}
                onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
                className="mr-2"
              />
              <span className="text-gray-700">Custom Split</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Expense & Split"}
        </button>
      </form>
    </div>
  )
}
