// ========================================
// FAYZ RESTAURANT WEBSITE - MAIN JAVASCRIPT
// ========================================

// Global variables
let cart = {
    items: [],
    total: 0
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍽️ Fayz Restaurant Website Loaded Successfully');
    
    // Initialize all components
    initLoadingScreen();
    initHeroSlider();
    initMenuTabs();
    initOrderSystem();
    initReservationForm();
    initContactForm();
    initNewsletterForm();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initGalleryLightbox();
    initAOS();
    initCounterAnimation();
});

// ========================================
// LOADING SCREEN
// ========================================

function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// ========================================
// HERO SLIDER
// ========================================

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
            slide.style.transform = i === index ? 'scale(1)' : 'scale(1.1)';
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Show first slide
    showSlide(0);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// ========================================
// MENU TABS
// ========================================

function initMenuTabs() {
    const tabButtons = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    if (tabButtons.length === 0 || menuCategories.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected category
            menuCategories.forEach(cat => {
                cat.classList.remove('active');
            });
            
            const selectedCategory = document.querySelector(`.menu-category[data-category="${category}"]`);
            if (selectedCategory) {
                selectedCategory.classList.add('active');
            }
        });
    });
    
    // Activate first tab by default
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// ========================================
// ORDER SYSTEM
// ========================================

function initOrderSystem() {
    // Load cart from localStorage
    loadCart();
    
    // Add to cart buttons
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = {
                name: button.dataset.item,
                price: parseInt(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };
            addToCart(item);
        });
    });
    
    // Order button functionality
    const orderButton = document.querySelector('.btn-order');
    if (orderButton) {
        orderButton.addEventListener('click', () => {
            if (cart.items.length > 0) {
                processOrder();
            }
        });
    }
    
    // Cart toggle
    const cartIcon = document.querySelector('.cart-icon');
    const orderSection = document.querySelector('.order-section');
    
    if (cartIcon && orderSection) {
        cartIcon.addEventListener('click', () => {
            orderSection.classList.toggle('active');
        });
    }
}

function addToCart(item) {
    const existingItem = cart.items.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push(item);
    }
    
    updateCart();
    showNotification(`${item.name} savatga qo'shildi`, 'success');
}

function removeFromCart(itemName) {
    cart.items = cart.items.filter(item => item.name !== itemName);
    updateCart();
    showNotification('Mahsulot savatdan olib tashlandi', 'info');
}

function updateQuantity(itemName, newQuantity) {
    const item = cart.items.find(item => item.name === itemName);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemName);
        } else {
            item.quantity = newQuantity;
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    // Update cart display
    const orderItems = document.querySelector('.order-items');
    if (orderItems) {
        if (cart.items.length === 0) {
            orderItems.innerHTML = `
                <div class="order-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Sizning savat bo'sh</p>
                    <span>Menyudan taom tanlang</span>
                </div>
            `;
        } else {
            orderItems.innerHTML = cart.items.map(item => `
                <div class="order-item" data-item="${item.name}">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="order-item-content">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()} so'm</p>
                    </div>
                    <div class="order-item-actions">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = document.querySelector('.total-amount');
    if (totalAmount) {
        totalAmount.textContent = `${cart.total.toLocaleString()} so'm`;
    }
    
    // Update order button
    const orderButton = document.querySelector('.btn-order');
    if (orderButton) {
        orderButton.disabled = cart.items.length === 0;
    }
    
    // Save to localStorage
    saveCart();
}

function loadCart() {
    const savedCart = localStorage.getItem('fayzCart');
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            cart.items = parsedCart.items || [];
            cart.total = parsedCart.total || 0;
            updateCart();
        } catch (error) {
            console.error('Error loading cart:', error);
            localStorage.removeItem('fayzCart');
        }
    }
}

function saveCart() {
    localStorage.setItem('fayzCart', JSON.stringify(cart));
}

function processOrder() {
    // Simulate order processing
    showNotification('Buyurtma qayta ishlanmoqda...', 'info');
    
    setTimeout(() => {
        showNotification('Buyurtma muvaffaqiyatli yuborildi!', 'success');
        
        // Clear cart
        cart.items = [];
        updateCart();
        
        // Close cart
        const orderSection = document.querySelector('.order-section');
        if (orderSection) {
            orderSection.classList.remove('active');
        }
    }, 2000);
}

// ========================================
// RESERVATION FORM
// ========================================

function initReservationForm() {
    const reservationForm = document.getElementById('reservation-form');
    if (!reservationForm) return;
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(reservationForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const date = formData.get('date');
        const time = formData.get('time');
        const guests = formData.get('guests');
        const table = formData.get('table');
        
        // Validation
        if (!name || !phone || !date || !time || !guests || !table) {
            showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'error');
            return;
        }
        
        // Phone validation (Uzbek format)
        const phoneRegex = /^\+998[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Telefon raqami noto\'g\'ri formatda (+998XXXXXXXXX)', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Bron qayta ishlanmoqda...', 'info');
        
        setTimeout(() => {
            showNotification('Bron muvaffaqiyatli qilindi!', 'success');
            reservationForm.reset();
        }, 1500);
    });
}

// ========================================
// CONTACT FORM
// ========================================

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validation
        if (!name || !email || !message) {
            showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Email manzili noto\'g\'ri formatda', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Xabar yuborilmoqda...', 'info');
        
        setTimeout(() => {
            showNotification('Xabar muvaffaqiyatli yuborildi!', 'success');
            contactForm.reset();
        }, 1500);
    });
}

// ========================================
// NEWSLETTER FORM
// ========================================

function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (!email) {
            showNotification('Iltimos, email manzilingizni kiriting', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Email manzili noto\'g\'ri formatda', 'error');
            return;
        }
        
        showNotification('Axborot byulleteniga muvaffaqiyatli obuna bo\'ldingiz!', 'success');
        newsletterForm.reset();
    });
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// GALLERY LIGHTBOX
// ========================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="${alt}">
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        width: 100%;
        height: auto;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.backgroundColor = 'transparent';
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(lightbox)) {
                document.body.removeChild(lightbox);
            }
        }, 300);
    }
    
    document.body.appendChild(lightbox);
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// ========================================
// AOS INITIALIZATION
// ========================================

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0
        });
    }
}

// ========================================
// COUNTER ANIMATION
// ========================================

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 16);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 350px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add content styles
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = notification.querySelector('.notification-icon');
    icon.style.cssText = `
        font-size: 1.2rem;
    `;
    
    const messageEl = notification.querySelector('.notification-message');
    messageEl.style.cssText = `
        flex: 1;
        line-height: 1.4;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.7';
    });
    
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 4000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
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

// ========================================
// GLOBAL EXPORTS
// ========================================

// Make functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.showNotification = showNotification;
window.openLightbox = openLightbox;

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Optimize resize events
const optimizedResizeHandler = debounce(() => {
    // Handle resize-based calculations
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

console.log('🚀 All JavaScript components initialized successfully!');




