import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (cloud_name && api_key && api_secret) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
} else if (process.env.CLOUDINARY_URL) {
  // Cloudinary SDK automatically parses process.env.CLOUDINARY_URL when config() is called
  cloudinary.config(true);
}

/**
 * Checks whether all required Cloudinary credentials are provided.
 */
export const isCloudinaryConfigured = () => {
  const currentConfig = cloudinary.config();
  return Boolean(currentConfig.cloud_name && currentConfig.api_key && currentConfig.api_secret);
};

export default cloudinary;
