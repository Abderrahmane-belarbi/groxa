export type UserType = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  tokenVersion?: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
};

enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
