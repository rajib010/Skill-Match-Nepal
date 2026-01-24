export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Skill Match";
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "development";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const NODE_ENV = process.env.NODE_ENV;

export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
export const GOOGLE_RECAPTCHA_SECRET_KEY = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

export const MAIL = {
  HOST: process.env.MAIL_HOST as string,
  PORT: parseInt(process.env.MAIL_PORT as string, 10),
  USERNAME: process.env.MAIL_USERNAME as string,
  PASSWORD: process.env.MAIL_PASSWORD as string,
  FROM_NAME: (process.env.MAIL_FROM_NAME || APP_NAME) as string,
  FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS as string,
};
