import type { bookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { IUpdate } from "./technician.interface";

const updateProfile = async (userId: string, payload: IUpdate) => {
  const { bio, skills, experience, rate, location, availability, categoryId } =
    payload;
  const result = await prisma.technician.upsert({
    where: {
      userId,
    },
    update: {
      bio,
      skills,
      experience,
      rate,
      location,
      availability,
      categoryId,
    },
    create: {
      bio,
      skills,
      experience,
      rate,
      location,
      availability,
      categoryId,
      userId,
    },
  });
  return result;
};
const updateAvailability = async (userId: string, availability: string) => {
  const isProfileExist = await prisma.technician.findUnique({
    where: { userId },
  });
  if (!isProfileExist) {
    throw new Error(
      "Please complete your profile first before updating availability.",
    );
  }
  const result = await prisma.technician.update({
    where: {
      userId,
    },
    data: {
      availability,
    },
  });
  return result;
};

const getTechnicianBooking = async (userId: string) => {
  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const result = await prisma.booking.findMany({
    where: {
      technicianId: technician.id,
    },
    include: {
      service: true,
      customer: { select: { name: true, email: true } },
    },
  });
  return result;
};
const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  status: bookingStatus,
) => {
  const technician = await prisma.technician.findUniqueOrThrow({
    where: { userId },
  });

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (technician.id !== booking.technicianId) {
    throw new Error("You are not authorized to update this booking status!");
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
  });

  return result;
};

const getAllTechnician = async (query: any) => {
  const { searchTerm, categoryId, location } = query;
  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { skills: { contains: searchTerm, mode: "insensitive" } },
        { bio: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }
  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }
  if (location) {
    andConditions.push({
      location: { contains: location, mode: "insensitive" },
    });
  }

  const result = await prisma.technician.findMany({
    where: { AND: andConditions },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      category: true,
    },
  });

  return result;
};

const getSingleTechnician = async (id: string) => {
  const result = await prisma.technician.findUniqueOrThrow({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true, phone: true },
      },
      services: true,
      category: true,
      reviews: {
        include: {
          customer: {
            select: { name: true }, 
          },
        },
      },
    },
  });

  return result;
};

export const technicianService = {
  updateProfile,
  updateAvailability,
  getTechnicianBooking,
  updateBookingStatus,
  getAllTechnician,
  getSingleTechnician
};
