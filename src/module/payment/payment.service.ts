import Stripe from "stripe";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { paymentUtils } from "./payment.utils";

const createCheckOutSession = async (bookingId: string, userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: bookingId },
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
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.service.title,
              description:
                booking.service.description || "Service Booking Payment",
            },
            unit_amount: booking.totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${config.app_url}/payment?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { bookingId: booking.id, customerId: userId },
    });

    await tx.payment.upsert({
      where: { bookingId: booking.id },
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

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  if (!endpointSecret) {
    throw new Error("Stripe Webhook Secret is missing in config file!");
  }

  const event: Stripe.Event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await paymentUtils.handleCheckoutSessionCompleted(session);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await paymentUtils.handleCheckoutSessionExpired(session);
      break;
    }

    default:
  }
};

const getPaymentHistory = async (userId: string, role: string) => {
  const whereConditions: any = {};

  if (role === "CUSTOMER") {
    whereConditions.booking = { customerId: userId };
  } else if (role === "TECHNICIAN") {
    const technician = await prisma.technician.findUniqueOrThrow({
      where: { userId },
    });
    whereConditions.booking = { technicianId: technician.id };
  }

  const result = await prisma.payment.findMany({
    where: whereConditions,
    include: {
      booking: {
        include: {
          service: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getPaymentDetails = async (
  paymentId: string,
  userId: string,
  role: string,
) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          service: true,
          customer: { select: { name: true, email: true, phone: true } },
          technician: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
            },
          },
        },
      },
    },
  });

  if (role === "CUSTOMER" && payment.booking.customerId !== userId) {
    throw new Error("You are not authorized to view this payment!");
  }

  if (role === "TECHNICIAN") {
    const technician = await prisma.technician.findUniqueOrThrow({
      where: { userId },
    });
    if (payment.booking.technicianId !== technician.id) {
      throw new Error("You are not authorized to view this payment!");
    }
  }

  return payment;
};

export const paymentService = {
  createCheckOutSession,
  handleWebhook,
  getPaymentHistory,
  getPaymentDetails,
};
