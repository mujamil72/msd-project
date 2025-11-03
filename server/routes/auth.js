import express from "express"
import bcryptjs from "bcryptjs"
import User from "../models/User.js"
import { generateToken, authMiddleware } from "../middleware/auth.js"
import { body, validationResult } from "express-validator"

const router = express.Router()

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 }), body("name").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { email, password, name } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }

      const newUser = new User({
        name,
        email,
        passwordHash: password,
      })

      await newUser.save()
      const token = generateToken(newUser._id)

      res.status(201).json({
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
        token,
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
)

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

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
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
