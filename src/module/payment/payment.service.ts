import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckOutSession = async (bookingId: string, userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
      include: { service: true },
    });

    if (booking.customerId !== userId) {
      throw new Error("You do not have access to pay for this booking!");
    }
    if (booking.status !== "ACCEPTED") {
      throw new Error("You can only pay for accepted bookings not others!");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: booking.service.title,
              description: booking.service.description,
            },
            unit_amount: booking.totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${config.app_url}/payment/success=true`,
      cancel_url: `${config.app_url}/payment/success=false`,
      metadata: { bookingId: booking.id, customerId: userId },
    });

    await tx.payment.upsert({
      where: {
        bookingId: booking.id,
      },
      create: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        transactionId: session.id,
        status: "PENDING",
      },
      update: {
        amount: booking.totalAmount,
        transactionId: session.id,
        status: "PENDING",
      },
    });
    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

export const paymentService = { createCheckOutSession };
