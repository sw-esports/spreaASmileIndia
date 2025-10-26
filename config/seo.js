/**
 * SEO Configuration for Spread A Smile India
 * Centralized metadata management for better search engine optimization
 */

const seoConfig = {
  // Default metadata (fallback)
  default: {
    title: 'Spread A Smile India - Best NGO in Delhi | Street Children Education',
    description: 'Spread A Smile India - Best NGO in Delhi transforming lives of street children since 2005. Education, healthcare, nutrition programs. Sangita Mehra Foundation. Donate & Volunteer.',
    keywords: 'spread a smile india, sasi foundation, best ngo in india, ngo in delhi, street children education, sangita mehra ngo, donate to ngo india, volunteer delhi, munirka ngo, charity india, children education',
    ogImage: '/src/images/og-image.jpg',
    twitterImage: '/src/images/twitter-card.jpg'
  },

  // Homepage
  '/': {
    title: 'Spread A Smile India | Best NGO in Delhi for Street Children Education',
    description: 'Spread A Smile India - Best NGO in Delhi helping 200+ street children since 2005. Founded by Sangita Mehra. Education, healthcare, nutrition & women empowerment programs in Munirka. Donate & Volunteer.',
    keywords: 'spread a smile india, spread a smile foundation, sasi foundation, best ngo in delhi, best ngo in india, ngo in delhi, ngo in munirka, sangita mehra ngo, street children education delhi, donate to ngo delhi, volunteer delhi ngo, best education ngo delhi, charity india',
    ogImage: '/src/images/landing-page/lading-page4.webp'
  },

  // About Pages
  '/about': {
    title: 'About Us - Spread A Smile India | Our Mission & Story',
    description: 'Learn about Spread A Smile India - Delhi NGO founded by Sangita Mehra in 2005. Discover our mission, vision, and journey transforming street children\'s lives through education and empowerment.',
    keywords: 'about spread a smile india, sangita mehra foundation, ngo mission vision, delhi ngo history'
  },

  '/about/mission': {
    title: 'Our Mission & Vision - Transforming Lives Through Education',
    description: 'Spread A Smile India\'s mission: Helping destitute street children transition "from streets to classrooms" through comprehensive education, healthcare, nutrition & empowerment programs.',
    keywords: 'ngo mission, ngo vision, street children education mission, delhi ngo goals'
  },

  '/about/history': {
    title: 'Our Story - 20 Years of Impact | Spread A Smile India History',
    description: 'The inspiring journey of Spread A Smile India from 2005 to present. How Sangita Mehra transformed from fashion designer to NGO founder, impacting 90+ lives and counting.',
    keywords: 'spread a smile history, ngo journey, sangita mehra story, delhi ngo timeline, ngo achievements'
  },

  '/about/founder': {
    title: 'Meet Sangita Mehra - Founder & President | Spread A Smile India',
    description: 'Sangita Mehra - Visionary founder of Spread A Smile India. Former fashion designer from Mehrasons Jewellers family who dedicated her life to transforming street children through education since 2005.',
    keywords: 'sangita mehra, spread a smile founder, ngo founder delhi, mehrasons jewellers, women ngo leaders india'
  },

  '/about/team': {
    title: 'Our Team - Meet the Hearts Behind the Mission',
    description: 'Meet the dedicated team at Spread A Smile India - passionate individuals working together to transform lives through education, healthcare, and community empowerment programs.',
    keywords: 'ngo team, spread a smile staff, ngo volunteers, delhi ngo team'
  },

  '/about/partners': {
    title: 'Our Partners & Supporters - Building Change Together',
    description: 'Proud partnerships and collaborations that help Spread A Smile India reach more children and families. Join us as a partner in transforming lives.',
    keywords: 'ngo partnerships, corporate social responsibility, ngo collaborations delhi'
  },

  // Programs Pages
  '/programs': {
    title: 'Our Programs - Education, Health, Nutrition & Skills Training',
    description: 'Comprehensive programs by Spread A Smile India: Free education for street children, healthcare services, nutrition support, vocational training, and women empowerment initiatives.',
    keywords: 'ngo programs, street children education, free healthcare ngo, vocational training delhi, women empowerment programs'
  },

  '/programs/education': {
    title: 'Free Education for Street Children | Best Education NGO in Delhi',
    description: 'Free education program by Spread A Smile India helping 200+ street children in Delhi. School partnerships, qualified teachers, learning centers in Munirka. Enroll children in formal schools.',
    keywords: 'free education delhi, street children education, best education ngo delhi, free schooling delhi, education for poor children, ngo education program, free school admission delhi, street children school, education charity india'
  },

  '/programs/health': {
    title: 'Healthcare Program - Free Medical Support for Street Children',
    description: 'Comprehensive healthcare services for street children and families: Free medical checkups, health camps, medicine distribution, and emergency medical assistance across Delhi.',
    keywords: 'free healthcare ngo, medical camps delhi, children healthcare, free medical checkup, ngo health program'
  },

  '/programs/nutrition': {
    title: 'Nutrition Program - Fighting Hunger & Malnutrition',
    description: 'Daily nutritious meals, food distribution, and nutrition education for street children and families. Ensuring every child has access to healthy food for better learning and growth.',
    keywords: 'free food program, nutrition for children, meal distribution ngo, fight hunger delhi, free meals for poor'
  },

  '/programs/vocational': {
    title: 'Vocational Training - Skills for Sustainable Livelihoods',
    description: 'Skill development programs: Candle making, computer literacy, ingenuity gaming, tailoring, and job placement assistance. Empowering youth and women for economic independence.',
    keywords: 'vocational training, skill development, job training ngo, women empowerment skills, computer training delhi'
  },

  '/programs/events': {
    title: 'Events & Activities - Community Programs & Celebrations',
    description: 'Join our community events, educational activities, cultural celebrations, and awareness campaigns. Building stronger communities through engagement and participation.',
    keywords: 'ngo events, community programs, delhi ngo activities, volunteer events'
  },

  // Impact Pages
  '/impact': {
    title: 'Our Impact - Transforming Lives & Communities Since 2005',
    description: '90+ lives transformed, 200+ children in school, 95 women empowered, 108 job placements. Real impact, real change through education and empowerment programs.',
    keywords: 'ngo impact, success stories, ngo achievements, impact report, lives transformed'
  },

  '/impact/achievements': {
    title: 'Achievements & Milestones - 20 Years of Impact',
    description: 'Celebrating our achievements: Awards, recognitions, milestones, and measurable impact in education, healthcare, and community development across Delhi NCR.',
    keywords: 'ngo achievements, ngo awards, ngo milestones, recognition, impact metrics'
  },

  '/impact/stories': {
    title: 'Success Stories - Real Lives Transformed by Education',
    description: 'Inspiring success stories of children who transformed from street begging to successful careers. Real testimonials from beneficiaries, families, and community members.',
    keywords: 'success stories, transformation stories, ngo testimonials, beneficiary stories, real impact'
  },

  '/impact/testimonials': {
    title: 'Testimonials - Voices from Our Community',
    description: 'Hear from those whose lives have been transformed: Students, parents, volunteers, and partners share their experiences with Spread A Smile India.',
    keywords: 'testimonials, reviews, feedback, beneficiary voices, community feedback'
  },

  '/impact/reports': {
    title: 'Annual Reports & Transparency - Financial & Impact Reports',
    description: 'Access our annual reports, financial statements, impact assessments, and transparency documents. Committed to accountability and transparent operations.',
    keywords: 'annual report, ngo transparency, financial report, impact assessment, accountability'
  },

  // Get Involved Pages
  '/get-involved': {
    title: 'Get Involved - Volunteer, Donate, Partner with Us',
    description: 'Join Spread A Smile India in transforming lives. Volunteer opportunities, donation options, corporate partnerships, and career opportunities. Make a difference today!',
    keywords: 'volunteer delhi, donate to ngo, ngo partnership, support ngo, make a difference'
  },

  '/get-involved/volunteer': {
    title: 'Volunteer in Delhi | Best NGO Volunteer Opportunities | Teaching & More',
    description: 'Volunteer with Spread A Smile India - Best NGO in Delhi. Teaching opportunities, event support, skill-sharing programs. Make a difference in street children\'s lives. Apply now!',
    keywords: 'volunteer delhi, volunteer opportunities delhi, ngo volunteer, teaching volunteer delhi, social work volunteer, volunteer in munirka, best ngo volunteer, help street children delhi'
  },

  '/get-involved/donate': {
    title: 'Donate to Spread A Smile India | 80G Tax Benefit | Best NGO Delhi',
    description: 'Donate to Spread A Smile India - Best NGO in Delhi. Support street children education, healthcare & women empowerment. 80G tax benefits. Online donation. Every contribution transforms lives!',
    keywords: 'donate to ngo delhi, online donation india, 80g donation, support ngo, charity donation india, donate to best ngo, help street children, ngo donation online, tax benefit donation, donate education'
  },

  '/get-involved/partners': {
    title: 'Partner With Us - CSR & Corporate Partnerships',
    description: 'Corporate Social Responsibility partnerships with Spread A Smile India. CSR opportunities, employee engagement programs, and long-term collaborations for social impact.',
    keywords: 'csr partnership, corporate partnership ngo, csr activities delhi, employee engagement programs'
  },

  '/get-involved/careers': {
    title: 'Careers - Join Our Team | Work for Social Change',
    description: 'Career opportunities at Spread A Smile India. Join our passionate team working to transform lives through education and empowerment. Current openings and internships.',
    keywords: 'ngo jobs, ngo careers delhi, social work jobs, ngo internship, work at ngo'
  },

  // Media
  '/media': {
    title: 'Media Coverage - Press Releases, News & Gallery',
    description: 'Media coverage, press releases, photo gallery, and video stories from Spread A Smile India. Stay updated with our latest news and activities.',
    keywords: 'ngo media, press coverage, photo gallery, ngo news, video stories'
  },

  // Candle Shop
  '/candle-shop': {
    title: 'Candle Shop - Handmade Candles Supporting Education',
    description: 'Shop handmade eco-friendly candles crafted by our vocational training program. Every purchase supports street children\'s education and women empowerment. Shop for a cause!',
    keywords: 'handmade candles, eco-friendly candles, buy candles online, support ngo shopping, charity shop india'
  },

  '/candle-shop/collections': {
    title: 'Candle Collections - Luxury Handmade Candles',
    description: 'Explore our curated candle collections: Scented candles, decorative candles, gift sets. Handcrafted with love, supporting education and empowerment.',
    keywords: 'candle collections, scented candles, decorative candles, luxury candles, gift candles'
  },

  // Contact
  '/contact': {
    title: 'Contact Us - Get in Touch | Spread A Smile India',
    description: 'Contact Spread A Smile India: Address - 108/A Munirka Village, Delhi 110067 | Phone: +91-97178-66620 | Email: contact@spreadasmileindia.org',
    keywords: 'contact ngo, ngo address delhi, munirka ngo contact, spread a smile contact'
  }
};

