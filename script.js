// Navigation Wheel Elements
const navWheel = document.getElementById('navWheel');
const navWheelContainer = document.getElementById('navWheelContainer');
const navWheelItems = document.querySelectorAll('.nav-wheel-item');
const projectSubdivision = document.getElementById('projectSubdivision');
const subBtns = document.querySelectorAll('.sub-btn');

// Target rotation map for active sections
// As the section changes, the wheel rotates to position the active section at the left point (180deg)
const rotationMap = {
    'home': 90,
    'skills': 60,
    'experience': 30,
    'projects': 0,
    'publications': -30,
    'certifications': -60,
    'feedback': -90
};

const sections = document.querySelectorAll('section, header');

// Add tooltip hint to navigation wheel container
if (navWheelContainer && !document.querySelector('.nav-wheel-tooltip')) {
    const tooltip = document.createElement('div');
    tooltip.className = 'nav-wheel-tooltip';
    tooltip.textContent = '⚡ Double-click & hold curve to move cursor';
    navWheelContainer.appendChild(tooltip);
}

let isWheelDragging = false;
let lastWheelClickTime = 0;

// Update wheel rotation & scroll position continuous mapping from pointer
function updateWheelFromPointer(clientX, clientY) {
    if (!navWheelContainer || !navWheel) return;

    const rect = navWheelContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate vertical offset relative to wheel center
    const maxRange = rect.height * 0.42;
    let normalizedY = (clientY - centerY) / maxRange;
    normalizedY = Math.max(-1, Math.min(1, normalizedY));

    // Map Y position to target rotation (-90deg at bottom, +90deg at top)
    const targetRotation = -normalizedY * 90;

    // Direct continuous update to wheel style
    navWheel.style.setProperty('--wheel-rotation', `${targetRotation}deg`);

    // Synchronize page scroll position linearly with wheel rotation
    const scrollProgress = (90 - targetRotation) / 180; // 0 (top) to 1 (bottom)
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetScrollY = scrollProgress * maxScroll;

    window.scrollTo({
        top: targetScrollY,
        behavior: 'auto'
    });

    // Dynamically update active section label based on closest angle
    let currentSection = 'home';
    let minDiff = Infinity;
    Object.keys(rotationMap).forEach(sec => {
        const diff = Math.abs(rotationMap[sec] - targetRotation);
        if (diff < minDiff) {
            minDiff = diff;
            currentSection = sec;
        }
    });

    navWheelItems.forEach(item => {
        if (item.getAttribute('data-section') === currentSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (currentSection === 'projects') {
        if (projectSubdivision) projectSubdivision.classList.add('visible');
    } else {
        if (projectSubdivision) projectSubdivision.classList.remove('visible');
    }
}

function startWheelDrag(e) {
    isWheelDragging = true;
    if (navWheelContainer) {
        navWheelContainer.classList.add('dragging');
    }
    document.body.classList.add('wheel-dragging-active');
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    updateWheelFromPointer(clientX, clientY);
}

function stopWheelDrag() {
    if (!isWheelDragging) return;
    isWheelDragging = false;

    if (navWheelContainer) {
        navWheelContainer.classList.remove('dragging');
    }
    document.body.classList.remove('wheel-dragging-active');

    handleScroll();
}

// Mouse Event Listeners for Double-click & Hold / Drag
if (navWheelContainer) {
    navWheelContainer.addEventListener('mousedown', (e) => {
        const now = Date.now();
        // Check for double click interval (< 380ms)
        if (now - lastWheelClickTime < 380) {
            e.preventDefault();
            startWheelDrag(e);
        }
        lastWheelClickTime = now;
    });

    navWheelContainer.addEventListener('dblclick', (e) => {
        e.preventDefault();
        startWheelDrag(e);
    });

    // Touch Event Listeners for Mobile Double-tap & Hold / Drag (Non-blocking for normal scrolling)
    let lastTouchTime = 0;
    navWheelContainer.addEventListener('touchstart', (e) => {
        const now = Date.now();
        if (now - lastTouchTime < 400 && e.touches.length === 1) {
            // Only activate drag on intentional double-tap & hold
            startWheelDrag(e);
        }
        lastTouchTime = now;
    }, { passive: true });

    navWheelContainer.addEventListener('touchmove', (e) => {
        if (isWheelDragging) {
            e.preventDefault(); // Only prevent default if double-tap drag mode is explicitly active
            const touch = e.touches[0];
            updateWheelFromPointer(touch.clientX, touch.clientY);
        }
    }, { passive: false });

    navWheelContainer.addEventListener('touchend', () => {
        if (isWheelDragging) {
            stopWheelDrag();
        }
    });

    navWheelContainer.addEventListener('touchcancel', () => {
        if (isWheelDragging) {
            stopWheelDrag();
        }
    });
}

// Global Mouse move & up listeners to keep dragging smooth even outside container
window.addEventListener('mousemove', (e) => {
    if (isWheelDragging) {
        if (e.buttons === 0) {
            stopWheelDrag();
            return;
        }
        e.preventDefault();
        updateWheelFromPointer(e.clientX, e.clientY);
    }
});

window.addEventListener('mouseup', () => {
    if (isWheelDragging) {
        stopWheelDrag();
    }
});

// Set active link scroll-spy and rotate wheel
function handleScroll() {
    if (isWheelDragging) return;

    let currentSection = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 250) {
            currentSection = section.getAttribute('id') || 'home';
        }
    });

    // Special check for page bottom to highlight Contact (feedback)
    if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 20) {
        currentSection = 'feedback';
    }

    // Set wheel rotation angle
    const targetRotation = rotationMap[currentSection] !== undefined ? rotationMap[currentSection] : 90;
    if (navWheel) {
        navWheel.style.setProperty('--wheel-rotation', `${targetRotation}deg`);
    }

    // Set active class on wheel items
    navWheelItems.forEach(item => {
        const sectionName = item.getAttribute('data-section');
        if (sectionName === currentSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Show/hide project categories subdivision menu
    if (currentSection === 'projects') {
        if (projectSubdivision) projectSubdivision.classList.add('visible');
    } else {
        if (projectSubdivision) projectSubdivision.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);
// Run on load
document.addEventListener('DOMContentLoaded', () => {
    handleScroll();
});

// Handle clicking on wheel items to scroll to corresponding section
navWheelItems.forEach(item => {
    item.addEventListener('click', () => {
        if (isWheelDragging) return;
        const sectionId = item.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
});

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
        card.style.boxShadow = `0 15px 35px rgba(95, 111, 82, 0.12), radial-gradient(800px circle at ${x}px ${y}px, rgba(95, 111, 82, 0.05), transparent 40%)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// Dynamic Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');

function filterProjects(filterValue) {
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
}

// Sync selection visual states helper
function syncFilterStates(filterValue) {
    // Sync main project filter tabs
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filterValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Sync subdivision navigation wheel buttons
    if (subBtns) {
        subBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === filterValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        syncFilterStates(filterValue);
        filterProjects(filterValue);
    });
});

if (subBtns) {
    subBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop click propagation to parent wheel items
            const filterValue = button.getAttribute('data-filter');
            syncFilterStates(filterValue);
            filterProjects(filterValue);
            
            // Also scroll to the project section if not fully visible, for convenience
            const projectSection = document.getElementById('projects');
            if (projectSection) {
                window.scrollTo({
                    top: projectSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

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

// ==========================================
// SECRET ADMIN CMS & GITHUB DIRECT SYNC ENGINE
// ==========================================

const DEFAULT_PROJECTS = [
    {
        id: 'bi-dashboard',
        title: 'BI Dashboard Builder',
        category: 'data-analytics',
        brief: 'Automated data sanitizer & business analytics dashboard generator for unstructured datasets.',
        tags: ['TypeScript', 'Pandas', 'ChartJS', 'D3.js'],
        link: 'https://github.com/Devansh2305-code/Personal-Portfolio',
        hidden: false
    },
    {
        id: 'skin-detector',
        title: 'AI Skin Disease Detector',
        category: 'ai-ml',
        brief: 'Deep learning diagnostic system published in IJRPR for identifying dermatological conditions.',
        tags: ['Python', 'TensorFlow', 'MobileNet', 'OpenCV'],
        link: 'https://github.com/Devansh2305-code/Personal-Portfolio',
        hidden: false
    },
    {
        id: 'resume-checker',
        title: 'AI Resume Checker & Optimizer',
        category: 'ai-ml',
        brief: 'NLP-driven tool comparing resumes against job descriptions with ATS match scoring.',
        tags: ['Python', 'NLP', 'Scikit-Learn', 'Flask'],
        link: 'https://github.com/Devansh2305-code/Personal-Portfolio',
        hidden: false
    }
];

const DEFAULT_SKILLS = [
    { id: 'sk-1', name: 'Python & Data Science', category: 'Language & Framework', icon: 'fab fa-python', level: 92 },
    { id: 'sk-2', name: 'TensorFlow & PyTorch', category: 'Machine Learning', icon: 'fas fa-brain', level: 88 },
    { id: 'sk-3', name: 'SQL & Data Warehousing', category: 'Database', icon: 'fas fa-database', level: 85 },
    { id: 'sk-4', name: 'Power BI & Tableau', category: 'Analytics', icon: 'fas fa-chart-bar', level: 90 },
    { id: 'sk-5', name: 'TypeScript / Web Dev', category: 'Frontend', icon: 'fab fa-js-square', level: 82 }
];

const DEFAULT_EXPERIENCE = [
    {
        id: 'exp-1',
        title: 'AI & Healthcare Tech Researcher',
        org: 'Research Scholar / Independent',
        date: '2024 - Present',
        desc: 'Author of published dermatological AI diagnostic research in IJRPR. Developing computer vision tools for automated healthcare accessibility.'
    },
    {
        id: 'exp-2',
        title: 'Data Analyst & Machine Learning Engineer',
        org: 'Personal Portfolio Projects',
        date: '2023 - Present',
        desc: 'Architected automated BI Dashboard Builders, ATS Resume matchers, and predictive analytics tools using Python and SQL.'
    }
];

let projectsState = JSON.parse(localStorage.getItem('portfolio_projects_data')) || DEFAULT_PROJECTS;
let skillsState = JSON.parse(localStorage.getItem('portfolio_skills_data')) || DEFAULT_SKILLS;
let experienceState = JSON.parse(localStorage.getItem('portfolio_experience_data')) || DEFAULT_EXPERIENCE;

function saveAdminState() {
    localStorage.setItem('portfolio_projects_data', JSON.stringify(projectsState));
    localStorage.setItem('portfolio_skills_data', JSON.stringify(skillsState));
    localStorage.setItem('portfolio_experience_data', JSON.stringify(experienceState));
}

// Render dynamic projects on portfolio page
function renderPortfolioProjects() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    grid.innerHTML = '';
    projectsState.filter(p => !p.hidden).forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', proj.category);
        card.setAttribute('data-id', proj.id);

        const tagsHTML = (proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

        card.innerHTML = `
            <div class="project-header">
                <h3>${proj.title}</h3>
                <span class="project-badge">${proj.category.toUpperCase().replace('-', ' ')}</span>
            </div>
            <p class="project-brief">${proj.brief}</p>
            <div class="project-tags">${tagsHTML}</div>
            <div class="project-footer">
                <a href="${proj.link || '#'}" target="_blank" class="btn btn-secondary view-more-btn">
                    <i class="fab fa-github"></i> View Details
                </a>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-bind card spotlight glare effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.boxShadow = `0 15px 35px rgba(95, 111, 82, 0.12), radial-gradient(800px circle at ${x}px ${y}px, rgba(95, 111, 82, 0.05), transparent 40%)`;
        });
        card.addEventListener('mouseleave', () => { card.style.boxShadow = ''; });
    });
}

