/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";

import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import catchAsync from "../../shared/catchAsync";
import { envVars } from "../../../config/env";
import stripe from "../../../config/stripe.config";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return sendResponse(res, {
        httpStatusCode: status.BAD_REQUEST,
        success: false,
        message: "Missing Stripe signature or webhook secret",
      });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error) {
      console.error("Error constructing Stripe webhook event:", error);
      return sendResponse(res, {
        httpStatusCode: status.BAD_REQUEST,
        success: false,
        message: "Invalid Stripe webhook signature",
      });
    }
    try {
      const result = await PaymentService.handlerStripeWebhookEvent(event);

      sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      sendResponse(res, {
        httpStatusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error handling Stripe webhook event",
      });
    }
  },
);

export const PaymentController = {
  handleStripeWebhookEvent,
};
