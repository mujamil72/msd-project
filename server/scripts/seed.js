import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Trip from "../models/Trip.js"
import Expense from "../models/Expense.js"

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Trip.deleteMany({})
    await Expense.deleteMany({})
    console.log("Cleared existing data")

    const users = await User.create([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        passwordHash: "password123",
        baseCurrency: "USD",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        passwordHash: "password123",
        baseCurrency: "USD",
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        passwordHash: "password123",
        baseCurrency: "USD",
      },
    ])

    console.log("Created users")

    const trip = await Trip.create({
      owner: users[0]._id,
      name: "Paris & London Adventure",
      destination: "Europe",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-15"),
      totalBudget: 5000,
      currency: "USD",
      invitedUsers: [users[1]._id, users[2]._id],
      categories: [
        { name: "Accommodation", limit: 1500 },
        { name: "Food", limit: 1500 },
        { name: "Transport", limit: 1000 },
        { name: "Activities", limit: 500 },
        { name: "Miscellaneous", limit: 500 },
      ],
    })

    console.log("Created trip")

    const expenses = await Expense.create([
      {
        trip: trip._id,
        user: users[0]._id,
        category: "Accommodation",
        amount: 600,
        currency: "USD",
        date: new Date("2025-06-01"),
        description: "Hotel in Paris",
        payer: users[0]._id,
        splitBetween: [
          { user: users[0]._id, amount: 200 },
          { user: users[1]._id, amount: 200 },
          { user: users[2]._id, amount: 200 },
        ],
      },
      {
        trip: trip._id,
        user: users[1]._id,
        category: "Food",
        amount: 150,
        currency: "USD",
        date: new Date("2025-06-02"),
        description: "Dinner at local restaurant",
        payer: users[1]._id,
        splitBetween: [
          { user: users[0]._id, amount: 50 },
          { user: users[1]._id, amount: 50 },
          { user: users[2]._id, amount: 50 },
        ],
      },
      {
        trip: trip._id,
        user: users[2]._id,
        category: "Transport",
        amount: 300,
        currency: "USD",
        date: new Date("2025-06-03"),
        description: "Flight Paris to London",
        payer: users[2]._id,
        splitBetween: [
          { user: users[0]._id, amount: 100 },
          { user: users[1]._id, amount: 100 },
          { user: users[2]._id, amount: 100 },
        ],
      },
      {
        trip: trip._id,
        user: users[0]._id,
        category: "Activities",
        amount: 200,
        currency: "USD",
        date: new Date("2025-06-04"),
        description: "Museum tickets",
        payer: users[0]._id,
        splitBetween: [
          { user: users[0]._id, amount: 200 / 3 },
          { user: users[1]._id, amount: 200 / 3 },
          { user: users[2]._id, amount: 200 / 3 },
        ],
      },
    ])

    console.log("Created expenses")
    console.log("Seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedData()
