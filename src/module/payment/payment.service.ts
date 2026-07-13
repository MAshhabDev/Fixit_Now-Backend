import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckOutSession = async (bookingId: string, userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await prisma.booking.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: { service: true },
    });

    if (booking.customerId !== userId) {
  throw new Error("You do not have access to pay for this booking!");
}
if (booking.status !== "ACCEPTED") {
  throw new Error("You can only pay for accepted bookings!");
}

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_key,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: "",
      cancel_url: "",
      metadata: { bookingId: booking.id, customerId: userId },
    });
  });
};

export const paymentService = { createCheckOutSession };
