import { Payment } from "./../../../generated/prisma/browser";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingEvent = await prisma.payment.findUnique({
    where: {
      stripeEventId: event.id,
    },
  });
  if (existingEvent) {
    console.log(`Event with ID ${event.id} already processed.`);
    return { message: "Event already processed" };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;
      if (!appointmentId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return { message: "Invalid session metadata" };
      }
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });
      if (!appointment) {
        console.error(`Appointment with ID ${appointmentId} not found`);
        return { message: "Appointment not found" };
      }
      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });
        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGateway: session as any,
          },
        });
      });
      console.log(
        `Payment for appointment ${appointmentId} updated to ${session.payment_status}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session ${session.id} expired`);
      break;
    }
    //  case "payment_intent.succeeded":
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(`Payment intent ${session.id} failed`);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Web Event ${event.id} processed successfully` };
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};
