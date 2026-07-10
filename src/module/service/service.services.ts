import { prisma } from "../../lib/prisma";
import type { ICreateService } from "./service.interface";

const createService = async (userId: string, payload: ICreateService) => {
  const { title, description, price, duration, categoryId } = payload;
  const user = await prisma.technician.findUniqueOrThrow({
    where: { userId },
  });

  const result = await prisma.service.create({
    data: {
      title,
      description,
      price: Number(price),
      duration,
      categoryId,
      technicianId: user.id,
    },
  });

  return result;
};

const getAllService = async (query: any) => {
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions: any[] = [];

  if (query.type) {
    andConditions.push({
      categoryId: query.type,
    });
  }

  if (query.location) {
    andConditions.push({
      technician: {
        location: {
          contains: query.location,
          mode: "insensitive",
        },
      },
    });
  }

  const services = await prisma.service.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    orderBy:
      sortBy !== "rating"
        ? {
            [sortBy]: sortOrder,
          }
        : undefined,
    include: {
      category: true,
      technician: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      bookings: {
        include: {
          review: true,
        },
      },
    },
  });

  for (const service of services as any[]) {
    let totalRating = 0;
    let reviewCount = 0;

    for (const booking of service.bookings) {
      if (booking.review) {
        totalRating = totalRating + booking.review.rating;
        reviewCount = reviewCount + 1;
      }
    }

    service.averageRating =
      reviewCount > 0 ? parseFloat((totalRating / reviewCount).toFixed(1)) : 0;
    service.totalReviews = reviewCount;
  }

  let filteredServices = services as any[];
  if (query.rating) {
    filteredServices = [];
    for (const service of services as any[]) {
      if (service.averageRating >= Number(query.rating)) {
        filteredServices.push(service);
      }
    }
  }

  if (sortBy === "rating") {
    filteredServices.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.averageRating - b.averageRating;
      } else {
        return b.averageRating - a.averageRating;
      }
    });
  }

  return filteredServices;
};

const updateService = async (id: string, userId: string, payload: any) => {
  const user = await prisma.technician.findUniqueOrThrow({
    where: { userId },
  });

  const service = await prisma.service.findUniqueOrThrow({
    where: { id },
  });

  if (service.technicianId !== user.id) {
    throw new Error("You are not authorized to update this service!");
  }

  const result = await prisma.service.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteService = async (id: string, userId: string) => {
  const user = await prisma.technician.findUniqueOrThrow({
    where: { userId },
  });

  const service = await prisma.service.findUniqueOrThrow({
    where: { id },
  });

  if (service.technicianId !== user.id) {
    throw new Error("You are not authorized to delete this service!");
  }

  const result = await prisma.service.delete({
    where: { id },
  });

  return result;
};

export const serviceServices = {
  createService,
  getAllService,
  updateService,
  deleteService,
};
