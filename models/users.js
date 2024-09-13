const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: Number,
    },
    DOB: {
      type: Date,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["BUYER", "SELLER"],
      default: "BUYER",
      required: true,
    },
    buyerProfile: {
      favourites: [
        {
          type: Schema.Types.ObjectId,
          ref: "Products", // reference to the Product model
        },
      ],
      wishlist: [
        {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
      ],
      orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    sellerProfile: {
      businessName: {
        type: String,
      },
      orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

      products: [
        {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
      ],
      status: {
        type: String,
        enum: ["VERIFIED", "PENDING", "REJECTED"],
        default: "PENDING",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// Define instance method to compare password
userSchema.methods.comparePassword = function (password) {
  const userProvidedHash = createHmac("sha256", this.salt)
    .update(password)
    .digest("hex");

  return this.password === userProvidedHash;
};

// Define instance method to generate auth token
userSchema.methods.generateAuthToken = function () {
  return createTokenForUser(this);
};

userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.comparePassword(password)) throw new Error("Incorrect credentials");

  const token = createTokenForUser(user);
  console.log("token userLogin:", token);
  return { token };
};

const User = model("User", userSchema);

module.exports = User;
