import type Stripe from "stripe";
import { prisma } from "../../lib/prisma";

const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUniqueOrThrow({
      where: { transactionId: session.id },
    });

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS" },
    });

    // Update booking status to PAID
    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: "PAID" },
    });
  });

};

const handleCheckoutSessionExpired = async (session: Stripe.Checkout.Session) => {
  await prisma.payment.update({
    where: { transactionId: session.id },
    data: { status: "FAILED" },
  });

};

export const paymentUtils = {
  handleCheckoutSessionCompleted,
  handleCheckoutSessionExpired,
};
