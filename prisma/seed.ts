import { prisma } from "../src/lib/prisma";


async function runSeed() {

  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.category.createMany({
    data: [
      { name: "Plumbing", description: "Fixed The pipe" },
      { name: "Electrical", description: "FIxed the electric wire" },
      { name: "Cleaning", description: "Clean The House" },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gmail.com",
      password: "12345", 
      phone: "01711122233",
      role: "ADMIN",
    },
  });

}

runSeed();