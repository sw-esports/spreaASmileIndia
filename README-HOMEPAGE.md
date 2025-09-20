# Spread A Smile India - Homepage

A responsive, accessible, high-performance homepage for the NGO Spread A Smile India. Built with Express.js, EJS templating, and modern CSS/JavaScript.

## 🚀 Features

### Homepage Sections
- **Hero Carousel**: Full-width image/video slider with autoplay, touch support, and accessibility
- **Key Metrics**: Animated counters with progress indicators
- **Mission Summary**: Brief organization overview with call-to-action
- **Team Members**: Interactive team cards with detailed modals
- **Impact Feed**: Instagram-style media feed with video support
- **Impact Timeline**: Interactive timeline of organizational milestones
- **Call-to-Actions**: Donation, volunteer signup, and newsletter subscription

### Technical Features
- ✅ Fully responsive design (320px to 1920px+)
- ✅ WCAG AA accessibility compliance
- ✅ SEO optimized with semantic HTML and meta tags
- ✅ Performance optimized with lazy loading and image compression
- ✅ Progressive Web App ready
- ✅ Analytics and event tracking ready
- ✅ Theme switching support (light/dark)
- ✅ Smooth animations and micro-interactions

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm start

# Open in browser
http://localhost:3002
```

### Environment Variables
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-super-secret-key-here

# Database (for future integration)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spreadasmile
DB_USER=your-username
DB_PASS=your-password

# Email Service (for forms)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Social Media Integration
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
FACEBOOK_PAGE_ID=your-facebook-page-id

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 📁 Project Structure

```
├── app.js                 # Main Express server
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── .env                  # Environment variables
├── public/               # Static assets
│   ├── css/             
│   │   ├── style.css    # Base styles
│   │   ├── components.css # Reusable components
│   │   ├── navbar-enhanced.css # Navigation styles
│   │   └── homepage.css # Homepage-specific styles
│   ├── js/
│   │   ├── script.js    # Global JavaScript
│   │   └── homepage.js  # Homepage interactions
│   └── src/
│       ├── images/      # Image assets
│       └── videos/      # Video assets
├── views/               # EJS templates
│   ├── partials/       # Reusable partials
│   │   ├── header.ejs  # Navigation and <head>
│   │   └── footer.ejs  # Footer and scripts
│   └── home.ejs        # Homepage template
└── routes/             # Express routes
    ├── index.js        # Homepage route
    └── api.js          # API endpoints
```

## 🎨 Design System

### Typography
- **Primary Font**: Inter (400, 500, 600, 700)
- **Display Font**: Poppins (300, 400, 500, 600, 700, 800)

### Colors
```css
:root {
  --primary-color: #e74c3c;    /* Spread A Smile Red */
  --secondary-color: #f39c12;  /* Warm Orange */
  --accent-color: #3498db;     /* Trust Blue */
  --success-color: #27ae60;    /* Success Green */
  --text-primary: #2c3e50;     /* Dark Text */
  --text-secondary: #7f8c8d;   /* Secondary Text */
  --background-light: #ffffff; /* Light Background */
  --background-dark: #1a1a1a;  /* Dark Background */
}
```

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 769px - 1024px  
- **Desktop**: 1025px - 1440px
- **Large Desktop**: 1441px+

## 🔧 Integration Guide

### CMS Integration
The homepage is designed to work with any headless CMS. Update these data sources:

#### Hero Slides (`/api/hero-slides`)
```json
{
  "slides": [
    {
      "type": "image|video",
      "url": "/path/to/media",
      "title": "Slide Title",
      "subtitle": "Slide Description",
      "cta": {
        "primary": { "text": "Donate Now", "url": "/donate" },
        "secondary": { "text": "Learn More", "url": "/about" }
      }
    }
  ]
}
```

#### Statistics (`/api/statistics`)
```json
{
  "metrics": {
    "childrenImpacted": 2500,
    "currentlyInSchool": 1800,
    "womenTrained": 950,
    "yearsOfService": 15
  }
}
```

#### Team Members (`/api/team`)
```json
{
  "members": [
    {
      "id": "founder",
      "name": "Dr. Priya Sharma",
      "title": "Founder & Director",
      "image": "/images/team/founder.jpg",
      "bio": "Biography text...",
      "achievements": ["Achievement 1", "Achievement 2"],
      "contact": "email@example.com",
      "social": {
        "linkedin": "https://linkedin.com/in/...",
        "twitter": "https://twitter.com/..."
      }
    }
  ]
}
```

### Instagram Integration
To integrate real Instagram content:

1. **Get Instagram Basic Display API access**:
   - Create a Facebook App
   - Add Instagram Basic Display product
   - Generate access token

2. **Update API endpoint** in `routes/api.js`:
```javascript
router.get('/instagram-feed', async (req, res) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );
    const data = await response.json();
    res.json({ success: true, data: data.data });
  } catch (error) {
    // Handle error
  }
});
```

### Email Integration
Configure email service for forms:

1. **Gmail/Outlook** (recommended for small scale):
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use App Password
  }
});
```

