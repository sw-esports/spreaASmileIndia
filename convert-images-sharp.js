const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
    sourceDir: './public/src/images',
    quality: 85,
    keepOriginals: true, // Set to false to delete original files after conversion
    supportedFormats: ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'],
    webpOptions: {
        quality: 85,
        effort: 4, // 0-6, higher = better compression but slower
        lossless: false
    }
};

class ImageConverter {
    constructor() {
        this.stats = {
            totalFiles: 0,
            converted: 0,
            skipped: 0,
            failed: 0,
            originalSize: 0,
            webpSize: 0,
            errors: []
        };
    }

    // Get file size in bytes
    async getFileSize(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch (error) {
            return 0;
        }
    }

    // Check if file is a supported image format
    isSupportedImage(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return config.supportedFormats.includes(ext);
    }

    // Get all image files recursively
    async getAllImageFiles(dir) {
        const files = [];
        
        try {
            const items = await fs.readdir(dir, { withFileTypes: true });
            
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                
                if (item.isDirectory()) {
                    // Recursively get files from subdirectories
                    const subFiles = await this.getAllImageFiles(fullPath);
                    files.push(...subFiles);
                } else if (item.isFile() && this.isSupportedImage(fullPath)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error.message);
        }
        
        return files;
    }

    // Convert a single image to WebP
    async convertImage(inputPath) {
        const ext = path.extname(inputPath);
        const webpPath = inputPath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
        
        try {
            // Check if WebP file already exists and is newer
            try {
                const inputStats = await fs.stat(inputPath);
                const webpStats = await fs.stat(webpPath);
                
                if (webpStats.mtime > inputStats.mtime) {
                    console.log(`⚠ Skipping ${path.basename(inputPath)} (WebP already exists and is newer)`);
                    this.stats.skipped++;
                    this.stats.webpSize += await this.getFileSize(webpPath);
                    return true;
                }
            } catch (error) {
                // WebP file doesn't exist, continue with conversion
            }

            // Get original file size
            const originalSize = await this.getFileSize(inputPath);
            this.stats.originalSize += originalSize;

            // Convert to WebP using Sharp
            await sharp(inputPath)
                .webp(config.webpOptions)
                .toFile(webpPath);

            // Get converted file size
            const webpSize = await this.getFileSize(webpPath);
            this.stats.webpSize += webpSize;

            // Calculate size reduction
            const reduction = originalSize > 0 ? ((originalSize - webpSize) / originalSize * 100).toFixed(2) : 0;
            
            console.log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(webpPath)} (${reduction}% smaller)`);

            // Remove original file if configured to do so
            if (!config.keepOriginals) {
                await fs.unlink(inputPath);
                console.log(`  └ Removed original file`);
            }

            this.stats.converted++;
            return true;

        } catch (error) {
            console.error(`✗ Failed to convert ${path.basename(inputPath)}:`, error.message);
            this.stats.errors.push({ file: inputPath, error: error.message });
            this.stats.failed++;
            return false;
        }
    }

    // Convert all images in the source directory
    async convertAllImages() {
        console.log('=== WebP Image Conversion Tool (Sharp) ===');
        console.log(`Source Directory: ${config.sourceDir}`);
        console.log(`Quality: ${config.webpOptions.quality}%`);
        console.log(`Keep Originals: ${config.keepOriginals}`);
        console.log('');

        try {
            // Check if source directory exists
            await fs.access(config.sourceDir);
        } catch (error) {
            console.error(`Source directory does not exist: ${config.sourceDir}`);
            return;
        }

        // Get all image files
        console.log('Scanning for images...');
        const imageFiles = await this.getAllImageFiles(config.sourceDir);
        this.stats.totalFiles = imageFiles.length;

        console.log(`Found ${imageFiles.length} images to process`);
        console.log('');

        // Convert each image
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const progress = `[${i + 1}/${imageFiles.length}]`;
            
            console.log(`${progress} Processing: ${path.relative(config.sourceDir, file)}`);
            await this.convertImage(file);
            
            // Small delay to prevent overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        this.printSummary();
    }

    // Print conversion summary
    printSummary() {
        console.log('');
        console.log('=== Conversion Summary ===');
        console.log(`Total images found: ${this.stats.totalFiles}`);
        console.log(`Successfully converted: ${this.stats.converted}`);
        console.log(`Skipped (already exists): ${this.stats.skipped}`);
        console.log(`Failed conversions: ${this.stats.failed}`);
        
        if (this.stats.originalSize > 0 && this.stats.webpSize > 0) {
            const totalReduction = ((this.stats.originalSize - this.stats.webpSize) / this.stats.originalSize * 100).toFixed(2);
            console.log(`Original total size: ${(this.stats.originalSize / (1024 * 1024)).toFixed(2)} MB`);
            console.log(`WebP total size: ${(this.stats.webpSize / (1024 * 1024)).toFixed(2)} MB`);
            console.log(`Total space saved: ${totalReduction}%`);
        }

        if (this.stats.failed > 0) {
            console.log('');
            console.log('Failed conversions:');
            this.stats.errors.forEach(error => {
                console.log(`  - ${path.basename(error.file)}: ${error.error}`);
            });
        }

        console.log('');
        console.log('Conversion completed!');
    }
}

// Run the conversion
async function main() {
    const converter = new ImageConverter();
    await converter.convertAllImages();
}

// Handle command line arguments
if (process.argv.length > 2) {
    // Parse command line arguments
    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--quality=')) {
            config.webpOptions.quality = parseInt(arg.split('=')[1]);
        } else if (arg === '--remove-originals') {
            config.keepOriginals = false;
        } else if (arg.startsWith('--source=')) {
            config.sourceDir = arg.split('=')[1];
        }
    });
}

// Run the script
main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
});