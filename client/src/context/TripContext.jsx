"use client"

import { createContext, useState, useContext } from "react"
import { useAuth } from "./AuthContext"

const TripContext = createContext()

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/trips`, { headers })
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async (tripData) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers,
        body: JSON.stringify(tripData),
      })
      if (response.ok) {
        const newTrip = await response.json()
        setTrips([...trips, newTrip])
        return newTrip
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTrip = async (tripId) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, { headers })
      if (response.ok) {
        const trip = await response.json()
        setSelectedTrip(trip)
        return trip
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateTrip = async (tripId, updatedData) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      })
      if (response.ok) {
        const updatedTrip = await response.json()
        setTrips(trips.map((t) => (t._id === tripId ? updatedTrip : t)))
        if (selectedTrip?._id === tripId) setSelectedTrip(updatedTrip)
        return updatedTrip
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteTrip = async (tripId) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: "DELETE",
        headers,
      })
      if (response.ok) {
        setTrips(trips.filter((t) => t._id !== tripId))
        if (selectedTrip?._id === tripId) setSelectedTrip(null)
        return true
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenses = async (tripId) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/expenses/${tripId}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setExpenses(Array.isArray(data.expenses) ? data.expenses : [])
        return data
      }
    } catch (error) {
      setError(error.message)
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (expenseData) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers,
        body: JSON.stringify(expenseData),
      })
      if (response.ok) {
        const newExpense = await response.json()
        setExpenses(prev => Array.isArray(prev) ? [...prev, newExpense] : [newExpense])
        return newExpense
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateExpense = async (expenseId, updatedData) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      })
      if (response.ok) {
        const updated = await response.json()
        setExpenses(expenses.map((e) => (e._id === expenseId ? updated : e)))
        return updated
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteExpense = async (expenseId) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: "DELETE",
        headers,
      })
      if (response.ok) {
        setExpenses(expenses.filter((e) => e._id !== expenseId))
        return true
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        selectedTrip,
        expenses,
        loading,
        error,
        fetchTrips,
        createTrip,
        getTrip,
        updateTrip,
        deleteTrip,
        fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error("useTrip must be used within TripProvider")
  }
  return context
}
