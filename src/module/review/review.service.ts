import { prisma } from "../../lib/prisma";
import type { ICreateReview } from "./review.interface";

const createReview = async (userId: string, payload: ICreateReview) => {
  const { bookingId, rating, comment } = payload;

  if (!bookingId || rating === undefined || !comment) {
    throw new Error("bookingId, rating, and comment are required!");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5!");
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.customerId !== userId) {
    throw new Error("You are not authorized to review this booking!");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review completed bookings!");
  }

  const result = await prisma.review.create({
    data: {
      rating: Number(rating),
      comment,
      customerId: userId,
      technicianId: booking.technicianId,
      bookingId: booking.id,
    },
  });

  return result;
};

export const reviewService = {
  createReview,
};
