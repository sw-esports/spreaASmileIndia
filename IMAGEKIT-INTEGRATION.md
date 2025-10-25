# 🖼️ ImageKit Integration Guide

## ✅ What Changed

Your admin panel now uploads **all files to ImageKit Cloud CDN** instead of local storage!

### Benefits:
- ✨ **Automatic WebP conversion** for images
- 🚀 **Global CDN delivery** (faster loading worldwide)
- 📱 **On-the-fly image optimization** (resize, compress, format)
- 💾 **No local storage needed** (saves disk space)
- 🔄 **Image transformations** (crop, resize, quality adjust)
- 📊 **Built-in analytics** via ImageKit dashboard

---

## 🔧 Configuration

### ImageKit Credentials (Added to .env)
```env
IMAGEKIT_PUBLIC_KEY=public_Zy+pyzaSWcezktnY+PuZxEAzArs=
IMAGEKIT_PRIVATE_KEY=private_N/ATwQEELXZt6qaZ9y6EzVQ8PEE=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/lksjdf7sd
```

---

## 📁 File Structure (ImageKit Folders)

When you upload files, they're organized like this:

```
ImageKit (Cloud)
└── programs/
    ├── events/
    │   ├── poster-images.jpg
    │   ├── videos/
    │   │   └── event-videos.mp4
    │   └── gallery/
    │       └── gallery-images.jpg
    ├── health/
    ├── food/
    ├── education/
    ├── vocational/
    └── nutrition/
```

---

## 🗄️ Database Schema (Updated)

Events now store **ImageKit references** instead of filenames:

```javascript
{
  poster: {
    fileId: "67a1b2c3d4e5f67890abcdef",  // ImageKit file ID
    filePath: "programs/events/diwali-123.jpg",
    url: "https://ik.imagekit.io/lksjdf7sd/programs/events/diwali-123.jpg",
    name: "diwali-celebration.jpg"
  },
  
  video: {
    fileId: "12345abcdef67890...",
    filePath: "programs/events/videos/diwali-video-456.mp4",
    url: "https://ik.imagekit.io/lksjdf7sd/programs/events/videos/diwali-video-456.mp4",
    name: "diwali-video.mp4"
  },
  
  gallery: [
    {
      fileId: "abc123...",
      filePath: "programs/events/gallery/img1-789.jpg",
      url: "https://ik.imagekit.io/lksjdf7sd/programs/events/gallery/img1-789.jpg",
      name: "image1.jpg"
    }
    // ... more images
  ]
}
```

---

## 🎨 Using Images in Frontend

### Get Optimized WebP Images

```javascript
// In your EJS templates
<img src="<%= event.getPosterUrl() %>" alt="<%= event.title %>">

<!-- With custom options -->
<img src="<%= event.getPosterUrl({ width: 800, quality: 90 }) %>" alt="<%= event.title %>">
```

### Available Transformations

```javascript
event.getPosterUrl({
  width: 800,        // Resize to 800px width
  height: 600,       // Resize to 600px height
  quality: 90,       // Quality (1-100)
  format: 'webp',    // Format: webp, jpg, png, avif
  aspectRatio: '16-9', // Aspect ratio
  crop: 'maintain_ratio', // Crop mode
  focus: 'center'    // Focus point
})
```

### Example: Responsive Images

```ejs
<!-- Hero Image (Large, High Quality) -->
<img 
  src="<%= event.getPosterUrl({ width: 1920, quality: 90 }) %>" 
  alt="<%= event.title %>"
  loading="lazy"
>

<!-- Thumbnail (Small, Fast) -->
<img 
  src="<%= event.getPosterUrl({ width: 300, height: 200, crop: 'maintain_ratio' }) %>" 
  alt="<%= event.title %>"
  loading="lazy"
>

<!-- Card Image (Medium) -->
<img 
  src="<%= event.getPosterUrl({ width: 640 }) %>" 
  alt="<%= event.title %>"
  loading="lazy"
>
```

### Gallery Images

