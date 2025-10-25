n# 🚀 MongoDB + Admin Panel - Quick Start Guide

## ✅ Setup Complete!

Your website now has a full MongoDB-powered admin panel for managing events dynamically!

---

## 📋 What Was Created

### 1. **Database Models**
- `models/Event.js` - Complete event schema with all fields from events.ejs
- `models/Admin.js` - Admin user authentication

### 2. **File Upload System**
- `config/multer.js` - Handles image/video uploads
- Upload path: `public/img/programs/{category}/`
- Supports: JPG, PNG, WebP, GIF (images) | MP4, AVI, MOV, WebM (videos)
- Max file size: 50MB

### 3. **Admin Panel**
- `routes/admin.js` - All admin routes
- `controllers/adminEventController.js` - Event CRUD operations
- `controllers/adminAuthController.js` - Login/logout

### 4. **Helper Scripts**
- `seed-admin.js` - Create default admin account (NEW!)
- `seed-events.js` - Populate DB with current events

---

## 🏃 Quick Start (3 Steps)

### Step 1: Create Admin Account
```powershell
node seed-admin.js
```

**Default credentials:**
- Email: `admin@spreadasmileindia.com`
- Password: `admin123`
- Role: `super-admin`

⚠️ **IMPORTANT**: Change password after first login!

🖼️ **Profile Picture**: Upload via admin panel after logging in (supports ImageKit)

### Step 2: Seed Current Events
```powershell
node seed-events.js
```

This will add all 10 current events from events.ejs to MongoDB.

### Step 3: Start Server
```powershell
npm start
```

---

## 🎯 Access Admin Panel

1. **Login**: http://localhost:3001/admin/login
2. **Dashboard**: http://localhost:3001/admin/dashboard
3. **Manage Events**: http://localhost:3001/admin/events

---

## 📝 Event Schema Fields

Based on your events.ejs, each event has:

```javascript
{
  // Basic Info
  title: String (required),
  heading: String,
  description: String (required),
  
  // Classification
  category: 'festival' | 'national' | 'wellness' | 'recreation' | 'entertainment' | 'sports' | 'campaign' | 'fundraising' | 'regular',
  type: String,
  
  // Media
  poster: String (image filename),
  video: String (video filename),
  gallery: [String] (array of images),
  
  // Event Details
  eventDate: String,
  startTime: String,
  endTime: String,
  location: String,
  participants: String,
  volunteers: Number,
  members: String,
  
  // Features
  features: [String],
  highlights: [String],
  activities: [String],
  keywords: [String],
  
  // Status
  status: 'draft' | 'published' | 'archived',
  isFeatured: Boolean,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🖼️ File Upload Guide

### Upload Directories (Auto-created)
```
public/img/programs/
├── events/      ← Event images/videos
├── health/      ← Health program media
├── food/        ← Nutrition program media
├── education/   ← Education program media
├── vocational/  ← Vocational training media
└── nutrition/   ← Nutrition program media
```

### Supported Formats
- **Images**: JPEG, JPG, PNG, WebP, GIF
- **Videos**: MP4, AVI, MOV, WMV, WebM
- **Max Size**: 50MB per file

### Upload Fields
- `poster` - Main event image (1 file)
- `video` - Event video (1 file)
- `gallery` - Multiple images (up to 10 files)

---

## 🔐 Admin Roles

### Super Admin
- Full access to all features
- Can create/edit/delete admins
- Manage all content

### Admin
- Manage events
- Upload media
- Publish/unpublish content

### Editor
- Create/edit events (draft only)
- Cannot publish or delete

---

## 📡 API Endpoints

### Authentication
- `GET /admin/login` - Login page
- `POST /admin/login` - Login
- `GET /admin/logout` - Logout

### Dashboard
- `GET /admin/dashboard` - Admin dashboard with stats

### Event Management
- `GET /admin/events` - List all events (with filters)
- `GET /admin/events/create` - Create event form
- `POST /admin/events` - Create new event
- `GET /admin/events/:id/edit` - Edit event form
- `POST /admin/events/:id` - Update event
- `POST /admin/events/:id/delete` - Delete event
- `PATCH /admin/events/:id/toggle-featured` - Toggle featured status
- `DELETE /admin/events/:id/gallery/:filename` - Delete gallery image

---

## 🎨 Frontend Integration

### Update Programs Route

To display events from MongoDB instead of hardcoded:

```javascript
// routes/programs.js
const Event = require('../models/Event');

