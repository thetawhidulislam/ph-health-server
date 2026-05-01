/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";

import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import catchAsync from "../../shared/catchAsync";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const result = "";

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
