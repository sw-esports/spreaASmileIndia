const express = require('express');
const router = express.Router();

// Newsletter signup endpoint
router.post('/newsletter-signup', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // TODO: Save to database
        console.log('Newsletter signup:', email);
        
        // TODO: Send welcome email
        // await sendWelcomeEmail(email);
        
        // TODO: Add to mailing list (e.g., Mailchimp, SendGrid)
        // await addToMailingList(email);

        res.json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter!' 
        });
        
    } catch (error) {
        console.error('Newsletter signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again.' 
        });
    }
});

// Volunteer signup endpoint
router.post('/volunteer-signup', async (req, res) => {
    try {
        const { name, email, phone, location, interest, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !phone || !location) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Validate phone
        if (!isValidPhone(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid phone number' 
            });
        }

        // Create volunteer application object
        const volunteerApplication = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            location: location.trim(),
            interest: interest || 'other',
            message: message ? message.trim() : '',
            appliedAt: new Date(),
            status: 'pending'
        };

        // TODO: Save to database
        console.log('Volunteer application:', volunteerApplication);
        
        // TODO: Send confirmation email to volunteer
        // await sendVolunteerConfirmationEmail(volunteerApplication);
        
        // TODO: Send notification email to admin
        // await sendAdminNotificationEmail(volunteerApplication);

        res.json({ 
            success: true, 
            message: 'Thank you for your interest! We will contact you soon.' 
        });
        
    } catch (error) {
        console.error('Volunteer signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again.' 
        });
    }
});

// Contact form endpoint
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Create contact inquiry object
        const contactInquiry = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : '',
            subject: subject.trim(),
            message: message.trim(),
            submittedAt: new Date(),
            status: 'new'
        };

        // TODO: Save to database
        console.log('Contact inquiry:', contactInquiry);
        
        // TODO: Send auto-reply email
        // await sendContactAutoReply(contactInquiry);
        
        // TODO: Send notification email to admin
        // await sendContactNotificationEmail(contactInquiry);

        res.json({ 
            success: true, 
            message: 'Thank you for your message! We will get back to you soon.' 
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again.' 
        });
    }
});

// Instagram feed endpoint (mock data)
router.get('/instagram-feed', async (req, res) => {
    try {
        // TODO: Integrate with Instagram Basic Display API
        // For now, return mock data
        const mockFeed = [
            {
                id: '1',
                type: 'image',
                url: '/src/images/feed/post-1.jpg',
                caption: 'Celebrating our students\' achievements! 🎓✨',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                likes: 245,
                comments: 18
            },
            {
                id: '2',
                type: 'video',
                url: '/src/videos/reel-1.mp4',
                thumbnail: '/src/images/feed/video-1-thumb.jpg',
                caption: 'Behind the scenes of our skill development program 💪',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                likes: 189,
                comments: 12
            },
            {
                id: '3',
                type: 'image',
                url: '/src/images/feed/post-2.jpg',
                caption: 'Community health camp reaching 200+ families 🏥❤️',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                likes: 312,
                comments: 25
            }
        ];

        res.json({ 
            success: true, 
            data: mockFeed 
        });
        
    } catch (error) {
        console.error('Instagram feed error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not load Instagram feed' 
        });
    }
});

// Statistics endpoint
router.get('/statistics', async (req, res) => {
    try {
        // TODO: Get real statistics from database
        const stats = {
            childrenImpacted: 2500,
            currentlyInSchool: 1800,
            womenTrained: 950,
            yearsOfService: 15,
            projectsCompleted: 125,
            volunteersActive: 85,
            partnersSupporting: 32,
            statesReached: 5
        };

        res.json({ 
            success: true, 
            data: stats 
        });
        
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not load statistics' 
        });
    }
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digits and check if it's a valid Indian phone number
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 13;
}

module.exports = router;