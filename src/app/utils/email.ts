import { At } from "./../../generated/prisma/internal/prismaNamespace";
import nodeMailer from "nodemailer";
import { envVars } from "../../config/env";
import AppError from "../errorHelper/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";
const transporter = nodeMailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASSWORD,
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName?: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contectType?: string;
  }[];
}
export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_USER,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contectType,
      })),
    });
    console.log(
      `Email Sent: ${info.messageId} to ${to} with subject ${subject} `,
    );
  } catch (error: any) {
    console.log("Email can't send ", error.messsage);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};
