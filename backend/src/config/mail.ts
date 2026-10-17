import nodemailer from "nodemailer";
import { ENV } from "./env";

export const mailTransporter = nodemailer.createTransport({
  host: ENV.SMTP.HOST,
  port: ENV.SMTP.PORT,
  secure: ENV.SMTP.PORT === 465,
  auth: ENV.SMTP.USER ? {
    user: ENV.SMTP.USER,
    pass: ENV.SMTP.PASS,
  } : undefined,
});

