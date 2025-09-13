// lib/sendBrevoOTP.js
import Brevo from "@getbrevo/brevo";

const tranEmailApi = new Brevo.TransactionalEmailsApi();
tranEmailApi.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendBrevoOTP = async (to, otp) => {
  try {
    const email = {
      sender: { email: "schoolappdemo25@gmail.com", name: "SchoolApp Demo" },
      to: [{ email: to }],
      subject: "Your OTP Code",
      htmlContent: `<p>Your OTP code is <b>${otp}</b></p>`,
    };

    const response = await tranEmailApi.sendTransacEmail(email);
    console.log("Brevo response:", response);
    return response;
  } catch (error) {
    console.error("Brevo API error:", error.response?.body || error.message);
    throw new Error("Failed to send OTP via Brevo");
  }
};
