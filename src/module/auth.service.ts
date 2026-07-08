import { config } from "../config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

const createUser = async (payload: any) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone || !role) {
    throw new Error("Please Input The Field Properly");
  }

  if (!email.includes("@")) {
    throw new Error("Please provide a valid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const userExist = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const hashPass = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPass,
      phone,
      role,
    },
  });

  if (role === "TECHNICIAN") {
    const crateTechnician = await prisma.technician.create({
      data: {
        userId: createUser.id,
        category: "Not Specified",
        skills: "",
        experience: 0,
        bio: "",
        rate: "",
        location: "",
        availability: "Not Set",
      },
    });
  }

  //   const user = await prisma.user.findUniqueOrThrow({
  //     where: {
  //       id: userData.id,
  //       email: userData.email,
  //     },
  //     include: {
  //       User: true,
  //     },
  //   });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email,
    },
    include:{
        technician:true
    },
    omit: {
      password: true,
    },
  });

  return user;
};
const logInUser = async () => {};

export const authService = { createUser, logInUser };
