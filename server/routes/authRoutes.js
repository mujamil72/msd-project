import express from "express"
import { body, validationResult } from "express-validator"
import { register, login, getProfile, updateProfile, changePassword } from "../controllers/authController.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 }), body("name").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    register(req, res)
  },
)

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  login(req, res)
})

router.get("/profile", authMiddleware, getProfile)
router.put("/profile", authMiddleware, updateProfile)
router.post("/change-password", authMiddleware, changePassword)

export default router
