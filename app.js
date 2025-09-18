// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize music functionality first
    initBackgroundMusic();
    
    // Initialize other functions after a short delay
    setTimeout(() => {
        initTypewriter();
        initFloatingHearts();
        initScrollAnimations();
        initReasonButtons();
        initSecretMessages();
        initForgivenessButtons();
        initParticleEffects();
        initMemeAnimations();
        
        // Create initial particles
        setTimeout(() => createParticles('default'), 1000);
    }, 100);
});

// Background Music Functions
function initBackgroundMusic() {
    const audio = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.querySelector('.music-icon');
    const musicText = document.querySelector('.music-text');
    const clickToStart = document.getElementById('click-to-start');
    
    let isPlaying = false;
    let hasUserInteracted = false;
    
    // Set initial volume
    audio.volume = 0.3;
    
    // Function to start music
    function startMusic() {
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            clickToStart.classList.add('hidden');
            
            audio.play().then(() => {
                isPlaying = true;
                updateMusicButton();
            }).catch(error => {
                console.log('Audio autoplay was prevented:', error);
                // Show music control even if autoplay fails
                updateMusicButton();
            });
        }
    }
    
    // Function to toggle music
    function toggleMusic() {
        if (!hasUserInteracted) {
            startMusic();
            return;
        }
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play().then(() => {
                isPlaying = true;
            }).catch(error => {
                console.log('Audio play was prevented:', error);
            });
        }
        updateMusicButton();
    }
    
    // Function to update button appearance
    function updateMusicButton() {
        if (isPlaying) {
            musicIcon.textContent = '🎵';
            musicText.textContent = 'Music ON';
            musicToggle.classList.remove('muted');
        } else {
            musicIcon.textContent = '🔇';
            musicText.textContent = 'Music OFF';
            musicToggle.classList.add('muted');
        }
    }
    
    // Event listeners
    musicToggle.addEventListener('click', toggleMusic);
    clickToStart.addEventListener('click', startMusic);
    
    // Auto-start on any user interaction
    document.addEventListener('click', function(e) {
        if (!hasUserInteracted && e.target.id !== 'music-toggle') {
            startMusic();
        }
    }, { once: true });
    
    // Handle audio events
    audio.addEventListener('ended', () => {
        // Loop is handled by HTML attribute, but this is a backup
        if (isPlaying) {
            audio.currentTime = 0;
            audio.play();
        }
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        updateMusicButton();
    });
    
    audio.addEventListener('play', () => {
        isPlaying = true;
        updateMusicButton();
    });
    
    audio.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        // Hide click to start if audio fails to load
        clickToStart.classList.add('hidden');
    });
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.getAttribute('data-text');
        if (text) {
            element.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Remove cursor after typing is done
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        }
    });
}

// Floating Hearts Background
function initFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    if (!heartsContainer) return;
    
    const heartEmojis = ['💕', '💖', '💗', '💝', '🥰', '😍', '🌸', '🌺', '🦋', '✨'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 8000);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 2000);
    
    // Create initial hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(createHeart, i * 500);
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.style.animationFillMode = 'both';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Reason Buttons
function initReasonButtons() {
    const reasonButtons = document.querySelectorAll('.reason-btn');
    const revealedReason = document.getElementById('revealed-reason');
    
    reasonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reason = this.getAttribute('data-reason');
            
            // Create particles on click
            createParticles('click', this);
            
            // Show revealed reason
            revealedReason.innerHTML = `
                <h3>😔 I'm apologizing...</h3>
                <p><strong>${reason}</strong></p>
                <p>I know I messed up, and I'm truly sorry! 💕</p>
            `;
            revealedReason.classList.add('show');
            
            // Scroll to revealed reason
            setTimeout(() => {
                revealedReason.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        });
    });
}

// Secret Messages
function initSecretMessages() {
    const secretCards = document.querySelectorAll('.secret-card');
    
    secretCards.forEach(card => {
        card.addEventListener('click', function() {
            const secret = this.getAttribute('data-secret');
            const front = this.querySelector('.secret-front');
            
            // Create particles
            createParticles('secret', this);
            
            // Reveal secret
            front.innerHTML = `<div class="secret-revealed">${secret}</div>`;
            
            // Add special styling
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.color = 'white';
            this.style.transform = 'scale(1.05)';
            
            // Prevent further clicks
            this.style.pointerEvents = 'none';
        });
    });
}

// Forgiveness Buttons & Particle Effects
function initForgivenessButtons() {
    const finalMessage = document.getElementById('final-message');
    
    window.createParticles = function(type, element) {
        const container = document.querySelector('.particle-container');
        if (!container) return;
        
        const emojis = {
            'yes': ['💖', '🎉', '✨', '🌟', '💕', '🥰', '🎊', '🌈'],
            'maybe': ['🤔', '💭', '⏰', '🤷‍♀️', '💛', '🤞', '😊'],
            'click': ['✨', '⭐', '💫', '🌟', '💕'],
            'secret': ['💝', '💕', '💖', '✨', '🌸', '🌺'],
            'default': ['💕', '✨', '🌟', '💖', '🌸']
        };
        
        const particleEmojis = emojis[type] || emojis['default'];
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 0,
            height: 0
        };
        
        // Create multiple particles
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
                
                const startX = rect.left + (rect.width || 0) / 2;
                const startY = rect.top + (rect.height || 0) / 2;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                particle.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px)`;
                
                container.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
        
        // Show final message based on type
        if (type === 'yes') {
            finalMessage.innerHTML = `
                <h2>🎉 Thank you for forgiving me! 🎉</h2>
                <p>You're the best person ever! I love you so much! 💕✨</p>
                <p>I promise to make it up to you! 🌟</p>
            `;
            finalMessage.classList.add('show');
        } else if (type === 'maybe') {
            finalMessage.innerHTML = `
                <h2>🤞 I'll keep trying to earn your forgiveness 🤞</h2>
                <p>I understand you need time, and I respect that 💙</p>
                <p>I'll be here when you're ready 🌈</p>
            `;
            finalMessage.classList.add('show');
        }
    };
}

// Particle Effects
function initParticleEffects() {
    // This function is now handled by createParticles
    console.log('Particle effects initialized');
}

// Meme Animations
function initMemeAnimations() {
    const memePlaceholders = document.querySelectorAll('.meme-placeholder');
    
    memePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        placeholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Add click animation
        placeholder.addEventListener('click', function() {
            createParticles('click', this);
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
        });
    });
}

// Smooth scrolling for internal links
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

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('secret-card')) {
            e.target.click();
        }
    }
});

// Performance optimization - Intersection Observer for animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.2 });

// Observe all animatable elements
document.querySelectorAll('.promise-card, .secret-card, .meme-card').forEach(el => {
    animationObserver.observe(el);
});

// Add some fun easter eggs
let clickCount = 0;
document.addEventListener('click', function() {
    clickCount++;
    if (clickCount === 50) {
        createParticles('yes');
        const message = document.createElement('div');
        message.innerHTML = '🎉 Wow, you really clicked a lot! You must really care! 💕';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 15px;
            font-size: 1.2rem;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
});

console.log('🎵 Apology page loaded with love! 💕');
