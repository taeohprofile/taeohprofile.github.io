// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initializeNavigation();
    initializeAudio();
    initializeScrollEffects();
    initializeAnimations();
    
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navigation background on scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.backdropFilter = 'blur(15px)';
        }
    });
}

// Audio functionality
function initializeAudio() {
    const audioToggle = document.getElementById('audioToggle');
    const bgMusic = document.getElementById('bgMusic');
    const audioIcon = document.querySelector('.audio-icon');
    let isPlaying = false;
    
    if (audioToggle && bgMusic && audioIcon) {
        // Set initial volume
        bgMusic.volume = 0.3;
        
        audioToggle.addEventListener('click', function() {
            if (isPlaying) {
                bgMusic.pause();
                audioIcon.textContent = '♪';
                audioToggle.classList.remove('playing');
                isPlaying = false;
            } else {
                // Handle autoplay restrictions
                const playPromise = bgMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audioIcon.textContent = '⏸';
                        audioToggle.classList.add('playing');
                        isPlaying = true;
                    }).catch(error => {
                        console.log('Auto-play was prevented:', error);
                        // Show user-friendly message
                        showAudioMessage();
                    });
                }
            }
        });
        
        // Audio events
        bgMusic.addEventListener('ended', function() {
            audioIcon.textContent = '♪';
            audioToggle.classList.remove('playing');
            isPlaying = false;
        });
        
        bgMusic.addEventListener('error', function() {
            console.log('Audio loading error');
            audioToggle.style.display = 'none';
        });
        
        // Volume control on scroll (subtle effect)
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking && isPlaying) {
                requestAnimationFrame(function() {
                    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                    const volume = Math.max(0.1, 0.3 - (scrollPercent * 0.1));
                    bgMusic.volume = volume;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Show audio message for autoplay restrictions
function showAudioMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 26, 26, 0.95);
        color: var(--dirty-white);
        padding: 20px;
        border-radius: 8px;
        border: 2px solid var(--accent-red);
        z-index: 10000;
        text-align: center;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    message.innerHTML = `
        <p style="margin-bottom: 15px;">브라우저에서 자동 재생이 차단되었습니다.</p>
        <button onclick="this.parentElement.remove()" style="
            background: var(--accent-red);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        ">확인</button>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 3000);
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Parallax effect for hero background
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.speech-card, .atmosphere-item, .place-item, .profile-section'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Additional animations and effects
function initializeAnimations() {
    // Typing effect for hero title
    const titleMain = document.querySelector('.title-main');
    if (titleMain) {
        const text = titleMain.textContent;
        titleMain.textContent = '';
        titleMain.style.borderRight = '2px solid var(--accent-red)';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                titleMain.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    titleMain.style.borderRight = 'none';
                }, 500);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Glitch effect for speech dialogue on hover
    const speechDialogues = document.querySelectorAll('.speech-dialogue');
    speechDialogues.forEach(dialogue => {
        dialogue.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
        
        dialogue.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // Add glitch keyframes
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes textGlow {
            0% { text-shadow: 0 0 5px var(--accent-red); }
            50% { text-shadow: 0 0 20px var(--accent-red), 0 0 30px var(--accent-red); }
            100% { text-shadow: 0 0 5px var(--accent-red); }
        }
    `;
    document.head.appendChild(glitchStyle);
    
    // Blood drip effect (subtle)
    createBloodDropEffect();
    
    // Image hover effects
    initializeImageEffects();
    
    // Loading screen fade out
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// Blood drop effect
function createBloodDropEffect() {
    const bloodContainer = document.createElement('div');
    bloodContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(bloodContainer);
    
    function createBloodDrop() {
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: absolute;
            width: 2px;
            height: 10px;
            background: linear-gradient(180deg, transparent, var(--accent-red));
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: bloodFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        bloodContainer.appendChild(drop);
        
        setTimeout(() => {
            drop.remove();
        }, 5000);
    }
    
    // Add blood fall animation
    const bloodStyle = document.createElement('style');
    bloodStyle.textContent = `
        @keyframes bloodFall {
            to {
                top: 100vh;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(bloodStyle);
    
    // Create drops periodically
    setInterval(createBloodDrop, Math.random() * 10000 + 5000);
}

// Image effects
function initializeImageEffects() {
    // Profile image click effect
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    }
    
    // Scene image parallax (limited to prevent overflow)
    const sceneImage = document.querySelector('.scene-image img');
    if (sceneImage) {
        window.addEventListener('scroll', function() {
            const rect = sceneImage.getBoundingClientRect();
            const sceneSection = document.querySelector('.first-scene');
            const sectionRect = sceneSection.getBoundingClientRect();
            
            // Only apply parallax when the scene section is in view
            if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
                const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - sectionRect.top) / (window.innerHeight + sectionRect.height)));
                const maxOffset = 50; // Limit maximum offset
                const offset = (scrollProgress - 0.5) * maxOffset;
                
                sceneImage.style.transform = `translateY(${offset}px)`;
            } else {
                // Reset transform when section is out of view
                sceneImage.style.transform = 'translateY(0px)';
            }
        });
    }
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.log('JavaScript error:', e.error);
});

// Performance optimization
window.addEventListener('beforeunload', function() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav-links');
        if (navToggle && navLinks) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
    
    // Space to toggle audio
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.click();
        }
    }
});

// Touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Improve touch scrolling
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
}

// Dark mode detection (respect system preferences)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    // User prefers light mode, but our theme is inherently dark
    // We maintain the dark aesthetic as it's core to the character
    console.log('Light mode detected, but maintaining dark theme for character authenticity');
}

// Console easter egg
console.log(`
%c윤태오의 세계에 오신 것을 환영합니다.
%c"이런 나라도 너의 영웅이 되고 싶어..."

%c개발자 도구를 열어보셨군요. 
이 어둠 속에서도 빛을 찾고 계신가요?

%c- 음악 토글: 스페이스바
- 메뉴 닫기: ESC
- 스크롤로 음량 조절됨
`, 
'color: #8b2635; font-size: 16px; font-weight: bold;',
'color: #8a7968; font-style: italic;',
'color: #e8e6e1; font-size: 12px;',
'color: #4a4a4a; font-size: 10px;'
); 