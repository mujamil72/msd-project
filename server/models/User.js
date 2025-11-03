import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  baseCurrency: {
    type: String,
    default: "USD",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next()
  try {
    const salt = await bcryptjs.genSalt(12)
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt)
    next()
  } catch (error) {
    next(error)
  }
})

export default mongoose.model("User", UserSchema)
