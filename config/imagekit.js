const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Upload file to ImageKit
 * @param {Buffer} file - File buffer
 * @param {String} fileName - File name
 * @param {String} folder - Folder path (e.g., 'programs/events')
 * @returns {Promise} ImageKit upload response
 */
const uploadToImageKit = async (file, fileName, folder = 'programs/events') => {
    try {
        console.log('📤 Uploading to ImageKit:', fileName);
        console.log('   Folder:', folder);
        
        const response = await imagekit.upload({
            file: file, // Buffer or base64 string
            fileName: fileName,
            folder: folder,
            useUniqueFileName: true,
            tags: ['sasi', 'program', folder.split('/').pop()]
        });

        console.log('✅ ImageKit upload successful:');
        console.log('   fileId:', response.fileId);
        console.log('   filePath:', response.filePath);
        console.log('   url:', response.url);
        console.log('   url length:', response.url ? response.url.length : 0);
        console.log('   name:', response.name);

        // Ensure complete URL is saved (not truncated)
        return {
            success: true,
            fileId: response.fileId,
            filePath: response.filePath,
            url: response.url, // Complete URL from ImageKit
            thumbnailUrl: response.thumbnailUrl,
            name: response.name || fileName
        };
    } catch (error) {
        console.error('❌ ImageKit upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Delete file from ImageKit
 * @param {String} fileId - ImageKit file ID
 * @returns {Promise} Delete response
 */
const deleteFromImageKit = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
        return { success: true };
    } catch (error) {
        console.error('ImageKit delete error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get optimized image URL with transformations
 * @param {String} filePath - ImageKit file path
 * @param {Object} options - Transformation options
 * @returns {String} Transformed image URL
 */
const getOptimizedImageUrl = (filePath, options = {}) => {
    const {
        width = null,
        height = null,
        quality = 80,
        format = 'webp',
        aspectRatio = null,
        crop = null,
        focus = null
    } = options;

    const transformations = [];

    if (width) transformations.push(`w-${width}`);
    if (height) transformations.push(`h-${height}`);
    if (quality) transformations.push(`q-${quality}`);
    if (format) transformations.push(`f-${format}`);
    if (aspectRatio) transformations.push(`ar-${aspectRatio}`);
    if (crop) transformations.push(`c-${crop}`);
    if (focus) transformations.push(`fo-${focus}`);

    // Clean filePath (remove leading slash if present)
    const cleanFilePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Build URL with transformations properly structured
    // Format: https://ik.imagekit.io/endpoint/tr:w-400,q-80,f-webp/folder/image.png
    if (transformations.length > 0) {
        const transformString = `tr:${transformations.join(',')}`;
        const finalUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/${transformString}/${cleanFilePath}`;
        console.log('🖼️  Generated optimized URL:', finalUrl);
        return finalUrl;
    }
    
    // No transformations - return original URL
    const finalUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/${cleanFilePath}`;
    console.log('🖼️  Generated original URL:', finalUrl);
    return finalUrl;
};

/**
 * Get video URL (videos don't need webp transformation)
 * @param {String} filePath - ImageKit file path
 * @returns {String} Video URL
 */
const getVideoUrl = (filePath) => {
    // Clean filePath (remove leading slash if present)
    const cleanFilePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const finalUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/${cleanFilePath}`;
    console.log('🎥 Generated video URL:', finalUrl);
    return finalUrl;
};

/**
 * Generate multiple image sizes
 * @param {String} filePath - ImageKit file path
 * @returns {Object} Object with different size URLs
 */
const getResponsiveImages = (filePath) => {
    return {
        thumbnail: getOptimizedImageUrl(filePath, { width: 300, height: 200, crop: 'maintain_ratio' }),
        small: getOptimizedImageUrl(filePath, { width: 640 }),
        medium: getOptimizedImageUrl(filePath, { width: 1024 }),
        large: getOptimizedImageUrl(filePath, { width: 1920 }),
        original: getOptimizedImageUrl(filePath, { quality: 90 })
    };
};

module.exports = {
    imagekit,
    uploadToImageKit,
    deleteFromImageKit,
    getOptimizedImageUrl,
    getVideoUrl,
    getResponsiveImages
};
