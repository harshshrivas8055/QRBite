import Brevo from "@getbrevo/brevo"
//fix the brevo
export async function sendEmail({
  to,
  subject,
  html,
}) {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error(
        "Missing BREVO_API_KEY"
      )
    }

    const apiInstance =
      new Brevo.TransactionalEmailsApi()

    apiInstance.authentications["apiKey"].apiKey =
      process.env.BREVO_API_KEY

    const sendSmtpEmail = {
      subject,
      htmlContent: html,

      sender: {
        name:
          process.env.BREVO_SENDER_NAME ||
          "QRBite",

        email:
          process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email: to,
        },
      ],
    }

    const result =
      await apiInstance.sendTransacEmail(
        sendSmtpEmail
      )

    console.log(
      "✅ Email sent to:",
      to
    )

    return {
      success: true,
      result,
    }
  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error
    )

    throw new Error(error.message)
  }
}