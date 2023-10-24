import { Product } from "@/types/products";
import { User } from "@/types/user";
import crypto from "crypto";
import * as nodemailer from "nodemailer";
import { stripe } from "@/lib/stripe";

const EMAIL_FROM = process.env.EMAIL_FROM;

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export function generateUniqueToken(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

export const createConfirmationToken = () => {
  const confirmationToken = generateUniqueToken(32);
  const createdAt = new Date();

  return {
    token: confirmationToken,
    createdAt: createdAt,
  };
};

export const checkConfirmationToken = (user: any) => {
  const now = new Date();
  const tokenExpiration = new Date(user.create_time);
  tokenExpiration.setHours(tokenExpiration.getHours() + 24);

  return now < tokenExpiration;
};

export const sendEmail = async (
  to: string,
  first_name: string,
  url_confirmation: string
) => {
  try {
    const response = await transporter.sendMail({
      from: EMAIL_FROM,
      to: to,
      subject: "Confirmation instructions",
      html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <tr>
                <td align="center" style="padding: 20px;">
                    <img src="https://ricosaas.eu/static/screenshots/logo.png" alt="Rico Logo" width="150" style="display: block; margin: 0 auto;">
                    <h2 style="color: #333; margin-top: 20px;">Welcome to Rico</h2>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p>Welcome ${first_name}</p>
                    <p>Confirm your email by clicking the link below:</p>
                    <a href=${url_confirmation}>Confirm here</a>
                    <p>Thank you for choosing Rico!</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="background-color: #333; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
                    <p style="color: #fff; margin: 0;">© 2023 Rico. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </body>`,
    });
    return response?.messageId
      ? { ok: true }
      : { ok: false, msg: "Failed to send email" };
  } catch (error) {
    return { ok: false, msg: "Failed to send email" };
  }
};

export const parseProducts = async (products: any) => {
  const response = [];
  for (let i = 0; i < products.length; i++) {
    const details: Product = {
      id: "",
      name: "",
      description: "",
      features: [],
      price: 0,
    };
    const price = await stripe.prices.retrieve(products[i].default_price);
    details.id = products[i].id;
    details.name = products[i].name;
    details.description = products[i].description;
    details.features = products[i].features;
    details.price = price?.unit_amount / 100;
    details.line_items = products[i];
    response.push(details);
  }
  const sortedResponse = response.sort((a, b) => b.price - a.price).reverse();

  return sortedResponse;
};