2. **SendGrid/Mailchimp** (recommended for production):
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Database Integration
Add database models for form submissions:

```javascript
// Example with Mongoose (MongoDB)
const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  interest: { type: String },
  message: { type: String },
  status: { type: String, default: 'pending' },
  appliedAt: { type: Date, default: Date.now }
});
```

## 📱 Responsive Behavior

### Mobile (320px - 768px)
- Single column layout
- Stacked hero actions
- Swipeable carousel
- Hamburger navigation
- Touch-optimized buttons

### Tablet (769px - 1024px)
- Two-column grids
- Reduced spacing
- Touch and mouse support

### Desktop (1025px+)
- Full multi-column layouts
- Hover effects
- Keyboard navigation
- Optimal spacing

## ♿ Accessibility Features

### WCAG AA Compliance
- ✅ Color contrast ratios meet minimum standards
- ✅ All interactive elements are keyboard accessible
- ✅ Screen reader compatible with ARIA labels
- ✅ Focus indicators visible and clear
- ✅ Alternative text for all images
- ✅ Video captions support ready

### Keyboard Navigation
- `Tab` / `Shift+Tab`: Navigate through interactive elements
- `Enter` / `Space`: Activate buttons and links
- `Escape`: Close modals and dropdowns
- `Arrow Keys`: Navigate carousel slides

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Skip links for main content

## 🚀 Performance Optimization

### Loading Performance
- **Image lazy loading**: Images load as they enter viewport
- **Video preload metadata**: Videos don't download until needed
- **CSS/JS minification**: Compressed for production
- **Critical CSS inlined**: Above-the-fold styles prioritized

### Runtime Performance
- **IntersectionObserver**: Efficient scroll-based animations
- **RequestAnimationFrame**: Smooth 60fps animations
- **Debounced scroll events**: Optimized event handling
- **Lazy component initialization**: Features load when needed

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 📊 Analytics & Tracking

### Event Tracking
The homepage tracks these events automatically:

```javascript
// Carousel interactions
trackEvent('hero_carousel', 'next_slide', 'slide_2');
trackEvent('hero_carousel', 'indicator_click', 'slide_1');

// Video interactions  
trackEvent('video_control', 'play', 'hero_video');
trackEvent('feed_video', 'pause', 'impact_feed');

// Form submissions
trackEvent('volunteer_form', 'submit', 'success');
trackEvent('newsletter', 'subscribe', 'footer');

// CTA clicks
trackEvent('cta_click', 'donate', 'hero_section');
trackEvent('social_click', 'instagram', 'footer');
```

### Google Analytics 4 Integration
Add this to your `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-XXXXXXXXX');
</script>
```

## 🔒 Security Considerations

### Form Security
- ✅ Input validation and sanitization
- ✅ CSRF protection ready
- ✅ Rate limiting recommended
- ✅ XSS prevention

### Data Protection
- ✅ Email validation
- ✅ Phone number validation
- ✅ No sensitive data in localStorage
- ✅ Secure session configuration

## 🚢 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/HTTPS
- [ ] Set secure session cookies
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Test all forms and integrations

### Environment Variables for Production
```env
NODE_ENV=production
PORT=80
SESSION_SECRET=complex-production-secret
DB_HOST=production-db-host
EMAIL_SERVICE=sendgrid
INSTAGRAM_ACCESS_TOKEN=production-token
GOOGLE_ANALYTICS_ID=GA-PRODUCTION-ID
```

## 🐛 Troubleshooting

### Common Issues

#### Images not loading
- Check file paths in `/public/src/images/`
- Ensure proper file permissions
- Verify image file formats (JPG, PNG, WebP)

#### Videos not playing
- Check browser video codec support
- Ensure `playsinline` attribute for mobile
- Verify video file formats (MP4, WebM)

#### Forms not submitting
- Check API endpoints are running
- Verify CORS configuration
- Check browser console for JavaScript errors

#### Animations not working
- Ensure GSAP and AOS libraries are loaded
- Check for JavaScript errors in console
- Verify IntersectionObserver support

### Debug Mode
Enable debug logging:
```javascript
// In homepage.js
const DEBUG = true;
if (DEBUG) console.log('Debug info:', data);
```

## 📞 Support & Maintenance

### File Locations for Updates
- **Homepage content**: `views/home.ejs`
- **Styling**: `public/css/homepage.css`
- **Interactions**: `public/js/homepage.js`
- **API endpoints**: `routes/api.js`
- **Images**: `public/src/images/`

### Regular Maintenance Tasks
- Update dependency packages monthly
- Refresh team member information
- Update statistics and metrics
- Check broken links and images
- Review and update accessibility features
- Monitor performance metrics

## 🤝 Contributing

### Code Style
- Use meaningful variable names
- Comment complex logic
- Follow established file structure
- Test on multiple devices and browsers

### Git Workflow
- Create feature branches for new development
- Write descriptive commit messages
- Test thoroughly before merging
- Use the provided Git scripts for easy commits

---

**Built with ❤️ for Spread A Smile India**  
*Empowering communities through education and empowerment*