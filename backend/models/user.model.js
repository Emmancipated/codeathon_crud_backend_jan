import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      allowNull: true,
    },
    facebookId: {
      type: String,
      allowNull: true,
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

export default User;
