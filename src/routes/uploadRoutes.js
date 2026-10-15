import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../utils/cloudinaryUploader.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @desc    Upload image to Cloudinary (supports multipart file or base64 JSON)
 * @route   POST /api/upload
 * @access  Public / Protected
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    let source;

    if (req.file) {
      source = req.file.buffer;
    } else if (req.body.image) {
      source = req.body.image;
    } else if (req.body.dataUrl) {
      source = req.body.dataUrl;
    }

    if (!source) {
      return res.status(400).json({
        success: false,
        message: 'No image provided. Please send a file or base64 data URL in the image field.',
      });
    }

    const folder = req.body.folder || 'barangay-emergency/evidence';
    const result = await uploadImage(source, folder);

    res.status(200).json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      cloudinaryEnabled: isCloudinaryConfigured() && !result.isFallback,
      message: result.isFallback
        ? 'Stored image directly without Cloudinary remote upload.'
        : 'Image successfully uploaded to Cloudinary',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