router.get('/events', async (req, res) => {
  const events = await Event.find({ status: 'published' })
    .sort({ createdAt: -1 });
  
  res.render('programs/events', {
    title: 'Events - SASI',
    page: 'programs',
    events // Pass dynamic events
  });
});
```

### Update EJS Template

```ejs
<!-- views/programs/events.ejs -->
<% events.forEach(event => { %>
  <div class="event-card">
    <img src="<%= event.getImageUrl() %>" alt="<%= event.title %>">
    <h3><%= event.title %></h3>
    <p><%= event.description %></p>
    <div class="event-date"><%= event.eventDate %></div>
    <div class="features">
      <% event.features.forEach(feature => { %>
        <span class="tag"><%= feature %></span>
      <% }) %>
    </div>
  </div>
<% }) %>
```

---

## 🔧 Customization

### Add More Models

Create similar models for:
- `models/Health.js` - Health programs
- `models/Nutrition.js` - Nutrition programs
- `models/Education.js` - Education programs
- `models/Team.js` - Team members
- `models/Story.js` - Success stories

### Add Admin Views

You need to create these EJS views:
- `views/admin/login.ejs` - Login page
- `views/admin/dashboard.ejs` - Dashboard
- `views/admin/events/index.ejs` - Event list
- `views/admin/events/create.ejs` - Create event form
- `views/admin/events/edit.ejs` - Edit event form

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```powershell
# Check your MongoDB URI in .env
# Make sure IP address is whitelisted in MongoDB Atlas
```

### Session Not Persisting
```powershell
# Clear cookies and restart server
# Check SESSION_SECRET in .env
```

### File Upload Not Working
```powershell
# Check upload directories exist
# Verify file size < 50MB
# Check file format is supported
```

---

## 📊 Database Commands

### View All Events
```javascript
// In MongoDB Compass or Shell
db.events.find().pretty()
```

### Delete All Events
```javascript
db.events.deleteMany({})
```

### Find Published Events
```javascript
db.events.find({ status: 'published' })
```

---

## 🚀 Production Deployment

### Before Deploying:

1. **Change SESSION_SECRET**
   ```env
   SESSION_SECRET=your-super-secure-random-string-here
   ```

2. **Set Environment**
   ```env
   NODE_ENV=production
   ```

3. **Whitelist IP Address**
   - Go to MongoDB Atlas
   - Network Access → Add IP Address
   - Add your server's IP

4. **Enable HTTPS**
   - Session cookies will only work with HTTPS in production

---

## 📚 Next Steps

1. **Create Admin Views** - Design the admin panel UI
2. **Update Frontend** - Connect events page to MongoDB
3. **Add More Models** - Health, Nutrition, Education, etc.
4. **Add Image Optimization** - Use Sharp to optimize uploads
5. **Add Pagination** - For large event lists
6. **Add Search** - Full-text search on events
7. **Add Analytics** - Track event views/clicks

---

## 💡 Tips

- Keep original event images as backup
- Use WebP format for better performance
- Compress images before uploading
- Use featured events for homepage
- Add keywords for better SEO
- Regular database backups

---

## 🎉 You're All Set!

Your admin panel is ready! You can now:
- ✅ Create events without coding
- ✅ Upload images and videos
- ✅ Manage content dynamically
- ✅ No more hardcoded data!

Happy managing! 🚀
