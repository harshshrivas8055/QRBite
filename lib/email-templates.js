import { APP_NAME } from "./constants"

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 520px;
  margin: 0 auto;
  background: #ffffff;
`

const headerStyle = `
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 32px 40px;
  border-radius: 12px 12px 0 0;
  text-align: center;
`

const bodyStyle = `
  padding: 40px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 12px 12px;
`

const btnStyle = `
  display: inline-block;
  background: #1a1a1a;
  color: #ffffff !important;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  margin: 24px 0;
`

const footerStyle = `
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 12px;
`

export function verifyEmailTemplate({ name, verifyUrl }) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
          🍽️ ${APP_NAME}
        </h1>
        <p style="color: #9ca3af; margin: 8px 0 0; font-size: 14px;">
          QR Menu Ordering System
        </p>
      </div>

      <div style="${bodyStyle}">
        <h2 style="color: #111827; font-size: 22px; margin: 0 0 8px;">
          Verify your email ✉️
        </h2>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
          Hi <strong style="color: #111827;">${name}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
          Thanks for registering your restaurant on ${APP_NAME}! 
          Please verify your email address to activate your account.
        </p>

        <div style="text-align: center;">
          <a href="${verifyUrl}" style="${btnStyle}">
            Verify Email Address
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center;">
          This link expires in <strong>24 hours</strong>.
          <br/>If you did not register, please ignore this email.
        </p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 24px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">
            Or copy and paste this URL:
          </p>
          <p style="color: #374151; font-size: 12px; word-break: break-all; margin: 0;">
            ${verifyUrl}
          </p>
        </div>
      </div>

      <div style="${footerStyle}">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        <p style="margin: 4px 0 0;">You received this email because you registered on ${APP_NAME}.</p>
      </div>
    </div>
  `
}

export function forgotPasswordTemplate({ name, resetUrl }) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
          🍽️ ${APP_NAME}
        </h1>
        <p style="color: #9ca3af; margin: 8px 0 0; font-size: 14px;">
          QR Menu Ordering System
        </p>
      </div>

      <div style="${bodyStyle}">
        <h2 style="color: #111827; font-size: 22px; margin: 0 0 8px;">
          Reset your password 🔐
        </h2>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
          Hi <strong style="color: #111827;">${name}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password for your ${APP_NAME} account.
          Click the button below to set a new password.
        </p>

        <div style="text-align: center;">
          <a href="${resetUrl}" style="${btnStyle}">
            Reset Password
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center;">
          This link expires in <strong>1 hour</strong>.
          <br/>If you did not request a password reset, please ignore this email.
        </p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 24px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">
            Or copy and paste this URL:
          </p>
          <p style="color: #374151; font-size: 12px; word-break: break-all; margin: 0;">
            ${resetUrl}
          </p>
        </div>
      </div>

      <div style="${footerStyle}">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        <p style="margin: 4px 0 0;">If you did not request this, please secure your account immediately.</p>
      </div>
    </div>
  `
}

export function welcomeEmailTemplate({ name, restaurantName }) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
          🍽️ ${APP_NAME}
        </h1>
        <p style="color: #9ca3af; margin: 8px 0 0; font-size: 14px;">
          QR Menu Ordering System
        </p>
      </div>

      <div style="${bodyStyle}">
        <h2 style="color: #111827; font-size: 22px; margin: 0 0 8px;">
          Welcome to ${APP_NAME}! 🎉
        </h2>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
          Hi <strong style="color: #111827;">${name}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
          Your restaurant <strong style="color: #111827;">${restaurantName}</strong> 
          has been successfully registered and your email is verified!
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
            🚀 Get started:
          </p>
          <ul style="color: #15803d; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
            <li>Add your menu categories and items</li>
            <li>Create tables and download QR codes</li>
            <li>Share QR codes with your customers</li>
            <li>Receive and manage orders live</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${btnStyle}">
            Go to Dashboard
          </a>
        </div>
      </div>

      <div style="${footerStyle}">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </div>
  `
}