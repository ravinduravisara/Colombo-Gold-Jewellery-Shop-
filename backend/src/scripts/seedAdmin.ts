import mongoose from "mongoose";
import { User } from "../modules/users/user.model";
import { ENV } from "../config/env";
import { connectDatabase } from "../config/database";

export const seedAdmin = async () => {
  console.log("🌱 Seeding / Synchronizing Super Administrator...");

  const targetEmail = (process.argv[2] || ENV.INITIAL_SUPERADMIN.EMAIL).toLowerCase();
  const targetPassword = process.argv[3] || ENV.INITIAL_SUPERADMIN.PASSWORD;

  let user = await User.findOne({ email: targetEmail });
  if (user) {
    user.password = targetPassword;
    user.role = "superadmin";
    user.isActive = true;
    await user.save();
    console.log(`✅ Super Admin '${targetEmail}' password updated to: ${targetPassword}`);
    return user;
  }

  user = await User.create({
    name: ENV.INITIAL_SUPERADMIN.NAME,
    email: targetEmail,
    password: targetPassword,
    phone: ENV.INITIAL_SUPERADMIN.PHONE,
    role: "superadmin",
    isActive: true,
  });

  console.log(`✅ Super Admin created: ${user.email} with password: ${targetPassword}`);
  return user;
};

if (require.main === module) {
  connectDatabase()
    .then(async () => {
      await seedAdmin();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error seeding admin:", err);
      process.exit(1);
    });
}
