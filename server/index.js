import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import authRoutes from "./routes/authRoutes.js"
import tripRoutes from "./routes/tripRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import settlementRoutes from "./routes/settlements.js"
import budgetRoutes from "./routes/budget.js"
import notificationRoutes from "./routes/notifications.js"
import insuranceRoutes from "./routes/insurance.js"
import newAnalyticsRoutes from "./routes/analytics.js"
import itineraryRoutes from "./routes/itinerary.js"
import transportRoutes from "./routes/transport.js"
import accommodationRoutes from "./routes/accommodation.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(morgan("dev"))
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(200)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/trips", tripRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/settlements", settlementRoutes)
app.use("/api/budget", budgetRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/insurance", insuranceRoutes)
app.use("/api/dashboard", newAnalyticsRoutes)
app.use("/api/itinerary", itineraryRoutes)
app.use("/api/transport", transportRoutes)
app.use("/api/accommodation", accommodationRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status || 500,
  })
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
