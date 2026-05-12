const requiredEnvVars = [
  "MONGODB_URI",
  "AUTH_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
]

export function checkEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing
        .map((k) => `  - ${k}`)
        .join("\n")}\n\nPlease check your .env.local file.`
    )
  }
}