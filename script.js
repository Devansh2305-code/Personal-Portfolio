// Navigation Bar Scroll Effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');

function setActiveLink() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// Profile Image Upload/Change
const profileImage = document.getElementById('profileImage');
if (profileImage) {
    profileImage.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
}

// Project Modal
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const viewMoreBtns = document.querySelectorAll('.view-more-btn');

const projectDetails = {
    shoplink: {
        title: 'ShopLink - E-commerce Platform',
        description: `
            <h3>Project Overview</h3>
            <p>ShopLink is a comprehensive e-commerce platform with real-time inventory management, designed to streamline online shopping experiences.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li>Real-time inventory tracking and management</li>
                <li>User authentication and authorization with Firebase</li>
                <li>Responsive design for mobile and desktop</li>
                <li>Shopping cart and checkout functionality</li>
                <li>Product search and filtering</li>
                <li>Admin dashboard for managing products</li>
                <li>Integration with Supabase for database management</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>React.js for frontend development</li>
                <li>Firebase for authentication and hosting</li>
                <li>Supabase for database management</li>
                <li>CSS3 for styling and animations</li>
                <li>RESTful API integration</li>
            </ul>
            
            <h4>Challenges & Solutions</h4>
            <p>One of the main challenges was implementing real-time inventory updates. This was solved by leveraging Supabase's real-time subscriptions to ensure data consistency across all users.</p>
        `
    },
    resume: {
        title: 'AI Resume Checker',
        description: `
            <h3>Project Overview</h3>
            <p>An intelligent resume analysis tool powered by AI that helps job seekers optimize their resumes for better opportunities.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li>AI-powered resume analysis using NLP</li>
                <li>Keyword optimization suggestions</li>
                <li>ATS (Applicant Tracking System) compatibility check</li>
                <li>Grammar and spelling correction</li>
                <li>Format and structure recommendations</li>
                <li>Industry-specific suggestions</li>
                <li>Score-based evaluation system</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Python for backend processing</li>
                <li>TensorFlow for machine learning models</li>
                <li>Natural Language Processing (NLP) libraries</li>
                <li>Flask for API development</li>
                <li>React for user interface</li>
            </ul>
            
            <h4>Impact</h4>
            <p>This tool has helped numerous job seekers improve their resumes, with an average score improvement of 35% after implementing the suggestions.</p>
        `
    },
    voice: {
        title: 'AI Voice Assistant',
        description: `
            <h3>Project Overview</h3>
            <p>An intelligent voice-activated personal assistant capable of understanding natural language and performing various tasks.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li>Voice recognition and processing</li>
                <li>Natural language understanding</li>
                <li>Task automation (emails, reminders, web searches)</li>
                <li>Weather updates and news briefings</li>
                <li>Music playback control</li>
                <li>Smart home integration capabilities</li>
                <li>Conversational AI with context awareness</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Python for core functionality</li>
                <li>Speech Recognition library</li>
                <li>OpenAI API for natural language processing</li>
                <li>Text-to-Speech (TTS) engines</li>
                <li>Web scraping for information retrieval</li>
            </ul>
            
            <h4>Future Enhancements</h4>
            <p>Planning to add multi-language support, improved context retention, and integration with more third-party services and APIs.</p>
        `
    }
};

viewMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const project = btn.getAttribute('data-project');
        const details = projectDetails[project];
        
        if (details) {
            document.getElementById('modalTitle').textContent = details.title;
            document.getElementById('modalDescription').innerHTML = details.description;
            modal.style.display = 'block';
        }
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Feedback Form Submission
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const feedback = document.getElementById('feedback').value;
        
        // Here you would typically send this data to a backend or email service
        console.log('Feedback submitted:', { name, feedback });
        
        // Show success message
        alert(`Thank you, ${name}! Your feedback has been submitted successfully.`);
        
        // Reset form
        feedbackForm.reset();
    });
}

// Share Button for Publications
const shareBtn = document.querySelector('.share-btn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const publicationUrl = 'https://lnkd.in/drU_9Swc';
        const publicationTitle = 'AI Powered Skin Disease Detector - Research Paper';
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: publicationTitle,
                    text: 'Check out this research paper on AI-powered skin disease detection!',
                    url: publicationUrl
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(publicationUrl);
            alert('Link copied to clipboard!');
        }
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Skill Progress Bar Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const progressBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    progressBarObserver.observe(skillsSection);
}

// Simple AOS (Animate On Scroll) Implementation
const observeElements = document.querySelectorAll('[data-aos]');

const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, {
    threshold: 0.2
});

observeElements.forEach(element => {
    elementObserver.observe(element);
});

// Typing Effect for Hero Subtitle (Optional Enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on page load
// window.addEventListener('load', () => {
//     const subtitle = document.querySelector('.hero-subtitle');
//     const originalText = subtitle.textContent;
//     typeWriter(subtitle, originalText, 80);
// });

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Animate stats counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Theme Toggle (Optional - for future dark/light mode)
// This can be expanded later
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme on page load
initTheme();

// Prevent default behavior for download CV if file doesn't exist
const downloadBtn = document.querySelector('a[download]');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        const href = downloadBtn.getAttribute('href');
        if (href === './resume.pdf') {
            // Check if resume exists, otherwise show message
            fetch(href)
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        alert('Resume file is not available yet. Please check back later!');
                    }
                })
                .catch(() => {
                    e.preventDefault();
                    alert('Resume file is not available yet. Please check back later!');
                });
        }
    });
}

// Console message for developers
console.log('%c🚀 Welcome to Devansh\'s Portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the repository on GitHub!', 'color: #8b5cf6; font-size: 14px;');
console.log('%chttps://github.com/Devansh2305-code/Personal-Portfolio', 'color: #ec4899; font-size: 12px;');