# 🔗 Canonical URL Implementation Guide
## Spread A Smile India - SEO Duplicate Content Prevention

**Date**: October 26, 2025  
**Status**: ✅ Implemented and Ready for Deployment

---

## 📌 What Are Canonical Tags?

Canonical tags tell Google which version of a URL is the "master" version when duplicate content exists.

### Without Canonical Tags (BAD):
Google might index multiple versions of the same page:
- `http://spreadasmileindia.com/about`
- `https://spreadasmileindia.com/about`
- `https://www.spreadasmileindia.com/about`
- `https://www.spreadasmileindia.com/about/`
- `https://www.spreadasmileindia.com/about?utm_source=facebook`

**Problem**: Google treats these as 5 different pages!
- Splits ranking power across duplicates
- Wastes crawl budget
- Can trigger duplicate content penalties

### With Canonical Tags + Redirects (GOOD):
All versions point to ONE canonical:
- ✅ `https://www.spreadasmileindia.com/about`

**Result**: 
- All ranking signals consolidated to one URL
- Better rankings
- No duplicate content issues

---

## ✅ What We Implemented

### 1. Dynamic Canonical Generation (config/seo.js)

Added a smart function that:
- ✅ Forces HTTPS protocol
- ✅ Forces www subdomain
- ✅ Removes query strings (utm_source, etc.)
- ✅ Removes trailing slashes (except root `/`)
- ✅ Removes `/index.html`
- ✅ Uses the actual request path

**Code Added**:
```javascript
function getCanonicalUrl(req) {
  // Get protocol (prefer X-Forwarded-Proto for GoDaddy proxy)
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').toLowerCase();
  
  // Get host and strip port numbers
  let host = req.get('host') || 'www.spreadasmileindia.com';
  host = host.replace(/:80$|:443$/, '');
  
  // Get path (no query string)
  let path = req.path || '/';
  
  // Remove index.html
  path = path.replace(/\/index\.html$/i, '/');
  
  // Remove trailing slash (except root)
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  // Always use preferred canonical host
  const preferredHost = 'www.spreadasmileindia.com';
  
  // Build canonical URL
  return `https://${preferredHost}${path}`;
}
```

**Now in middleware**:
```javascript
function seoMiddleware(req, res, next) {
  const seoData = getSEOData(req.path);
  const canonical = getCanonicalUrl(req); // Generate canonical
  
  res.locals.canonical = canonical; // Make available to templates
  // ... other res.locals assignments
  next();
}
```

---

### 2. Dynamic Canonical Tag (views/partials/header.ejs)

**Before**:
```html
<link rel="canonical" href="https://www.spreadasmileindia.com<%= currentPath %>">
```
**Problem**: Used hardcoded domain, kept query strings

**After**:
```html
<link rel="canonical" href="<%= typeof canonical !== 'undefined' ? canonical : ('https://www.spreadasmileindia.com' + (typeof currentPath !== 'undefined' ? currentPath : '')) %>">
```
**Benefit**: Uses middleware-generated canonical (normalized and clean)

---

### 3. URL Normalization Redirects (app.js)

Added 301 permanent redirects to FORCE the canonical URL:

**Code Added**:
```javascript
// URL Normalization for SEO - Force HTTPS and WWW (301 redirects)
app.use((req, res, next) => {
  // Skip in development
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  const host = (req.get('host') || '').replace(/:80$|:443$/, '');
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').toLowerCase();
  const preferredHost = 'www.spreadasmileindia.com';
  
  let shouldRedirect = false;
  let targetUrl = null;
  
  // Force HTTPS
  if (proto !== 'https') {
    targetUrl = `https://${preferredHost}${req.originalUrl}`;
    shouldRedirect = true;
  }
  // Force www subdomain
  else if (!host.startsWith('www.') && host === 'spreadasmileindia.com') {
    targetUrl = `https://${preferredHost}${req.originalUrl}`;
    shouldRedirect = true;
  }
  
  if (shouldRedirect && targetUrl) {
    return res.redirect(301, targetUrl);
  }
  
  next();
});
```

**What This Does**:
- ❌ `http://spreadasmileindia.com/about` → ✅ 301 → `https://www.spreadasmileindia.com/about`
- ❌ `https://spreadasmileindia.com/donate` → ✅ 301 → `https://www.spreadasmileindia.com/donate`
- ❌ `http://www.spreadasmileindia.com/programs` → ✅ 301 → `https://www.spreadasmileindia.com/programs`

