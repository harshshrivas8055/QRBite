import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
export const runtime = "nodejs"
export async function uploadImage(file, folder = "restaurant-qr-saas") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    })
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    throw new Error(`Image delete failed: ${error.message}`)
  }
}

export default cloudinary