"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTrip } from "../context/TripContext"

export default function Members() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { selectedTrip, getTrip, updateTrip, loading } = useTrip()
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [settlements, setSettlements] = useState([])
  const [inviteLoading, setInviteLoading] = useState(false)
  const [message, setMessage] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const token = localStorage.getItem("auth_token")

  useEffect(() => {
    const load = async () => {
      await getTrip(tripId)
      await fetchSettlements()
    }
    load()
  }, [tripId])

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

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail) {
      setMessage({ type: "error", text: "Please enter an email" })
      return
    }

    setInviteLoading(true)
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail }),
      })
      if (response.ok) {
        setMessage({ type: "success", text: "Invite sent successfully!" })
        await getTrip(tripId)
        setInviteEmail("")
        setShowInvite(false)
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage({ type: "error", text: "Failed to send invite" })
      }
    } catch (error) {
      console.error("Error inviting member:", error)
      setMessage({ type: "error", text: "Error sending invite" })
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRemove = async (userId) => {
    if (window.confirm("Remove this member from the trip?")) {
      try {
        const response = await fetch(`${API_URL}/trips/${tripId}/members/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          await getTrip(tripId)
          setMessage({ type: "success", text: "Member removed" })
          setTimeout(() => setMessage(""), 3000)
        }
      } catch (error) {
        console.error("Error removing member:", error)
      }
    }
  }

  if (loading || !selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const allMembers = [selectedTrip.owner, ...(selectedTrip.invitedUsers || [])].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/trip/${tripId}`)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Trip
        </button>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Trip Members</h2>
                <p className="text-gray-600 text-sm mt-1">{allMembers.length} total members</p>
              </div>
              <button
                onClick={() => setShowInvite(!showInvite)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                {showInvite ? "Cancel" : "Invite"}
              </button>
            </div>

            {showInvite && (
              <form
                onSubmit={handleInvite}
                className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
                  >
                    {inviteLoading ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {allMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      {member._id === selectedTrip.owner._id && (
                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">Owner</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  {member._id !== selectedTrip.owner._id && (
                    <button
                      onClick={() => handleRemove(member._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settlements Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settlements</h2>
            <div className="space-y-4">
              {settlements && settlements.length > 0 ? (
                settlements.map((settlement, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-l-4 border-orange-500"
                  >
                    <p className="font-semibold text-gray-900 mb-1">{settlement.fromUser?.name || "User"} owes</p>
                    <p className="text-sm text-gray-600 mb-2">{settlement.toUser?.name || "User"}</p>
                    <p className="text-lg font-bold text-orange-600">${settlement.amount.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-green-700 font-medium">All settled up!</p>
                  <p className="text-green-600 text-sm">No pending payments</p>
                </div>
              )}
            </div>

            {settlements && settlements.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-2">Total Outstanding</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${settlements.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