// Render skills dynamically
function renderPortfolioSkills() {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;

    grid.innerHTML = '';
    skillsState.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <i class="${skill.icon || 'fas fa-code'} skill-icon"></i>
            <h3>${skill.name}</h3>
            <span class="skill-category">${skill.category || 'Skill'}</span>
            <div class="skill-progress">
                <div class="progress-bar" style="width: ${skill.level || 80}%"></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render experience dynamically
function renderPortfolioExperience() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = '';
    experienceState.forEach((exp, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');

        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-date">${exp.date}</span>
                <h3>${exp.title}</h3>
                <h4>${exp.org}</h4>
                <p>${exp.desc}</p>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// Render list items in Admin Management Panel
function renderAdminLists() {
    const projList = document.getElementById('adminProjectsList');
    const skillList = document.getElementById('adminSkillsList');
    const expList = document.getElementById('adminExperienceList');

    if (projList) {
        projList.innerHTML = projectsState.map(p => `
            <div class="admin-item-row">
                <div class="admin-item-info">
                    <strong>${p.title} ${p.hidden ? '<small style="color:var(--error)">(Hidden)</small>' : ''}</strong>
                    <span>Cat: ${p.category} | Tags: ${(p.tags || []).join(', ')}</span>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-item-action toggle-hidden ${p.hidden ? 'is-hidden' : ''}" onclick="toggleProjectVisibility('${p.id}')" title="Toggle Visibility">
                        <i class="fas ${p.hidden ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </button>
                    <button class="btn-item-action delete" onclick="deleteProject('${p.id}')" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    if (skillList) {
        skillList.innerHTML = skillsState.map(s => `
            <div class="admin-item-row">
                <div class="admin-item-info">
                    <strong><i class="${s.icon}"></i> ${s.name}</strong>
                    <span>Level: ${s.level}% | Cat: ${s.category}</span>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-item-action delete" onclick="deleteSkill('${s.id}')" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    if (expList) {
        expList.innerHTML = experienceState.map(e => `
            <div class="admin-item-row">
                <div class="admin-item-info">
                    <strong>${e.title} @ ${e.org}</strong>
                    <span>${e.date}</span>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-item-action delete" onclick="deleteExperience('${e.id}')" title="Delete Experience">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Global action handlers for window scope
window.toggleProjectVisibility = function(id) {
    projectsState = projectsState.map(p => p.id === id ? { ...p, hidden: !p.hidden } : p);
    saveAdminState();
    renderPortfolioProjects();
    renderAdminLists();
};

window.deleteProject = function(id) {
    if (confirm('Delete this project from portfolio?')) {
        projectsState = projectsState.filter(p => p.id !== id);
        saveAdminState();
        renderPortfolioProjects();
        renderAdminLists();
    }
};

window.deleteSkill = function(id) {
    if (confirm('Delete this skill?')) {
        skillsState = skillsState.filter(s => s.id !== id);
        saveAdminState();
        renderPortfolioSkills();
        renderAdminLists();
    }
};

window.deleteExperience = function(id) {
    if (confirm('Delete this experience timeline item?')) {
        experienceState = experienceState.filter(e => e.id !== id);
        saveAdminState();
        renderPortfolioExperience();
        renderAdminLists();
    }
};

// DIRECT GITHUB API AUTO-SYNC
async function syncGithubRepos() {
    const usernameInput = document.getElementById('githubUsernameInput');
    const statusMsg = document.getElementById('syncStatusMsg');
    const username = usernameInput ? usernameInput.value.trim() : 'Devansh2305-code';

    if (!username) {
        if (statusMsg) statusMsg.innerHTML = '<span class="sync-status-msg error">Please enter a valid GitHub username.</span>';
        return;
    }

    if (statusMsg) statusMsg.innerHTML = '<span class="sync-status-msg loading"><i class="fas fa-spinner fa-spin"></i> Fetching repositories from GitHub...</span>';

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        if (!res.ok) throw new Error(`GitHub API returned status ${res.status}`);
        
        const repos = await res.json();
        const nonForks = repos.filter(r => !r.fork);

        if (nonForks.length === 0) {
            if (statusMsg) statusMsg.innerHTML = '<span class="sync-status-msg error">No public repositories found for this account.</span>';
            return;
        }

        let addedCount = 0;
        nonForks.forEach(repo => {
            const formattedTitle = repo.name
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());

            const descLower = (repo.description || '').toLowerCase();
            let category = 'web-apps';
            if (descLower.includes('ai') || descLower.includes('ml') || descLower.includes('skin') || descLower.includes('model') || descLower.includes('neural')) {
                category = 'ai-ml';
            } else if (descLower.includes('data') || descLower.includes('dashboard') || descLower.includes('analytics') || descLower.includes('bi')) {
                category = 'data-analytics';
            }

            const primaryLang = repo.language || 'GitHub';
            const tags = [primaryLang, 'GitHub API'];
            if (repo.stargazers_count > 0) tags.push(`⭐ ${repo.stargazers_count}`);

            const existingIndex = projectsState.findIndex(p => p.id === repo.name || p.link === repo.html_url);
            const projectObj = {
                id: repo.name,
                title: formattedTitle,
                category: category,
                brief: repo.description || `Open-source ${primaryLang} repository built by ${username}.`,
                tags: tags,
                link: repo.html_url,
                hidden: false
            };

            if (existingIndex >= 0) {
                projectsState[existingIndex] = { ...projectsState[existingIndex], ...projectObj };
            } else {
                projectsState.unshift(projectObj);
                addedCount++;
            }
        });

        saveAdminState();
        renderPortfolioProjects();
        renderAdminLists();

        if (statusMsg) {
            statusMsg.innerHTML = `<span class="sync-status-msg success"><i class="fas fa-check-circle"></i> Successfully synced ${nonForks.length} repositories (${addedCount} new added)!</span>`;
        }
    } catch (err) {
        if (statusMsg) {
            statusMsg.innerHTML = `<span class="sync-status-msg error"><i class="fas fa-exclamation-triangle"></i> Sync Failed: ${err.message}</span>`;
        }
    }
}

// Initialize Admin Control Panel Modal & Forms
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render from State
    renderPortfolioProjects();
    renderPortfolioSkills();
    renderPortfolioExperience();

    const secretAdminBtn = document.getElementById('secretAdminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const syncGithubBtn = document.getElementById('syncGithubBtn');
    const resetAdminDataBtn = document.getElementById('resetAdminDataBtn');

    // Secret Admin Open Trigger
    if (secretAdminBtn && adminModal) {
        secretAdminBtn.addEventListener('click', () => {
            adminModal.style.display = 'flex';
            renderAdminLists();
        });
    }

    if (closeAdminModal && adminModal) {
        closeAdminModal.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }

    // Admin Tab Navigation
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(targetTab)?.classList.add('active');
        });
    });

    // GitHub Sync Click Handler
    if (syncGithubBtn) {
        syncGithubBtn.addEventListener('click', (e) => {
            e.preventDefault();
            syncGithubRepos();
        });
    }

    // Reset Defaults Handler
    if (resetAdminDataBtn) {
        resetAdminDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all portfolio content to original defaults?')) {
                localStorage.removeItem('portfolio_projects_data');
                localStorage.removeItem('portfolio_skills_data');
                localStorage.removeItem('portfolio_experience_data');
                projectsState = DEFAULT_PROJECTS;
                skillsState = DEFAULT_SKILLS;
                experienceState = DEFAULT_EXPERIENCE;
                saveAdminState();
                renderPortfolioProjects();
                renderPortfolioSkills();
                renderPortfolioExperience();
                renderAdminLists();
                alert('Portfolio content reset to default state.');
            }
        });
    }

    // Add Custom Project Form Handler
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('projTitle').value.trim();
            const category = document.getElementById('projCategory').value;
            const brief = document.getElementById('projBrief').value.trim();
            const tagsInput = document.getElementById('projTags').value.trim();
            const link = document.getElementById('projLink').value.trim();

            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['Custom Project'];
            const newProject = {
                id: 'custom-' + Date.now(),
                title,
                category,
                brief,
                tags,
                link: link || 'https://github.com/Devansh2305-code',
                hidden: false
            };

            projectsState.unshift(newProject);
            saveAdminState();
            renderPortfolioProjects();
            renderAdminLists();
            addProjectForm.reset();
        });
    }

    // Add Custom Skill Form Handler
    const addSkillForm = document.getElementById('addSkillForm');
    if (addSkillForm) {
        addSkillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('skillName').value.trim();
            const icon = document.getElementById('skillIcon').value.trim() || 'fas fa-code';
            const level = parseInt(document.getElementById('skillLevel').value) || 85;

            const newSkill = {
                id: 'sk-' + Date.now(),
                name,
                category: 'Custom Skill',
                icon,
                level
            };

            skillsState.push(newSkill);
            saveAdminState();
            renderPortfolioSkills();
            renderAdminLists();
            addSkillForm.reset();
        });
    }

    // Add Custom Experience Form Handler
    const addExperienceForm = document.getElementById('addExperienceForm');
    if (addExperienceForm) {
        addExperienceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('expTitle').value.trim();
            const org = document.getElementById('expOrg').value.trim();
            const date = document.getElementById('expDate').value.trim();
            const desc = document.getElementById('expDesc').value.trim();

            const newExp = {
                id: 'exp-' + Date.now(),
                title,
                org,
                date,
                desc
            };

            experienceState.unshift(newExp);
            saveAdminState();
            renderPortfolioExperience();
            renderAdminLists();
            addExperienceForm.reset();
        });
    }
});