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
const uploadAssignmentFile = async (filePath) => {
  return {
    url: `/uploads/assignments/${filePath.split('/').pop()}`,
    public_id: null,
    provider: 'local'
  };
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured || !publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    logger.success(`Video deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error('Cloudinary delete failed:', error.message);
  }
};

module.exports = {
  uploadVideo,
  uploadAssignmentFile,
  deleteFromCloudinary
};