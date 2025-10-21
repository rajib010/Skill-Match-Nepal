/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAIL } from "@/config";
import nodemailer, { Transporter } from "nodemailer";
import React from "react";

let transporter: Transporter | undefined;

type MailFrom = { name: string; address: string } | string;

export interface SendMailProps<T extends React.ComponentType<any>> {
  from?: MailFrom;
  to: string | string[];
  subject: string;
  content: string | { template: T; props: React.ComponentProps<T> };
}

export async function sendMail<T extends React.ComponentType<any>>(
  props: SendMailProps<T>,
) {
  const from = props.from
    ? props.from
    : { name: MAIL.FROM_NAME, address: MAIL.FROM_ADDRESS };

  // Next.js won't allow direct import so we use dynamic import
  const { renderToStaticMarkup } = await import("react-dom/server");

  const html =
    typeof props.content === "string"
      ? props.content
      : renderToStaticMarkup(
          React.createElement(props.content.template, props.content.props),
        );

  const mailOptions = {
    from,
    to: props.to,
    subject: props.subject,
    html,
  };

  try {
    await getConnection().sendMail(mailOptions);
  } catch (error) {
    console.error("Email send failed:", error);
    throw new CouldntSendEmailError("Failed to send email", error);
  }
}

function getConnection() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: MAIL.HOST,
      port: MAIL.PORT,
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: MAIL.USERNAME,
        pass: MAIL.PASSWORD,
      },
    });
  }

  return transporter;
}

export class CouldntSendEmailError extends Error {
  originalError: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = "CouldntSendEmailError";
    this.originalError = originalError;
  }
}
