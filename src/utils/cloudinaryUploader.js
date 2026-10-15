import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Upload an image (base64 string, URL, or Buffer) to Cloudinary.
 *
 * @param {string|Buffer} imageSource - Base64 Data URL, buffer, or file path
 * @param {string} folder - Target Cloudinary folder
 * @returns {Promise<{ url: string, publicId: string, isFallback: boolean }>}
 */
export const uploadImage = async (imageSource, folder = 'barangay-emergency/incidents') => {
  if (!imageSource) {
    return { url: '', publicId: '', isFallback: false };
  }

  // If it's already an HTTP / HTTPS URL
  if (typeof imageSource === 'string' && imageSource.startsWith('http')) {
    return { url: imageSource, publicId: '', isFallback: false };
  }

  if (!isCloudinaryConfigured()) {
    console.warn(
      '⚠️ [Cloudinary Notice]: Cloudinary credentials are not configured in .env. Storing raw data.'
    );
    return {
      url: typeof imageSource === 'string' ? imageSource : '',
      publicId: '',
      isFallback: true,
    };
  }

  try {
    // If it's a buffer (from Multer memoryStorage)
    if (Buffer.isBuffer(imageSource)) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary buffer upload error:', error);
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              isFallback: false,
            });
          }
        );
        uploadStream.end(imageSource);
      });
    }

    // If it's a base64 Data URI or file path string
    const result = await cloudinary.uploader.upload(imageSource, {
      folder,
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      isFallback: false,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error.message);
    return {
      url: typeof imageSource === 'string' ? imageSource : '',
      publicId: '',
      isFallback: true,
    };
  }
};

/**
 * Remove an image from Cloudinary by its publicId.
 */
export const deleteImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error.message);
  }
};
