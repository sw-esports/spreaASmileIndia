# Candle Shop Images Directory

This directory contains all the product images for the SASI Candle Shop.

## Directory Structure

```
/public/src/images/shop/
├── candles/
│   ├── lavender-1.jpg      # Primary image for Lavender Serenity Candle
│   ├── lavender-2.jpg      # Secondary image (hover effect)
│   ├── vanilla-1.jpg       # Single image for Vanilla Dreams Candle
│   ├── citrus-1.jpg        # Primary image for Citrus Burst Candle
│   ├── citrus-2.jpg        # Secondary image (hover effect)
│   ├── rose-1.jpg          # Single image for Rose Garden Candle
│   ├── sandalwood-1.jpg    # Primary image for Sandalwood Mystic Candle
│   ├── sandalwood-2.jpg    # Secondary image (hover effect)
│   ├── ocean-1.jpg         # Single image for Ocean Breeze Candle
│   ├── cinnamon-1.jpg      # Primary image for Cinnamon Spice Candle
│   ├── cinnamon-2.jpg      # Secondary image (hover effect)
│   └── jasmine-1.jpg       # Single image for Jasmine Night Candle
├── hero-candles.jpg        # Hero section background image
└── impact-story.jpg        # Impact section image

```

## Image Requirements

### Product Images
- **Format**: JPG or PNG
- **Size**: 800x800px minimum (square aspect ratio)
- **Quality**: High resolution, well-lit, professional photography
- **Background**: Clean, preferably white or neutral
- **File size**: Optimized for web (under 200KB each)

### Naming Convention
- Primary images: `product-name-1.jpg`
- Secondary images: `product-name-2.jpg` (for hover effects)
- Use lowercase, hyphens for spaces

### Image Effects
1. **Products with 2 images**: 
   - Primary image shows on load
   - Secondary image appears on hover
   - Smooth transition effect

2. **Products with 1 image**:
   - Zoom effect on hover (1.1x scale)
   - Smooth transition

## Current Products

1. **Lavender Serenity Candle** - 2 images (hover effect)
2. **Vanilla Dreams Candle** - 1 image (zoom effect)
3. **Citrus Burst Candle** - 2 images (hover effect)
4. **Rose Garden Candle** - 1 image (zoom effect)
5. **Sandalwood Mystic Candle** - 2 images (hover effect)
6. **Ocean Breeze Candle** - 1 image (zoom effect)
7. **Cinnamon Spice Candle** - 2 images (hover effect)
8. **Jasmine Night Candle** - 1 image (zoom effect)

## Adding New Products

When adding new candle products:

1. Add product data to `/routes/candle-shop.js`
2. Add corresponding images to this directory
3. Follow the naming convention
4. Update this README if needed

## Image Optimization Tips

- Use tools like TinyPNG or ImageOptim to compress images
- Ensure images look good on both light and dark themes
- Test images on mobile devices
- Consider adding lazy loading for better performance

## Placeholder Images

For development, you can use placeholder images:
- https://via.placeholder.com/800x800/D4751A/FFFFFF?text=Candle
- Replace with actual product photos before production

## Copyright Notice

All images should be:
- Original photography of actual SASI candle products
- Properly licensed stock photos
- Free-to-use images with appropriate attribution

Ensure you have rights to use all images in commercial context.