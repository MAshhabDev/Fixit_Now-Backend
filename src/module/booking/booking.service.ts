import type { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (userId: string, payload: any) => {
  const { timeSlot, serviceAddress, technicianId, serviceId } = payload;
  const services = await prisma.service.findUniqueOrThrow({
    where: { id: payload.serviceId },
  });

  const result = await prisma.booking.create({
    data: {
      timeSlot,
      serviceAddress,
      totalAmount: services.price,
      customerId: userId,
      technicianId,
      serviceId,
    },
  });

  return result;
};

const getCustomerBooking = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      customerId: userId,
    },
    include: {
      service: true,
      technician: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  return result;
};

const getBookingDetails = async (id: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id },
    include: {
      service: true,
      technician: {
        include: { user: { select: { name: true, email: true } } },
      },
      customer: { select: { name: true, email: true } },
    },
  });

  if (role === "CUSTOMER" && booking.customerId !== userId) {
    throw new Error("You are not authorized to view this booking!");
  }

  if (role === "TECHNICIAN") {
    const technician = await prisma.technician.findUniqueOrThrow({
      where: { userId },
    });
    if (booking.technicianId !== technician.id) {
      throw new Error("You are not authorized to view this booking!");
    }
  }

  return booking;
};

export const bookingService = {
  createBooking,
  getCustomerBooking,
  getBookingDetails,
};
