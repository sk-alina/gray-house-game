// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation smooth scrolling
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        }
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.character-card, .gameplay-feature, .media-item, .feature');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Character card hover effects
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    // Button click effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Handle button actions
            if (this.textContent.includes('Play Now')) {
                startGrayHouseGame();
            } else if (this.textContent.includes('Enhanced Explorer')) {
                startEnhancedGrayHouseGame();
            } else if (this.textContent.includes('Watch Trailer')) {
                showComingSoonModal('Trailer');
            }
        });
    });

    // Screenshot hover effects
    const screenshots = document.querySelectorAll('.screenshot');
    
    screenshots.forEach(screenshot => {
        screenshot.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.2)';
        });
        
        screenshot.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    });

    // House silhouette animation
    const houseSilhouette = document.querySelector('.house-silhouette');
    
    if (houseSilhouette) {
        // Add subtle floating animation
        houseSilhouette.style.animation = 'float 6s ease-in-out infinite';
        
        // Add CSS keyframes for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            .btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Modal functionality
    function showComingSoonModal(content) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('.coming-soon-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'coming-soon-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h2>Coming Soon</h2>
                    <p>The ${content} will be available when the game launches!</p>
                    <p>Stay tuned for updates.</p>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add modal styles
            const modalStyle = document.createElement('style');
            modalStyle.textContent = `
                .coming-soon-modal {
                    display: none;
                    position: fixed;
                    z-index: 2000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                }
                
                .modal-content {
                    background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
                    margin: 15% auto;
                    padding: 2rem;
                    border: 2px solid #c9a96e;
                    border-radius: 10px;
                    width: 80%;
                    max-width: 500px;
                    text-align: center;
                    position: relative;
                    animation: modalSlideIn 0.3s ease;
                }
                
                @keyframes modalSlideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .modal-close {
                    color: #c9a96e;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    position: absolute;
                    top: 10px;
                    right: 20px;
                    cursor: pointer;
                }
                
                .modal-close:hover {
                    color: #d4b876;
                }
                
                .modal-content h2 {
                    color: #c9a96e;
                    font-family: 'Oswald', sans-serif;
                    margin-bottom: 1rem;
                }
                
                .modal-content p {
                    color: #e0e0e0;
                    margin-bottom: 1rem;
                }
            `;
            document.head.appendChild(modalStyle);
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        modal.style.display = 'block';
    }

    // Add loading animation for character avatars
    const avatars = document.querySelectorAll('.character-avatar');
    avatars.forEach((avatar, index) => {
        avatar.style.animationDelay = `${index * 0.2}s`;
        avatar.style.animation = 'avatarPulse 2s ease-in-out infinite';
    });

    // Add avatar pulse animation
    const avatarStyle = document.createElement('style');
    avatarStyle.textContent = `
        @keyframes avatarPulse {
            0%, 100% { 
                box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.4);
            }
            50% { 
                box-shadow: 0 0 0 10px rgba(201, 169, 110, 0);
            }
        }
    `;
    document.head.appendChild(avatarStyle);

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg activated
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 3000);
            
            showComingSoonModal('Secret Content Unlocked! 🎮');
            konamiCode = [];
        }
    });

    console.log('🏠 Welcome to The Gray House! 🏠');
    console.log('Try the Konami code for a surprise...');
});