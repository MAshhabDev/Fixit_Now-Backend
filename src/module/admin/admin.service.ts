import type { userStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
    include: { technician: true },
  });

  return result;
};

const getAllBookings = async () => {
  const result = await prisma.booking.findMany({
    include: {
      service: true,
      customer: {
        select: { name: true, email: true, phone: true },
      },
      technician: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      },
    },
  });

  return result;
};

const updateUserStatus = async (userId: string, status: userStatus) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      status,
      
    },
    omit: { password: true },
  });

  return result;
};

const verifyTechnician = async (id: string, isVerified: boolean) => {
  const result = await prisma.technician.update({
    where: {
      id
    },
    data: {
      isVerified, 
    },
  });
  return result;
};

export const adminService = { getAllUsers, getAllBookings, updateUserStatus ,verifyTechnician};
