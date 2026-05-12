import { Geist } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { APP_NAME } from "@/lib/constants"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: APP_NAME,
  description: "QR Menu Ordering System for Restaurants",
}

export default async function RootLayout({ children }) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={geist.className}>
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                fontSize: "14px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}