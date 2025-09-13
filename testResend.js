import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: "SchoolApp <onboarding@resend.dev>",
      to: "yourrealmail@gmail.com",
      subject: "Hello from test",
      text: "This is a test email",
    });
    console.log("Email sent:", data);
  } catch (err) {
    console.error("Resend error:", err);
  }
}

testEmail();
