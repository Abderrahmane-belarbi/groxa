import { Schema, models, model, InferSchemaType, Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"] },
    emailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    tokenVersion: { type: Number, default: 0 },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

  },
  { timestamps: true },
);

export type UserType = InferSchemaType<typeof userSchema>;
type UserModel = Model<UserType>;

export const User = (models.User as UserModel) || model('User', userSchema) 