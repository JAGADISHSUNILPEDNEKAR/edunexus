// Upload service for Cloudinary integration with local fallback
// spec: see FullStackProject-Sem3_33099103.pdf

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const logger = require('../utils/logger');

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  logger.success('Cloudinary configured');
} else {
  logger.warn('Cloudinary not configured, using local file storage');
}

// Upload video to Cloudinary or return local path
const uploadVideo = async (filePath) => {
  if (!isCloudinaryConfigured) {
    // Return local file path
    return {
      url: `/uploads/videos/${filePath.split('/').pop()}`,
      public_id: null,
      provider: 'local'
    };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'edunexus/videos',
      chunk_size: 6000000 // 6MB chunks
    });

    // Delete local file after successful upload
    fs.unlinkSync(filePath);

    logger.success(`Video uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      provider: 'cloudinary'
    };
  } catch (error) {
    logger.error('Cloudinary upload failed, using local storage:', error.message);

    // Fallback to local storage
    return {
      url: `/uploads/videos/${filePath.split('/').pop()}`,
      public_id: null,
      provider: 'local'
    };
  }
};

// Upload assignment file (local only)
// Upload assignment file
const uploadAssignmentFile = async (filePath) => {
  if (!isCloudinaryConfigured) {
    // Return local file path
    return {
      url: `/uploads/assignments/${filePath.split('/').pop()}`,
      public_id: null,
      provider: 'local'
    };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw', // Force raw for documents to avoid image transformation issues
      folder: 'edunexus/assignments',
      use_filename: true,
      unique_filename: true
    });

    // Delete local file after successful upload
    fs.unlinkSync(filePath);

    logger.success(`Assignment uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      provider: 'cloudinary'
    };
  } catch (error) {
    logger.error('Cloudinary upload failed, using local storage:', error.message);

    // Fallback to local storage
    return {
      url: `/uploads/assignments/${filePath.split('/').pop()}`,
      public_id: null,
      provider: 'local'
    };
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured || !publicId) {
    return;
  }

  try {
    // Determine resource type based on publicId or assume video if not specified
    // For now, we'll try both if one fails, or just default to video as it was
    // The previous code only handled video. We should make it flexible.

    // Attempt to delete as video first (legacy behavior for videos)
    let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

    // If not found, try as raw (for assignments)
    if (result.result === 'not found') {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    // If still not found, try as image (just in case)
    if (result.result === 'not found') {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }

    logger.success(`File deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error('Cloudinary delete failed:', error.message);
  }
};

module.exports = {
  uploadVideo,
  uploadAssignmentFile,
  deleteFromCloudinary
};