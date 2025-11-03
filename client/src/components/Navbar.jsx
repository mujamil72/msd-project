"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Don't show navbar on home, login, or register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null
  }

  const isHomePage = location.pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isHomePage 
        ? 'bg-transparent' 
        : 'bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-3 group"
            >
              <div className={`text-3xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                isHomePage ? 'text-white' : 'text-white'
              }`}>
                <span className="text-4xl animate-bounce">✈️</span> TravelBudget
              </div>
            </button>
            {user && (
              <div className="hidden md:flex gap-6">
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/10 ${
                    location.pathname === '/dashboard' 
                      ? 'text-blue-300 bg-white/10' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/trips")}
                  className={`font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/10 ${
                    location.pathname === '/trips' 
                      ? 'text-blue-300 bg-white/10' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Trips
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    onClick={() => navigate("/profile")} 
                    className="text-white/90 hover:text-white font-medium transition-colors duration-300"
                  >
                    {user.name}
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate("/login")} 
                  className="text-white/90 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-full hover:bg-white/10"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-xl backdrop-blur-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
