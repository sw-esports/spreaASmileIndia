/**
 * ⚡ HERO IMAGE OPTIMIZER
 * Automatically optimizes all images for LCP improvement
 * Target: Reduce image sizes by 70%+ using WebP
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'src', 'images');

// Configuration
const CONFIG = {
  maxWidth: 1920,
  quality: 85,
  formats: ['webp'], // Can add 'avif' for even better compression
  createResponsive: true, // Create multiple sizes
  responsiveSizes: [640, 1280, 1920] // Mobile, Tablet, Desktop
};

async function optimizeImage(inputPath, filename) {
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext);
  
  // Skip if already optimized
  if (ext === '.webp' || ext === '.avif') {
    console.log(`⏭️  Skipping ${filename} (already optimized)`);
    return;
  }
  
  // Only process images
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }
  
  console.log(`\n🔄 Processing: ${filename}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`   Original: ${metadata.width}x${metadata.height} (${(metadata.size / 1024).toFixed(2)} KB)`);
    
    // Create responsive sizes
    for (const width of CONFIG.responsiveSizes) {
      if (width > metadata.width) continue; // Don't upscale
      
      const suffix = width === 1920 ? '' : `-${width}w`;
      const outputPath = path.join(imagesDir, `${basename}${suffix}.webp`);
      
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ 
          quality: CONFIG.quality,
          effort: 6 // Max compression effort (0-6)
        })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const reduction = ((1 - stats.size / metadata.size) * 100).toFixed(1);
      
      console.log(`   ✅ ${width}w → ${(stats.size / 1024).toFixed(2)} KB (${reduction}% smaller)`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
  }
}

async function optimizeAllImages() {
  console.log('🖼️  IMAGE OPTIMIZER STARTING...\n');
  console.log(`📁 Directory: ${imagesDir}`);
  console.log(`🎯 Target: ${CONFIG.maxWidth}px max width`);
  console.log(`💎 Quality: ${CONFIG.quality}%`);
  console.log(`📐 Sizes: ${CONFIG.responsiveSizes.join('px, ')}px\n`);
  console.log('━'.repeat(60));
  
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Directory not found: ${imagesDir}`);
    return;
  }
  
  const files = fs.readdirSync(imagesDir);
  let processedCount = 0;
  let totalSavings = 0;
  
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      const originalSize = stats.size;
      await optimizeImage(filePath, file);
      
      // Calculate savings
      const optimizedPath = path.join(imagesDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      if (fs.existsSync(optimizedPath)) {
        const optimizedSize = fs.statSync(optimizedPath).size;
        const savings = originalSize - optimizedSize;
        if (savings > 0) {
          totalSavings += savings;
          processedCount++;
        }
      }
    }
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log(`\n✨ OPTIMIZATION COMPLETE!`);
  console.log(`📊 Processed: ${processedCount} images`);
  console.log(`💾 Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⚡ Average reduction: ${processedCount > 0 ? ((totalSavings / processedCount / 1024).toFixed(2)) : 0} KB per image\n`);
  
  console.log('🎯 NEXT STEPS:');
  console.log('1. Update image tags to use .webp files');
  console.log('2. Add width/height attributes');
  console.log('3. Add fetchpriority="high" to hero image');
  console.log('4. Test with Lighthouse\n');
}

// Run optimization
optimizeAllImages().catch(console.error);
