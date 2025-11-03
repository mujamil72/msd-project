import bcryptjs from "bcryptjs"
import User from "../models/User.js"
import { generateToken } from "../middleware/auth.js"

export const register = async (req, res) => {
  try {
    const { email, password, name, baseCurrency } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: password, // Let the pre-save hook handle hashing
      baseCurrency: baseCurrency || "USD",
    })

    await newUser.save()
    const token = generateToken(newUser._id)

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        baseCurrency: newUser.baseCurrency,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = generateToken(user._id)
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        baseCurrency: user.baseCurrency,
        avatarUrl: user.avatarUrl,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, baseCurrency, avatarUrl } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, baseCurrency, avatarUrl, updatedAt: new Date() },
      { new: true },
    ).select("-passwordHash")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)

    const isPasswordValid = await bcryptjs.compare(oldPassword, user.passwordHash)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    user.passwordHash = await bcryptjs.hash(newPassword, 10)
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
