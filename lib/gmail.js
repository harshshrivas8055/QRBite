import * as Brevo from "@getbrevo/brevo"

export async function sendEmail({ to, subject, html }) {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("Missing BREVO_API_KEY in environment variables fix it")
    }

    const apiInstance = new Brevo.TransactionalEmailsApi()

    apiInstance.authentications["apiKey"].apiKey =
      process.env.BREVO_API_KEY

    const sendSmtpEmail = new Brevo.SendSmtpEmail()

    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html
    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || "QRBite",
      email: process.env.BREVO_SENDER_EMAIL,
    }
    sendSmtpEmail.to = [{ email: to }]

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log("✅ Email sent to:", to, "| MessageId:", result?.messageId)
    return { success: true, messageId: result?.messageId }
  } catch (error) {
    console.error("❌ Email send failed:", error.message)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function sendEmail({ to, subject, html }) {
//   try {
//     if (!process.env.RESEND_API_KEY) {
//       throw new Error(
//         "Missing RESEND_API_KEY in environment variables"
//       )
//     }

//     const { data, error } = await resend.emails.send({
//       from: "QRBite <onboarding@resend.dev>",
//       to,
//       subject,
//       html,
//     })

//     if (error) {
//       throw new Error(error.message)
//     }

//     console.log("✅ Email sent to:", to, "| ID:", data?.id)
//     return { success: true, messageId: data?.id }
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message)
//     throw new Error(`Failed to send email: ${error.message}`)
//   }
// }

//my  password generate  
// import nodemailer from "nodemailer"

// function createTransporter() {
//   return nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,

//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_APP_PASSWORD,
//     },

//     tls: {
//       rejectUnauthorized: false,
//     },

//     connectionTimeout: 60000,
//     greetingTimeout: 30000,
//     socketTimeout: 60000,
//   })
// }

// export async function sendEmail({
//   to,
//   subject,
//   html,
// }) {
//   try {
//     const transporter = createTransporter()

//     await transporter.verify()

//     console.log("✅ SMTP connected")

//     const result = await transporter.sendMail({
//       from: `QRBite <${process.env.GMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     })

//     console.log("✅ Email sent:", result.messageId)

//     return result
//   } catch (error) {
//     console.error("❌ Email send failed:", error)

//     throw error
//   }
// }



// import nodemailer from "nodemailer"

// function createTransporter() {
//   if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
//     throw new Error(
//       "Missing Gmail credentials. Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env.local"
//     )
//   }

//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_APP_PASSWORD,
//     },
//   })
// }

// export async function sendEmail({ to, subject, html }) {
//   try {
//     const transporter = createTransporter()

//     const result = await transporter.sendMail({
//       from: `QRBite <${process.env.GMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     })

//     console.log("✅ Email sent to:", to, "| MessageId:", result.messageId)
//     return { success: true, messageId: result.messageId }
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message)
//     throw new Error(`Failed to send email: ${error.message}`)
//   }
// }



//my gmail api 
// import nodemailer from "nodemailer"
// import { google } from "googleapis"

// const OAuth2 = google.auth.OAuth2

// function createTransporter() {
//   const oauth2Client = new OAuth2(
//     process.env.GMAIL_CLIENT_ID,
//     process.env.GMAIL_CLIENT_SECRET,
//     "https://developers.google.com/oauthplayground"
//   )

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GMAIL_REFRESH_TOKEN,
//   })

//   return new Promise(async (resolve, reject) => {
//     try {
//       const accessToken = await oauth2Client.getAccessToken()

//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           type: "OAuth2",
//           user: process.env.GMAIL_USER,
//           clientId: process.env.GMAIL_CLIENT_ID,
//           clientSecret: process.env.GMAIL_CLIENT_SECRET,
//           refreshToken: process.env.GMAIL_REFRESH_TOKEN,
//           accessToken: accessToken.token,
//         },
//       })

//       resolve(transporter)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

// export async function sendEmail({ to, subject, html }) {
//   try {
//     const transporter = await createTransporter()

//     const mailOptions = {
//       from: `QRBite <${process.env.GMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log("✅ Email sent to:", to)
//     return { success: true, messageId: result.messageId }
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message)
//     throw new Error(`Failed to send email: ${error.message}`)
//   }
// }