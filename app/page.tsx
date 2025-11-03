'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Stars, Users } from 'lucide-react';

const features = [
  {
    icon: "✈️",
    title: "Trip Management",
    description: "Create and manage multiple trips with custom budgets",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: "💰",
    title: "Expense Tracking",
    description: "Track all expenses by category with dates and descriptions",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: "📊",
    title: "Analytics",
    description: "Visualize spending patterns with detailed insights",
    color: "from-purple-500 to-pink-500"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                Trip Budget Planner
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                A full-stack application for managing travel expenses with friends. Track spending, split bills
                automatically, and get detailed analytics.
              </p>

              <div className="flex items-center justify-center gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 rounded-full transition-all duration-200"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 text-slate-300 mb-12">
                <div className="flex items-center gap-2">
                  <Stars className="h-5 w-5 text-yellow-500" />
                  <span>1.2k Stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>500+ Users</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 max-w-2xl mx-auto mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Project Structure</h2>

              <div className="text-left space-y-4">
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-semibold text-white mb-2">Backend Server</h3>
                  <p className="text-slate-300 text-sm">
                    Node.js + Express + MongoDB
                    <br />
                    Located in: <code className="bg-slate-900 px-2 py-1 rounded">/server</code>
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-semibold text-white mb-2">Frontend Application</h3>
                  <p className="text-slate-300 text-sm">
                    React + Vite + React Router
                    <br />
                    Located in: <code className="bg-slate-900 px-2 py-1 rounded">/client</code>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-slate-300">To run this application locally:</p>

              <div className="bg-slate-800 rounded-lg p-6 text-left max-w-2xl mx-auto">
                <code className="text-green-400 text-sm block mb-4">
                  <span className="block"># Install and start backend</span>
                  <span className="block">cd server && npm install && npm start</span>
                  <span className="block mt-2"># In another terminal, start frontend</span>
                  <span className="block">cd client && npm install && npm run dev</span>
                </code>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                  className="group relative overflow-hidden"
                >
                  <div className="bg-white/5 backdrop-blur border border-white/20 rounded-lg p-6 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                    <div className={`text-3xl mb-3 bg-gradient-to-r ${feature.color} bg-clip-text`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-12 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
              <div className="relative p-8 bg-white/5 backdrop-blur border border-white/20 rounded-xl max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
                <p className="text-slate-300 mb-6">
                  Join thousands of users who are already managing their trips efficiently with our platform.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 rounded-full transition-all duration-200"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}