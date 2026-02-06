// Project data
const projectData = {
    shoplink: {
        title: 'ShopLink',
        description: `
            <h3>About ShopLink</h3>
            <p><strong>ShopLink</strong> is a modern e-commerce platform designed to connect buyers and sellers seamlessly.</p>
            
            <h4>Key Features:</h4>
            <ul>
                <li>🛍️ <strong>Real-time Inventory Management:</strong> Track product availability instantly</li>
                <li>🔐 <strong>Secure Authentication:</strong> Firebase-based user authentication system</li>
                <li>📊 <strong>Admin Dashboard:</strong> Comprehensive analytics and sales tracking</li>
                <li>💳 <strong>Payment Integration:</strong> Secure payment gateway integration</li>
                <li>📱 <strong>Responsive Design:</strong> Optimized for all devices</li>
                <li>🔍 <strong>Advanced Search:</strong> Smart product filtering and search functionality</li>
            </ul>
            
            <h4>Technologies Used:</h4>
            <p>React.js, Firebase, Supabase, Node.js, Stripe API</p>
            
            <h4>Impact:</h4>
            <p>Successfully handles 1000+ products with real-time updates and provides seamless shopping experience for users.</p>
        `
    },
    resume: {
        title: 'AI Resume Checker',
        description: `
            <h3>About AI Resume Checker</h3>
            <p><strong>AI Resume Checker</strong> is an intelligent tool that analyzes resumes and provides actionable feedback to improve job application success rates.</p>
            
            <h4>Key Features:</h4>
            <ul>
                <li>🤖 <strong>AI-Powered Analysis:</strong> Uses machine learning to evaluate resume quality</li>
                <li>📈 <strong>Score Generation:</strong> Provides detailed scoring across multiple criteria</li>
                <li>💡 <strong>Smart Suggestions:</strong> Offers personalized recommendations for improvement</li>
                <li>🎯 <strong>Keyword Optimization:</strong> Identifies missing industry-relevant keywords</li>
                <li>📄 <strong>Format Checking:</strong> Ensures ATS-friendly formatting</li>
                <li>🔍 <strong>Section Analysis:</strong> Evaluates each resume section independently</li>
            </ul>
            
            <h4>Technologies Used:</h4>
            <p>Python, Natural Language Processing (NLP), TensorFlow, Flask, React</p>
            
            <h4>Impact:</h4>
            <p>Helped 500+ users improve their resumes with an average score improvement of 40%.</p>
        `
    },
    voice: {
        title: 'AI Voice Assistant',
        description: `
            <h3>About AI Voice Assistant</h3>
            <p><strong>AI Voice Assistant</strong> is an intelligent voice-activated personal assistant that helps users accomplish tasks through natural conversation.</p>
            
            <h4>Key Features:</h4>
            <ul>
                <li>🎤 <strong>Voice Recognition:</strong> Advanced speech-to-text capabilities</li>
                <li>🧠 <strong>Natural Language Understanding:</strong> Comprehends user intent and context</li>
                <li>🔊 <strong>Text-to-Speech:</strong> Natural-sounding voice responses</li>
                <li>⚡ <strong>Task Automation:</strong> Executes various commands and tasks</li>
                <li>🌐 <strong>Web Integration:</strong> Fetches information from the internet</li>
                <li>📅 <strong>Smart Reminders:</strong> Manages schedules and notifications</li>
                <li>🎵 <strong>Media Control:</strong> Plays music and controls media playback</li>
            </ul>
            
            <h4>Technologies Used:</h4>
            <p>Python, SpeechRecognition, pyttsx3, OpenAI API, Natural Language Processing</p>
            
            <h4>Impact:</h4>
            <p>Processes voice commands with 95% accuracy and supports 50+ different task types.</p>
        `
    }
};

// Modal functionality
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const viewMoreButtons = document.querySelectorAll('.view-more-btn');

viewMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
        const projectKey = this.getAttribute('data-project');
        const project = projectData[projectKey];
        
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').innerHTML = project.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Feedback form handling
const feedbackForm = document.getElementById('feedbackForm');

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const feedback = document.getElementById('feedback').value;
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Portfolio Feedback from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\n\nFeedback:\n${feedback}`);
    const mailtoLink = `mailto:djdevansh.2305@gmail.com?subject=${subject}&body=${body}`;
    
    // Open mail client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Thank you for your feedback! Your default email client will open to send the message.');
    
    // Reset form
    feedbackForm.reset();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards, project cards, and timeline items
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card, .timeline-item');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add particle effect to hero section
function createParticle() {
    const hero = document.querySelector('.hero-section');
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'rgba(255, 255, 255, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
    
    hero.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// Create particles periodically
setInterval(createParticle, 2000);

// Typing effect for hero subtitle
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// Skill card click effect
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Console message for developers
console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cLike what you see? Let\'s connect!', 'font-size: 14px; color: #8b5cf6;');
console.log('%cGitHub: https://github.com/Devansh2305-code', 'font-size: 12px; color: #64748b;');

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
