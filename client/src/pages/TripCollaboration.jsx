"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTrip } from "../context/TripContext"
import { useAuth } from "../context/AuthContext"

export default function TripCollaboration() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { selectedTrip, getTrip, expenses, loading } = useTrip()
  const { token, user } = useAuth()
  const [settlements, setSettlements] = useState([])
  const [members, setMembers] = useState([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    getTrip(tripId)
    fetchSettlements()
  }, [tripId])

  useEffect(() => {
    if (selectedTrip) {
      const allMembers = [selectedTrip.owner, ...(selectedTrip.invitedUsers || [])]
      setMembers(allMembers)
    }
  }, [selectedTrip])

  const fetchSettlements = async () => {
    try {
      const response = await fetch(`${API_URL}/settlements/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSettlements(data)
      }
    } catch (error) {
      console.error("Error fetching settlements:", error)
    }
  }

  const handleSettleUp = async (settlement) => {
    try {
      const response = await fetch(`${API_URL}/settlements/${tripId}/settle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId: settlement.fromUser._id,
          toUserId: settlement.toUser._id,
          amount: settlement.amount,
        }),
      })
      if (response.ok) {
        fetchSettlements()
      }
    } catch (error) {
      console.error("Error settling up:", error)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    // In a real app, you'd look up the user by email
    // For now, we'll show a message
    alert("Invite sent to " + newMemberEmail)
    setNewMemberEmail("")
    setShowAddMember(false)
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (!selectedTrip) return <div className="text-center py-8">Trip not found</div>

  const isOwner = user?.id === selectedTrip.owner._id

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/trip/${tripId}`)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Trip
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{selectedTrip.name} - Collaboration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Members</h2>
              {isOwner && (
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  {showAddMember ? "Cancel" : "Add"}
                </button>
              )}
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="mb-6 pb-6 border-b border-gray-200">
                <input
                  type="email"
                  placeholder="Member email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold"
                >
                  Send Invite
                </button>
              </form>
            )}

            <div className="space-y-3">
              {members.map((member, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.email}</p>
                      {member._id === selectedTrip.owner._id && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                          Owner
                        </span>
                      )}
                    </div>
                    {isOwner && member._id !== selectedTrip.owner._id && (
                      <button
                        onClick={() => {
                          // Remove member logic
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settlements Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Settlements</h2>

            {settlements.length > 0 ? (
              <div className="space-y-4">
                {settlements.map((settlement, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {settlement.fromUser?.name} owes {settlement.toUser?.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Amount: USD {settlement.amount.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleSettleUp(settlement)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Mark Settled
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No settlements needed!</p>
                <p className="text-sm text-gray-500 mt-2">All expenses are settled or haven't been added yet.</p>
              </div>
            )}

            {/* Expense Summary */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Expense Summary by Person</h3>
              <div className="space-y-3">
                {members.map((member, idx) => {
                  const memberExpenses = expenses.filter((e) => e.payer?._id === member._id)
                  const totalSpent = memberExpenses.reduce((sum, e) => sum + e.amount, 0)

                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium text-gray-900">{member.name}</span>
                      <span className="text-lg font-bold text-gray-900">USD {totalSpent.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