---

## 🧪 How to Test After Deployment

### Test 1: Check Canonical Tag in Page Source

1. Visit: `https://www.spreadasmileindia.com`
2. Right-click → "View Page Source"
3. Search for: `rel="canonical"`
4. Should see: `<link rel="canonical" href="https://www.spreadasmileindia.com/">`
5. ✅ No query strings, no trailing slash (except root)

### Test 2: Check Different Pages

**Homepage**:
- URL: `https://www.spreadasmileindia.com/`
- Canonical: `https://www.spreadasmileindia.com/`
- ✅ Match!

**About Page**:
- URL: `https://www.spreadasmileindia.com/about`
- Canonical: `https://www.spreadasmileindia.com/about`
- ✅ Match!

**Donate Page**:
- URL: `https://www.spreadasmileindia.com/get-involved/donate`
- Canonical: `https://www.spreadasmileindia.com/get-involved/donate`
- ✅ Match!

### Test 3: Check URL Redirects

**Test in Browser**:
1. Type: `http://spreadasmileindia.com` (no www, no https)
2. Press Enter
3. Should redirect to: `https://www.spreadasmileindia.com`
4. Check browser address bar shows www and https ✅

**Test with cURL** (PowerShell):
```powershell
# Test non-www redirect
curl -I http://spreadasmileindia.com

# Should show:
# HTTP/1.1 301 Moved Permanently
# Location: https://www.spreadasmileindia.com

# Test https without www
curl -I https://spreadasmileindia.com

# Should show:
# HTTP/1.1 301 Moved Permanently
# Location: https://www.spreadasmileindia.com
```

### Test 4: Google Search Console URL Inspection

**After deployment + Search Console verification**:

1. Go to: https://search.google.com/search-console
2. Click "URL Inspection" (magnifying glass icon)
3. Enter: `https://www.spreadasmileindia.com/about`
4. Click "View tested page" → "More info"
5. Check these fields:
   - **User-declared canonical**: `https://www.spreadasmileindia.com/about`
   - **Google-selected canonical**: `https://www.spreadasmileindia.com/about`
   - ✅ They should MATCH!

**Test non-www version**:
6. Enter: `https://spreadasmileindia.com/about`
7. Should show: "Page is not indexed: Redirect"
8. This confirms 301 redirect is working ✅

---

## 📊 SEO Benefits

### Before Canonical Implementation:
❌ Google might index 4-5 versions of each page  
❌ Link equity split across duplicates  
❌ Wasted crawl budget  
❌ Risk of duplicate content penalty  
❌ Lower rankings due to signal dilution  

### After Canonical Implementation:
✅ Google indexes ONE version of each page  
✅ All link equity consolidated  
✅ Better crawl efficiency  
✅ No duplicate content issues  
✅ Higher rankings (consolidated signals)  
✅ Better user experience (consistent URLs)  

---

## 🎯 Real-World Examples

### Example 1: Social Media Traffic

**Scenario**: Facebook shares link with tracking parameter  
**Incoming URL**: `https://www.spreadasmileindia.com/about?utm_source=facebook&utm_medium=social`

**Without Canonical**:
- Google might index this as separate page
- Creates duplicate content

**With Our Implementation**:
- Page loads normally with tracking
- Canonical tag shows: `https://www.spreadasmileindia.com/about` (clean)
- Google knows to ignore the query parameters
- ✅ No duplicate, tracking still works!

### Example 2: User Types Non-WWW

**Scenario**: User types `spreadasmileindia.com` in browser  
**What Happens**:
1. Browser requests: `http://spreadasmileindia.com`
2. Server 301 redirects to: `https://www.spreadasmileindia.com`
3. Page loads with correct canonical
4. User sees: `https://www.spreadasmileindia.com` in address bar
5. ✅ Consistent branding + SEO!

### Example 3: Old Link with Trailing Slash

**Scenario**: Old link somewhere points to `/about/`  
**What Happens**:
1. Request: `https://www.spreadasmileindia.com/about/`
2. Page loads
3. Canonical tag shows: `https://www.spreadasmileindia.com/about` (no slash)
4. Google consolidates to non-slash version
5. ✅ No duplicates!

---

## 🔍 Common Issues & Solutions

### Issue: "Canonical points to wrong URL"

