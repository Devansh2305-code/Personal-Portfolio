// Navigation Bar Scroll Effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section, header');
function setActiveLink() {
    let currentSection = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute('id') || 'home';
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}` || (currentSection === 'home' && href === '#home')) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// Profile Image Upload/Change Simulator
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

// Subtitle Auto-Typing Effect
const subtitleElement = document.querySelector('.hero-subtitle');
if (subtitleElement) {
    const roles = ["Data Analyst", "AI Enthusiast", "Research Scholar", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRoles() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            subtitleElement.innerHTML = currentRole.substring(0, charIndex - 1) + '<span class="logo-dot">_</span>';
            charIndex--;
            typingSpeed = 50;
        } else {
            subtitleElement.innerHTML = currentRole.substring(0, charIndex + 1) + '<span class="logo-dot">_</span>';
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeRoles, typingSpeed);
    }
    
    // Start typing on load
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(typeRoles, 1000);
    });
}

// Project Dynamic Card Spotlight Glare Effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        // Dynamic border highlight style helper
        card.style.boxShadow = `0 15px 35px rgba(99, 102, 241, 0.15), radial-gradient(800px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// Dynamic Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Active status classes
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'flex';
                // Trigger reflow for transition
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Project Modal Detailed Profiles
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const viewMoreBtns = document.querySelectorAll('.view-more-btn');

const projectDetails = {
    'bi-dashboard': {
        title: 'BI Dashboard Builder',
        description: `
            <h3>Project Overview</h3>
            <p>An automated business intelligence tool designed to bridge the gap between raw unstructured spreadsheets and interactive business analysis dashboards. Ideal for organizations seeking instant visualization assets without complex configurations.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>CSV / Excel Ingestion:</strong> Drag-and-drop raw records interface supporting custom table schemas.</li>
                <li><strong>Automated Data Sanitizer:</strong> Detects and standardizes dates, addresses null records, matches values, and structures attributes.</li>
                <li><strong>Dynamic Analytics Sandbox:</strong> Instantly generates key summaries, correlation coefficients, and trend charts.</li>
                <li><strong>Responsive Dashboard Panel:</strong> High-performance chart filters to view breakdowns by dates, tags, and parameters.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>TypeScript & HTML5 Canvas Engines</li>
                <li>Pandas & NumPy ETL processing logic (mocked client-side)</li>
                <li>ChartJS & D3 visualization layers</li>
                <li>Vanilla CSS Custom Property systems</li>
            </ul>
        `
    },
    'skin-detector': {
        title: 'AI Skin Disease Detector',
        description: `
            <h3>Project Overview</h3>
            <p>An advanced computer vision diagnostic model developed to assist users, particularly in underserved regions, in scanning and evaluating dermatological conditions. Supported by publication findings in the <em>International Journal of Research and Publication Reviews (IJRPR)</em>.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Computer Vision Diagnostician:</strong> Analyzes user skin photos to categorize dermatological conditions using Convolutional Neural Networks.</li>
                <li><strong>Educational Triage Panel:</strong> Offers detailed overviews of identified conditions, guidance on home care steps, and severity level scales.</li>
                <li><strong>Offline Care Guides:</strong> Access to wellness metrics and remedies for areas with poor internet connection.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Python & Jupyter Notebook environments</li>
                <li>TensorFlow, Keras, and MobileNet v2 neural structures</li>
                <li>OpenCV image preprocessing layers</li>
                <li>Flask API middleware services</li>
            </ul>
        `
    },
    'resume-checker': {
        title: 'AI Resume Checker',
        description: `
            <h3>Project Overview</h3>
            <p>An intelligent resume analysis tool designed to optimize application visibility. Leverages localized AI models to evaluate formatting, keyword matching, and Applicant Tracking System (ATS) compliance.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>ATS Parser:</strong> Automatically reviews resume schemas to flag parsing errors, layout warnings, or incorrect sections.</li>
                <li><strong>Keyword Optimization Matrix:</strong> Matches resumes against target job descriptions to identify missing technical keywords.</li>
                <li><strong>Actionable Feedback Panel:</strong> Generates custom rewrite recommendations for work experience bullet points.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Python & Ollama LLM integration</li>
                <li>Llama 3 NLP Models</li>
                <li>PyPDF2 & PDFMiner text extraction libraries</li>
                <li>React Web UI container</li>
            </ul>
        `
    },
    'voice-assistant': {
        title: 'Voice AI Assistant',
        description: `
            <h3>Project Overview</h3>
            <p>An intelligent, conversational companion agent capable of processing vocal input commands, parsing user intent, executing utility tasks, and vocalizing responses.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Real-time Speech Synthesis:</strong> High-performance speech-to-text and text-to-speech pipelines.</li>
                <li><strong>Intent Engine:</strong> Parses conversational intent to trigger tasks such as drafting emails, retrieving weather forecasts, or running calculations.</li>
                <li><strong>Context-Aware NLP:</strong> Retains multi-turn conversation memory for natural dialogue.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Python & OpenAI API interfaces</li>
                <li>SpeechRecognition & PyAudio pipelines</li>
                <li>gTTS & Pyttsx3 speech engines</li>
                <li>BeautifulSoup utility scraping scripts</li>
            </ul>
        `
    },
    'shoplink': {
        title: 'ShopLink Platform',
        description: `
            <h3>Project Overview</h3>
            <p>A high-performance e-commerce management platform built to synchronize customer shopping interfaces with back-end inventory states in real time.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Live Inventory Tracker:</strong> Updates catalog counts across all active client pages when sales occur or stock is added.</li>
                <li><strong>Secure Authorization Gateway:</strong> Implements OAuth user validation patterns and checkout tracking.</li>
                <li><strong>Admin Dashboard:</strong> Comprehensive dashboard for managing products, categories, and tracking order completions.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>React.js (Context API and Custom Hooks)</li>
                <li>Supabase real-time database subscription sockets</li>
                <li>Firebase User Authentication</li>
                <li>Vanilla CSS variables with Glassmorphic variables</li>
            </ul>
        `
    },
    'health-ai': {
        title: 'HealthAI Chatbot',
        description: `
            <h3>Project Overview</h3>
            <p>An offline-accessible medical advisory assistant developed for rural or isolated zones where access to clinics and internet bandwidth is severely constrained.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Symptom Evaluator:</strong> Conversational dialogue engine analyzing symptom descriptions to suggest potential concerns.</li>
                <li><strong>Emergency Guidelines:</strong> Instant access to offline-stored manuals, first-aid protocols, and directory cards.</li>
                <li><strong>Medical Dictionary:</strong> Explains complex medical terminology and prescriptions in plain language.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Python & Jupyter Notebook development structures</li>
                <li>NLTK & spaCy natural language tokenizers</li>
                <li>SQLite local indexing directories</li>
                <li>JSON schema mapping tools</li>
            </ul>
        `
    },
    'learn-ai': {
        title: 'LearnAI Workspace',
        description: `
            <h3>Project Overview</h3>
            <p>An educational companion project built for Hack-o-Mania, designed to help students learn complex topics through multi-modal query inputs.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Multi-modal Inputs:</strong> Supports typing queries, scanning questions from textbook images, or asking via voice.</li>
                <li><strong>Structured Explanations:</strong> Breaks down complex concepts into step-by-step learning modules.</li>
                <li><strong>Voice Synthesis Output:</strong> Speaks solutions back to support auditory learning styles.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>Tesseract OCR for image text extraction</li>
                <li>Python NLTK text processing engines</li>
                <li>SpeechRecognition APIs</li>
                <li>Responsive mobile web layouts</li>
            </ul>
        `
    },
    'cooking-chatbot': {
        title: 'AI Cooking Chatbot',
        description: `
            <h3>Project Overview</h3>
            <p>An interactive culinary assistant chatbot that generates recipes based on available ingredients and user preferences.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Ingredient Matching:</strong> Suggests recipes using only ingredients already in your pantry.</li>
                <li><strong>Culinary Substitutions:</strong> Recommends alternatives for missing ingredients or dietary restrictions.</li>
                <li><strong>Smart Scaling:</strong> Dynamically adjusts ingredient measurements based on serving size.</li>
            </ul>
            
            <h4>Technologies Used</h4>
            <ul>
                <li>HTML5 & CSS3 layout systems</li>
                <li>JavaScript State logic</li>
                <li>NLP prompt templates</li>
            </ul>
        `
    }
};

viewMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectKey = btn.getAttribute('data-project');
        const details = projectDetails[projectKey];
        
        if (details && modal) {
            document.getElementById('modalTitle').textContent = details.title;
            document.getElementById('modalDescription').innerHTML = details.description;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
        }
    });
});