```ejs
<div class="gallery">
  <% event.getGalleryUrls().forEach(image => { %>
    <a href="<%= image.full %>">
      <img 
        src="<%= image.thumbnail %>" 
        alt="Gallery Image"
        loading="lazy"
      >
    </a>
  <% }) %>
</div>
```

### Videos

```ejs
<% if (event.getVideoUrl()) { %>
  <video controls>
    <source src="<%= event.getVideoUrl() %>" type="video/mp4">
    Your browser does not support videos.
  </video>
<% } %>
```

---

## 📤 Admin Panel Upload Flow

### 1. User Uploads File
- Admin selects file in form
- Click "Create Event"

### 2. File Processing
```
Browser → Server (buffer in memory) → ImageKit Cloud
                ↓
            Database (saves ImageKit references)
```

### 3. File Storage
- ❌ **NOT saved to** `public/img/programs/`
- ✅ **SAVED to** ImageKit Cloud CDN
- Database stores: `fileId`, `filePath`, `url`, `name`

### 4. File Deletion
When you delete an event:
- Deletes from **MongoDB** database
- Deletes from **ImageKit** cloud (via fileId)
- ❌ No local files to clean up

---

## 🔄 Migration from Old System

### Old System (Before)
```javascript
// Stored filename only
poster: "diwali-celebration.jpg"

// Full URL in template
<img src="/img/programs/events/<%= event.poster %>" alt="">
```

### New System (Now)
```javascript
// Stores ImageKit object
poster: {
  fileId: "abc123",
  filePath: "programs/events/diwali-123.jpg",
  url: "https://ik.imagekit.io/lksjdf7sd/...",
  name: "diwali-celebration.jpg"
}

// Optimized WebP URL in template
<img src="<%= event.getPosterUrl() %>" alt="">
```

---

## 🎯 ImageKit Features

### 1. Automatic WebP Conversion
All images are automatically served as WebP (70% smaller than JPG)

### 2. Lazy Loading URLs
```javascript
// Low-quality placeholder (LQIP)
event.getPosterUrl({ quality: 20, blur: 10 })

// Full quality
event.getPosterUrl({ quality: 90 })
```

### 3. Responsive Images
```ejs
<picture>
  <source 
    srcset="<%= event.getPosterUrl({ width: 1920 }) %>" 
    media="(min-width: 1200px)"
  >
  <source 
    srcset="<%= event.getPosterUrl({ width: 1024 }) %>" 
    media="(min-width: 768px)"
  >
  <img 
    src="<%= event.getPosterUrl({ width: 640 }) %>" 
    alt="<%= event.title %>"
  >
</picture>
```

### 4. Image Overlays & Watermarks
```javascript
// Add text overlay
event.getPosterUrl({ 
  overlay_text: 'SASI Event',
  overlay_font_size: 45,
  overlay_x: 10,
  overlay_y: 10
})

// Add logo watermark
event.getPosterUrl({ 
  overlay_image: '/logo.png',
  overlay_transformation: 'w-200'
})
```

---

## 📊 ImageKit Dashboard

Access your ImageKit dashboard:
**https://imagekit.io/dashboard**

### Features:
- 📁 **Media Library** - Browse all uploaded files
- 📈 **Analytics** - Bandwidth, requests, transformations
- 🔧 **Settings** - Configure transformations, webhooks
- 🗑️ **Bulk Delete** - Clean up unused files
- 📊 **Usage Stats** - Track storage & bandwidth

---

## 🚨 Common Issues & Solutions

### Issue 1: "ImageKit upload failed"
**Solution:**
```bash
# Check credentials in .env
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_ID
```

### Issue 2: Images not displaying
**Solution:**
```javascript
// Make sure you're using the method
<%= event.getPosterUrl() %>  // ✅ Correct

// Not the raw object
<%= event.poster %>  // ❌ Wrong (shows [object Object])
```

### Issue 3: "File too large"
**Current limit:** 50MB per file

**Solution:**
```javascript
// Compress before upload, or increase limit in config/multer.js
limits: {
  fileSize: 100 * 1024 * 1024, // 100MB
}
```

### Issue 4: Old events have no images
**Solution:**
Old events from seed script have `poster: null`. Upload new images via admin panel.

---

## 🔐 Security

