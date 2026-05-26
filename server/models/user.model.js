const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const auditSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    id: { type: String, index: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    mobile: {
      type: String,
      trim: true,
      match: /^[0-9]{10}$/,
      unique: true,
      sparse: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "traveller", "admin", "superadmin", "support"],
      default: "traveller",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "deleted"],
      default: "active",
      index: true,
    },
    checkout: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "checkouts",
      },
    ],
    order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
      },
    ],
    audit: auditSchema,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("users", userSchema);

module.exports = User;
