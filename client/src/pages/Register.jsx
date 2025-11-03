"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPasswordError("")
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    const success = await register(name, email, password)
    if (success) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/90 to-slate-900/95" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <div className="text-2xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">✈️</span> TravelBudget
              </div>
            </button>
            <Link 
              to="/login" 
              className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className={`w-full max-w-lg transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎆</div>
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                Join TravelBudget
              </h1>
              <p className="text-white/80 text-lg">Start your smart travel journey today</p>
            </div>

            {(error || passwordError) && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 rounded-2xl text-center font-medium">
                {error || passwordError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a strong password"
                    className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-800 hover:from-purple-700 hover:via-blue-800 hover:to-blue-900 text-white font-black py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden mt-6"
              >
                <span className="relative z-10">
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></span>
                      Creating account...
                    </>
                  ) : (
                    "Create Account 🚀"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-white/80">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-purple-300 hover:text-purple-200 font-bold transition-colors duration-300 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
                  <span className="flex items-center gap-1">
                    🔒 Secure
                  </span>
                  <span className="flex items-center gap-1">
                    ⚡ Fast Setup
                  </span>
                  <span className="flex items-center gap-1">
                    💯 Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