### API Keys Protection
- ✅ Private key stored in `.env` (not committed to Git)
- ✅ Public key safe to use in frontend
- ❌ Never expose private key in client-side code

### File Upload Validation
```javascript
// Allowed formats
Images: JPEG, JPG, PNG, WebP, GIF
Videos: MP4, AVI, MOV, WMV, WebM

// File size limit: 50MB
```

---

## 🎨 Advanced Examples

### Example 1: Product Card
```ejs
<div class="event-card">
  <img 
    src="<%= event.getPosterUrl({ 
      width: 400, 
      height: 300, 
      crop: 'maintain_ratio',
      quality: 85,
      format: 'webp'
    }) %>" 
    alt="<%= event.title %>"
    loading="lazy"
  >
  <h3><%= event.title %></h3>
  <p><%= event.description %></p>
</div>
```

### Example 2: Lightbox Gallery
```ejs
<div class="gallery">
  <% event.getGalleryUrls({ quality: 95 }).forEach((img, index) => { %>
    <a 
      href="<%= img.full %>" 
      data-lightbox="event-<%= event._id %>"
      data-title="Image <%= index + 1 %>"
    >
      <img 
        src="<%= img.thumbnail %>" 
        alt="Gallery Image <%= index + 1 %>"
        loading="lazy"
      >
    </a>
  <% }) %>
</div>
```

### Example 3: Video with Poster
```ejs
<video 
  controls 
  poster="<%= event.getPosterUrl({ width: 1280, quality: 80 }) %>"
>
  <source src="<%= event.getVideoUrl() %>" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

---

## 📝 Update Existing Templates

### Old Code (Before ImageKit)
```ejs
<img src="/img/programs/events/<%= event.poster %>" alt="">
```

### New Code (After ImageKit)
```ejs
<img src="<%= event.getPosterUrl() %>" alt="<%= event.title %>">
```

### Update programs/events.ejs
```ejs
<!-- Replace all image paths -->
<% events.forEach(event => { %>
  <div class="event-card">
    <img 
      src="<%= event.getPosterUrl({ width: 640 }) %>" 
      alt="<%= event.title %>"
      loading="lazy"
    >
    
    <% if (event.getVideoUrl()) { %>
      <video controls>
        <source src="<%= event.getVideoUrl() %>" type="video/mp4">
      </video>
    <% } %>
    
    <!-- Gallery -->
    <div class="gallery">
      <% event.getGalleryUrls().forEach(img => { %>
        <img src="<%= img.thumbnail %>" alt="Gallery">
      <% }) %>
    </div>
  </div>
<% }) %>
```

---

## 📦 Package Info

**ImageKit SDK:** `npm i imagekit`

**Files Modified:**
- `config/imagekit.js` - ImageKit helper functions
- `config/multer.js` - Changed to memory storage
- `models/Event.js` - Updated schema for ImageKit objects
- `controllers/adminEventController.js` - Upload to ImageKit
- `.env` - Added ImageKit credentials

---

## 🚀 Next Steps

1. **Test Upload:**
   - Go to `/admin/events/create`
   - Upload an event with poster
   - Check ImageKit dashboard to verify

2. **Update Frontend:**
   - Replace all `event.poster` with `event.getPosterUrl()`
   - Test image rendering

3. **Optimize Performance:**
   - Use responsive images
   - Enable lazy loading
   - Set appropriate quality levels

4. **Monitor Usage:**
   - Check ImageKit dashboard
   - Review bandwidth usage
   - Optimize transformation settings

---

## 💡 Pro Tips

1. **Always use WebP:** It's 70% smaller than JPG
2. **Set quality 80-85:** Good balance between size/quality
3. **Use lazy loading:** Add `loading="lazy"` to images
4. **Responsive images:** Use width parameter for different screen sizes
5. **Cache images:** ImageKit CDN caches globally automatically

---

## 📞 Support

- **ImageKit Docs:** https://docs.imagekit.io
- **Dashboard:** https://imagekit.io/dashboard
- **API Reference:** https://docs.imagekit.io/api-reference

---

🎉 **Your files are now in the cloud!** No more local storage issues!