if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Resume scroll
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Feedback Form Submission Handler
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const feedbackText = document.getElementById('feedback').value;
        
        // Simulating data transmission
        console.log('Feedback submitted:', { name, feedbackText });
        
        // Show styled success alert
        alert(`Thank you, ${name}! Your feedback has been logged successfully.`);
        
        feedbackForm.reset();
    });
}

// Share Button logic for Publications
const shareBtn = document.querySelector('.share-btn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const publicationUrl = 'https://ijrpr.com/uploads/V6ISSUE5/IJRPR44601.pdf';
        const publicationTitle = 'AI Powered Skin Disease Detector - Devansh Jain';
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: publicationTitle,
                    text: 'Check out Devansh Jain\'s research publication on AI-Powered Skin Disease Detection!',
                    url: publicationUrl
                });
            } catch (err) {
                console.log('Share error:', err);
            }
        } else {
            // Fallback: Copy link to clipboard
            navigator.clipboard.writeText(publicationUrl);
            alert('Publication link copied to clipboard!');
        }
    });
}

// Back to Top Button Actions
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400 && backToTopBtn) {
        backToTopBtn.classList.add('visible');
    } else if (backToTopBtn) {
        backToTopBtn.classList.remove('visible');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Skill Progress Bar Animation trigger
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
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
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    
    observer.observe(skillsSection);
}

// Counter Animation helper
function animateCounter(element, target, duration = 1800) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.getAttribute('data-suffix') || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.getAttribute('data-suffix') || '');
        }
    }, 16);
}

// Animate statistics counters
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const numberStr = stat.textContent.trim();
                    const value = parseInt(numberStr);
                    const suffix = numberStr.includes('+') ? '+' : '';
                    if (suffix) {
                        stat.setAttribute('data-suffix', suffix);
                    }
                    animateCounter(stat, value);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    statsObserver.observe(heroStats);
}

// Animate on Scroll Intersection Observer (AOS Simulator)
const observeElements = document.querySelectorAll('[data-aos]');
if (observeElements.length > 0) {
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.12 });
    
    observeElements.forEach(element => {
        elementObserver.observe(element);
    });
}

// Developer Welcome Message
console.log('%c🚀 Welcome to Devansh\'s Portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the repository on GitHub!', 'color: #a855f7; font-size: 14px;');
console.log('%chttps://github.com/Devansh2305-code/Personal-Portfolio', 'color: #14b8a6; font-size: 12px;');