/**
 * Get SEO data for a specific path
 * @param {string} path - Request path
 * @returns {object} SEO metadata object
 */
function getSEOData(path) {
  // Remove trailing slash for consistency
  const normalizedPath = path.endsWith('/') && path !== '/' 
    ? path.slice(0, -1) 
    : path;

  // Get page-specific SEO or fall back to default
  const seoData = seoConfig[normalizedPath] || seoConfig.default;

  return {
    title: seoData.title,
    metaDescription: seoData.description,
    keywords: seoData.keywords || seoConfig.default.keywords,
    ogImage: seoData.ogImage || seoConfig.default.ogImage,
    twitterImage: seoData.twitterImage || seoConfig.default.twitterImage,
    currentPath: normalizedPath
  };
}

/**
 * Generate canonical URL with proper normalization
 * Forces HTTPS + www, removes query strings, removes trailing slashes (except root)
 */
function getCanonicalUrl(req) {
  // Prefer forwarded proto if behind proxy (GoDaddy uses proxies)
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').toLowerCase();
  
  // Get host and remove default ports
  let host = req.get('host') || 'www.spreadasmileindia.com';
  host = host.replace(/:80$|:443$/, '');
  
  // Use req.path (no query string)
  let path = req.path || '/';
  
  // Normalize path:
  // 1. Remove index.html
  path = path.replace(/\/index\.html$/i, '/');
  
  // 2. Remove trailing slash except for root
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  // Force canonical host (www + domain)
  const preferredHost = 'www.spreadasmileindia.com';
  
  // Always use HTTPS for canonical
  return `https://${preferredHost}${path}`;
}

/**
 * Express middleware to inject SEO data into all routes
 */
function seoMiddleware(req, res, next) {
  const seoData = getSEOData(req.path);
  
  // Generate canonical URL
  const canonical = getCanonicalUrl(req);
  
  // Make SEO data available to all templates
  res.locals.seo = seoData;
  res.locals.title = seoData.title;
  res.locals.metaDescription = seoData.metaDescription;
  res.locals.keywords = seoData.keywords;
  res.locals.currentPath = seoData.currentPath;
  res.locals.ogImage = seoData.ogImage;
  res.locals.twitterImage = seoData.twitterImage;
  res.locals.canonical = canonical; // Add canonical URL
  
  next();
}

module.exports = {
  seoConfig,
  getSEOData,
  seoMiddleware,
  getCanonicalUrl
};
