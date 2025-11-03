"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic cursor effect */}
      <div 
        className="fixed w-6 h-6 bg-blue-400/30 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(1)'
        }}
      />
      
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-20000 ease-linear"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2835&q=80')`,
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-blue-900/95" />
        
        {/* Enhanced animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }} />
        
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



      {/* Enhanced Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className={`transition-all duration-1500 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 animate-pulse">
                ✨ Smart Travel Finance
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white text-transparent bg-clip-text drop-shadow-2xl">
                Plan Your Trip,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-pulse">
                Split the Costs
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/95 mb-8 sm:mb-10 leading-relaxed drop-shadow-lg font-light">
              Travel with friends without the financial hassle. Track expenses, split bills automatically, and get
              detailed analytics of who owes whom.
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 mb-10">
              {['💰 Smart Splitting', '📊 Real-time Analytics', '🌍 Multi-currency'].map((feature, i) => (
                <span key={i} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  {feature}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {user ? (
                <button
                  onClick={() => navigate("/trips")}
                  className="group bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm relative overflow-hidden"
                >
                  <span className="relative z-10">My Trips 🚀</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="group bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm relative overflow-hidden"
                  >
                    <span className="relative z-10">Get Started Free 🚀</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 backdrop-blur-sm hover:shadow-xl"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className={`hidden lg:block transition-all duration-1500 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="relative group">
              {/* Main image card */}
              <div 
                className="rounded-3xl overflow-hidden shadow-2xl transform rotate-2 group-hover:rotate-0 transition-all duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '500px'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">💰</div>
                      <div>
                        <p className="text-white font-bold text-xl">Smart Travel Budgeting</p>
                        <p className="text-white/80 text-sm">Track • Split • Analyze</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-white font-bold text-lg">$2.5M+</div>
                        <div className="text-white/70 text-xs">Managed</div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">50K+</div>
                        <div className="text-white/70 text-xs">Trips</div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">98%</div>
                        <div className="text-white/70 text-xs">Happy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl animate-bounce shadow-xl">
                📊
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-xl animate-pulse shadow-xl">
                ✈️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center drop-shadow-lg">Why Choose TravelBudget?</h2>
          <p className="text-white/90 text-center mb-16 text-lg drop-shadow">
            Everything you need to manage travel expenses with friends
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: '💰',
                title: 'Smart Expense Tracking',
                description: 'Record every expense with category tags, attach receipts, and track spending patterns across your trips.',
                gradient: 'from-blue-500 to-cyan-500',
                delay: '0s'
              },
              {
                icon: '👥',
                title: 'Easy Bill Splitting',
                description: 'Split bills equally or customize amounts. Our algorithm automatically calculates who owes whom, minimizing transactions.',
                gradient: 'from-purple-500 to-pink-500',
                delay: '0.2s'
              },
              {
                icon: '📊',
                title: 'Detailed Analytics',
                description: 'View spending by category, timeline trends, per-person contributions, and forecast remaining budget.',
                gradient: 'from-emerald-500 to-teal-500',
                delay: '0.4s'
              },
              {
                icon: '🌍',
                title: 'Multi-Currency Support',
                description: 'Automatically convert between currencies with live exchange rates. Track expenses in any currency globally.',
                gradient: 'from-orange-500 to-red-500',
                delay: '0.6s'
              },
              {
                icon: '🤝',
                title: 'Invite & Collaborate',
                description: 'Invite friends to trips with secure links. Real-time updates keep everyone in sync about expenses and budget.',
                gradient: 'from-indigo-500 to-purple-500',
                delay: '0.8s'
              },
              {
                icon: '📱',
                title: 'Plan Ahead',
                description: 'Create itineraries with estimated costs, build to-do checklists, and stay organized before, during, and after trips.',
                gradient: 'from-green-500 to-emerald-500',
                delay: '1s'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-white/30 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl animate-fade-in-up`}
                style={{ animationDelay: feature.delay }}
              >
                <div className={`text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.gradient} bg-opacity-20 inline-block group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 drop-shadow group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
                <div className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-6 drop-shadow-2xl">
            Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Thousands</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join the community of smart travelers who've revolutionized their group expense management
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { number: '25K+', label: 'Active Users', icon: '👥', color: 'from-blue-400 to-cyan-400' },
              { number: '100K+', label: 'Trips Planned', icon: '✈️', color: 'from-purple-400 to-pink-400' },
              { number: '$10M+', label: 'Money Managed', icon: '💰', color: 'from-emerald-400 to-teal-400' },
              { number: '99%', label: 'Satisfaction', icon: '⭐', color: 'from-yellow-400 to-orange-400' }
            ].map((stat, index) => (
              <div key={index} className="group transform hover:scale-110 transition-all duration-500 hover:-translate-y-2">
                <div className={`text-4xl mb-4 p-4 rounded-2xl bg-gradient-to-r ${stat.color} bg-opacity-20 inline-block group-hover:scale-125 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className={`text-6xl font-black mb-3 bg-gradient-to-r ${stat.color} text-transparent bg-clip-text drop-shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <p className="text-white/90 font-semibold text-lg group-hover:text-white transition-colors duration-300">{stat.label}</p>
                <div className={`mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500 mx-auto`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-32">
        <div 
          className="relative bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-purple-900/90 to-pink-900/95" />
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }} />
          
          <div className="relative max-w-6xl mx-auto px-4 text-center py-20">
            <div className="mb-8">
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                🎉 Join the Revolution
              </span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
              Ready to Travel 
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text animate-pulse">
                Smarter?
              </span>
            </h2>
            
            <p className="text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Join thousands of travelers who've eliminated financial stress from their group adventures. 
              Start your journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              {user ? (
                <button
                  onClick={() => navigate("/trips")}
                  className="group bg-gradient-to-r from-white via-blue-50 to-white text-blue-600 hover:from-blue-50 hover:via-white hover:to-blue-50 px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10">Go to Dashboard 🚀</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="group bg-gradient-to-r from-white via-blue-50 to-white text-blue-600 hover:from-blue-50 hover:via-white hover:to-blue-50 px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl relative overflow-hidden"
                  >
                    <span className="relative z-10">Start Free Today 🚀</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="border-3 border-white/50 hover:border-white text-white hover:bg-white/10 px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 backdrop-blur-sm hover:shadow-2xl"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold">Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold">Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💯</span>
                <span className="font-semibold">100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-black/70 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-4xl font-bold text-white drop-shadow-lg mb-4">
                <span className="text-5xl">✈️</span> TravelBudget
              </div>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Making group travel expenses simple, fair, and stress-free for everyone.
              </p>
            </div>
            
            <div className="flex justify-center items-center gap-8 mb-8">
              {['Privacy', 'Terms', 'Support', 'About'].map((link, i) => (
                <button key={i} className="text-white/60 hover:text-white transition-colors duration-300 font-medium">
                  {link}
                </button>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/60">© 2025 TravelBudget. All rights reserved.</p>
              <p className="mt-2 text-sm text-white/40">Built with ❤️ for travelers worldwide</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
