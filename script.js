document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Theme Toggle (Dark/Light Mode)
       ========================================= */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('ri-moon-line');
        icon.classList.add('ri-sun-line');
    } else if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
        icon.classList.remove('ri-sun-line');
        icon.classList.add('ri-moon-line');
    } else {
        // Default to system preference if no local storage
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
        }
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('ri-sun-line');
            icon.classList.add('ri-moon-line');
            localStorage.setItem('theme', 'light');
        }
    });

    /* =========================================
       2. Mobile Navigation
       ========================================= */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    /* =========================================
       3. Typing Effect
       ========================================= */
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const words = ["AI Researcher", "Data Analyst", "InfoSec Researcher", "Problem Solver"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster when deleting
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    /* =========================================
       4. Scroll Animations (Fade In & Skill Bars)
       ========================================= */
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a skill bar, trigger the animation
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        bar.style.animationPlayState = 'running';
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));
    
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(el => observer.observe(el));

    /* =========================================
       5. AI Canvas Animation (Particle Network)
       ========================================= */
    const canvas = document.getElementById('ai-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Resize Canvas
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', resize);
        resize();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1; // Velocity X
                this.vy = (Math.random() - 0.5) * 1; // Velocity Y
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Color based on theme (check body class)
                const isDark = document.body.classList.contains('dark-mode');
                ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(107, 112, 92, 0.5)';
                
                ctx.fill();
            }
        }

        // Initialize Particles
        function initParticles() {
            particles = [];
            const particleCount = Math.floor(width / 10); // Responsive count
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        initParticles();

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            const isDark = document.body.classList.contains('dark-mode');
            const connectionColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(107, 112, 92, 0.1)';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = connectionColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        animate();
    }

    /* =========================================
       8. Hacker Text Scramble Effect
       ========================================= */
    const scrambleElements = document.querySelectorAll('.scramble-text');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    scrambleElements.forEach(element => {
        element.addEventListener('mouseenter', event => {
            let iteration = 0;
            const originalText = event.target.innerText;
            
            clearInterval(event.target.interval);
            
            event.target.interval = setInterval(() => {
                event.target.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                
                if(iteration >= originalText.length){ 
                    clearInterval(event.target.interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        });
    });

    /* =========================================
       9. 3D Tilt Effect for Project Cards
       ========================================= */
    const cards = document.querySelectorAll('.project-card, .honor-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ========================================
    // Projects Carousel
    // ========================================
    (function initProjectsCarousel() {
        const carousel = document.querySelector('.projects-carousel');
        const grid = document.querySelector('.projects-grid');
        const cards = carousel.querySelectorAll('.project-card');
        const prevBtn = document.querySelector('.carousel-btn-prev');
        const nextBtn = document.querySelector('.carousel-btn-next');
        
        if (!carousel || !grid || cards.length === 0 || !prevBtn || !nextBtn) {
            console.log('Carousel elements not found');
            return;
        }
        
        let currentIndex = 0;
        let cardsPerView = 3;
        
        // Calculate cards per view based on window width
        function updateCardsPerView() {
            const width = window.innerWidth;
            if (width <= 768) {
                cardsPerView = 1;
            } else if (width <= 1024) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
            
            // Hide buttons if not enough cards
            if (cards.length <= cardsPerView) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
            
            updateCarousel();
        }
        
        // Update carousel position
        function updateCarousel() {
            // Use a more reliable way to calculate card width and gap
            const computedStyle = getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth;
            const gapValue = getComputedStyle(grid).gap;
            let gap = 32; // default fallback
            
            if (gapValue.includes('rem')) {
                gap = parseFloat(gapValue) * parseFloat(getComputedStyle(document.documentElement).fontSize);
            } else if (gapValue.includes('px')) {
                gap = parseFloat(gapValue);
            }
            
            const offset = -(currentIndex * (cardWidth + gap));
            grid.style.transform = `translateX(${offset}px)`;
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
            
            console.log(`Current index: ${currentIndex}, Cards per view: ${cardsPerView}, Card width: ${cardWidth}, Gap: ${gap}`);
        }
        
        // Navigation handlers
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev button clicked');
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            // Only move if there are enough cards to fill the next view
            if (currentIndex < cards.length - cardsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            } else if (e.key === 'ArrowRight' && currentIndex < cards.length - cardsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Initialize
        updateCardsPerView();
        
        // Handle resize with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0;
                updateCardsPerView();
            }, 250);
        });
        
        console.log('Carousel initialized with', cards.length, 'cards');
    })();
});
