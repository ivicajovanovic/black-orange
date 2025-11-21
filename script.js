const backToTop = document.getElementById('backToTop');
const menuItems = document.querySelectorAll('.menu-item');
const sections = Array.from(document.querySelectorAll('section'));
const sidebar = document.querySelector('.sidebar');
const lockButton = document.querySelector('.sidebar-lock');
let sidebarLockedOpen = true;

function applySidebarLock() {
    if (!sidebar || !lockButton) return;
    lockButton.setAttribute('aria-pressed', sidebarLockedOpen ? 'true' : 'false');
    const icon = lockButton.querySelector('i');
    const text = lockButton.querySelector('.lock-text');

    if (sidebarLockedOpen) {
        sidebar.classList.add('expanded', 'locked');
        sidebar.classList.remove('locked-closed');
        document.body.classList.add('sidebar-expanded');
        document.body.classList.remove('sidebar-peek');
        icon.className = 'ri-lock-line';
        if (text) text.textContent = 'Locked open';
    } else {
        sidebar.classList.remove('expanded', 'locked');
        sidebar.classList.add('locked-closed');
        document.body.classList.remove('sidebar-expanded', 'sidebar-peek');
        icon.className = 'ri-lock-2-line';
        if (text) text.textContent = 'Locked closed';
    }
}

lockButton?.addEventListener('click', () => {
    sidebarLockedOpen = !sidebarLockedOpen;
    applySidebarLock();
});

applySidebarLock();

const toggleBackToTop = () => {
    if (window.scrollY > 320) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
};

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', toggleBackToTop);

menuItems.forEach((item) => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Ripple effect on CTA buttons
function addRipple(button) {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
}

document.querySelectorAll('.glass-btn').forEach(addRipple);

// Intersection observer for reveal animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

const revealables = document.querySelectorAll('.section-title, .glass-card, .project-card, .timeline-step, .testimonial-card, .contact-form, .contact-card');
revealables.forEach((el) => observer.observe(el));

// Scrollspy highlighting
function handleScrollSpy() {
    const offset = window.innerWidth > 820 ? 120 : 200;
    const scrollPos = window.scrollY + offset;
    let activeId = null;
    sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
            activeId = section.id;
        }
    });
    menuItems.forEach((item) => {
        item.classList.toggle('active', item.dataset.target === activeId);
    });
}
window.addEventListener('scroll', handleScrollSpy);
window.addEventListener('load', handleScrollSpy);

// Gallery filter
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const value = btn.dataset.filter;
        galleryCards.forEach((card) => {
            const show = value === 'all' || card.dataset.category === value;
            card.style.display = show ? 'block' : 'none';
        });
    });
});

// Testimonials carousel
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
let testimonialIndex = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
}

function nextTestimonial(step = 1) {
    testimonialIndex = (testimonialIndex + step + testimonialCards.length) % testimonialCards.length;
    showTestimonial(testimonialIndex);
}

const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
prevBtn?.addEventListener('click', () => nextTestimonial(-1));
nextBtn?.addEventListener('click', () => nextTestimonial(1));

// Auto-rotate testimonials
setInterval(() => nextTestimonial(1), 6000);

// Accordion
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        accordionItems.forEach((el) => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// Form feedback (front-end only)
const form = document.getElementById('contactForm');
const feedback = document.querySelector('.form-feedback');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !email) {
        feedback.textContent = 'Please add your name and a valid email so we can respond.';
        feedback.style.color = '#ff9c3f';
        return;
    }
    feedback.textContent = 'Thanks! We will reach out within one business day.';
    feedback.style.color = '#8be28b';
    form.reset();
});

// Animated counters
const stats = document.querySelectorAll('.stat');
let statsStarted = false;
function startCounters() {
    if (statsStarted) return;
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
        statsStarted = true;
        stats.forEach((stat) => {
            const target = Number(stat.dataset.counter) || 0;
            const numberEl = stat.querySelector('.stat-number');
            let current = 0;
            const increment = Math.max(1, Math.floor(target / 50));
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                numberEl.textContent = current;
            }, 28);
        });
    }
}
window.addEventListener('scroll', startCounters);
window.addEventListener('load', startCounters);