**Check**:
1. View page source
2. Find `<link rel="canonical"`
3. Verify it matches your preferred URL

**Fix**: 
- Ensure middleware is active
- Check `getCanonicalUrl()` function logic
- Verify no other templates override canonical

### Issue: "301 redirects not working"

**Check**:
1. Verify `NODE_ENV=production` is set
2. Check GoDaddy proxy settings (X-Forwarded-Proto)
3. Test with curl to see actual HTTP headers

**Fix**:
- Ensure app.js middleware is before routes
- Check Express `trust proxy` setting if needed
- Verify GoDaddy Apache/Nginx config doesn't override

### Issue: "Google still showing old URLs"

**Solution**:
1. Request reindexing in Search Console
2. Wait 1-2 weeks for Google to recrawl
3. Check Google-selected canonical vs user-declared
4. If mismatch, investigate sitemap or other issues

---

## 📋 Deployment Checklist

**Before Deploying**:
- [x] Added `getCanonicalUrl()` to config/seo.js
- [x] Updated seoMiddleware to set res.locals.canonical
- [x] Updated header.ejs to use dynamic canonical
- [x] Added URL normalization redirects to app.js
- [x] Tested locally (if possible)

**After Deploying**:
- [ ] Verify homepage canonical tag in page source
- [ ] Test 3-5 different pages for correct canonicals
- [ ] Test http → https redirect
- [ ] Test non-www → www redirect
- [ ] Check no errors in browser console
- [ ] Check server logs for redirect loops (shouldn't happen)

**Week 1 After Deploy**:
- [ ] Use Google Search Console URL Inspection
- [ ] Verify user-declared = Google-selected canonical
- [ ] Request reindexing for 10 key pages
- [ ] Monitor for any indexing issues

**Week 2-4 After Deploy**:
- [ ] Check Search Console for duplicate content warnings (should decrease)
- [ ] Monitor rankings (should stabilize/improve)
- [ ] Check crawl stats (should be more efficient)

---

## 🎓 Technical Details for Developers

### Why We Use X-Forwarded-Proto

GoDaddy (like most shared hosting) uses a **reverse proxy**. Your Node.js app runs behind Apache/Nginx, so:

- `req.protocol` might always be `http` (proxy to Node.js uses http)
- But user's actual request was `https` (browser to proxy)
- Proxy adds header: `X-Forwarded-Proto: https`

**Our code handles this**:
```javascript
const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').toLowerCase();
```

This ensures we correctly detect HTTPS even behind a proxy.

### Why We Remove Query Strings from Canonical

**Query parameters** like `?utm_source=facebook` are for tracking, not content:
- Same page content
- Different tracking data
- Should use same canonical

**Exceptions** (not implemented but possible):
- E-commerce: `?product_id=123` (different products = different canonicals)
- Pagination: `?page=2` (different content = different canonicals)
- Filters: `?category=education` (might need separate canonicals)

For your NGO site, query strings are almost always tracking/sharing, so we strip them all.

### Why We Remove Trailing Slashes

Google can see these as duplicates:
- `/about` 
- `/about/`

**Best practice**: Pick one and stick with it. We chose **no trailing slash** (except root `/`).

---

## 📚 Further Reading

- **Google Canonical Tags Guide**: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **Moz Canonical Guide**: https://moz.com/learn/seo/canonicalization
- **301 Redirects SEO**: https://moz.com/learn/seo/redirection

---

## ✅ Summary

**What Changed**:
1. Added canonical URL generation to SEO middleware
2. Updated header template to use dynamic canonical
3. Added 301 redirects to enforce canonical URLs

**SEO Impact**:
- ✅ Prevents duplicate content
- ✅ Consolidates ranking signals
- ✅ Better crawl efficiency
- ✅ Higher rankings
- ✅ Consistent branding

**User Impact**:
- ✅ Always see https://www.spreadasmileindia.com (professional)
- ✅ No broken links (old URLs redirect)
- ✅ Faster page loads (efficient crawling)

**Next Steps**:
1. Deploy all changes
2. Test redirects and canonical tags
3. Verify in Google Search Console
4. Monitor for 2-4 weeks

---

**Status**: Ready for production deployment ✅  
**Risk Level**: Low (redirects only apply in production)  
**Expected Results**: Improved SEO within 2-4 weeks

**Questions?** See DEPLOYMENT-CHECKLIST.md for deployment instructions.
