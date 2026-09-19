import bcrypt from "bcrypt";
import "dotenv/config";

import { prisma } from "../src/lib/prisma.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
}

const passwordHash = await bcrypt.hash(password, 12);

await prisma.user.upsert({
  where: { email },

  update: {},

  create: {
    email,
    passwordHash,
    role: "ADMIN",
  },
});

console.log("Admin user ready");
