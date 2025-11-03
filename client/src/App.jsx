import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { TripProvider } from "./context/TripContext"
import { NotificationProvider } from "./context/NotificationContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import TripsList from "./pages/TripsList"
import TripDetail from "./pages/TripDetail"
import Analytics from "./pages/Analytics"
import TripCollaboration from "./pages/TripCollaboration"
import ProtectedRoute from "./components/ProtectedRoute"
import Expenses from "./pages/Expenses"
import Members from "./pages/Members"
import Profile from "./pages/Profile"
import Reports from "./pages/Reports"
import Notifications from "./pages/Notifications"
import BudgetPlanner from "./pages/BudgetPlanner"
import Insurance from "./pages/Insurance"
import MapRoute from "./pages/MapRoute"
import Transport from "./pages/Transport"
import Accommodation from "./pages/Accommodation"
import Itinerary from "./pages/Itinerary"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <NotificationProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <TripsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trip/:tripId"
                element={
                  <ProtectedRoute>
                    <TripDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trip/:tripId/expenses"
                element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trip/:tripId/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/:tripId"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collaboration/:tripId"
                element={
                  <ProtectedRoute>
                    <TripCollaboration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget-planner"
                element={
                  <ProtectedRoute>
                    <BudgetPlanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insurance"
                element={
                  <ProtectedRoute>
                    <Insurance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map-route"
                element={
                  <ProtectedRoute>
                    <MapRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport"
                element={
                  <ProtectedRoute>
                    <Transport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accommodation"
                element={
                  <ProtectedRoute>
                    <Accommodation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/itinerary"
                element={
                  <ProtectedRoute>
                    <Itinerary />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </NotificationProvider>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
