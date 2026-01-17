/**
 * BATURA LIBRARY | MASTER LOGIC V6.0
 * Systems: SmoothScroll (Lenis), NavigationController (Morph), BaturaSlider
 */
import './components/navbar.js';
import './components/footer.js';
import './components/expression-filter.js';
import './components/expression-manager.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm';

class SmoothScroll {
    constructor() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        const scrollFn = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(scrollFn);
        };
        requestAnimationFrame(scrollFn);
    }
}

class NavigationController {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.searchInput = document.getElementById('searchInput');
        this.pageType = document.body.dataset.page || 'home';
        this.threshold = 60; 
        
        if (this.nav) this.init();
    }

    init() {
        this.applyPageState();
        // Слушаем скролл с пассивным режимом для производительности
        window.addEventListener('scroll', () => this.handleMorphology(), { passive: true });
        this.handleMorphology();
    }

    handleMorphology() {
        requestAnimationFrame(() => {
            const isScrolled = window.scrollY > this.threshold;
            const hasClass = document.body.classList.contains('is-scrolled');

            if (isScrolled && !hasClass) {
                document.body.classList.add('is-scrolled');
            } else if (!isScrolled && hasClass) {
                document.body.classList.remove('is-scrolled');
            }
        });
    }

    applyPageState() {
        const searchPages = ['expressions', 'scripting', 'plugins'];
        if (searchPages.includes(this.pageType)) {
            document.body.classList.add('has-search');
            if (this.searchInput) {
                this.searchInput.placeholder = `Search ${this.pageType}...`;
            }
        }
    }
}

class BaturaSlider {
    constructor() {
        this.container = document.getElementById('mainAccordion');
        if (!this.container) return;

        this.cards = Array.from(this.container.querySelectorAll('.b-card'));
        this.currentIndex = 0;
        this.autoplayDelay = 5000;
        this.intentDelay = 70;

        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.stopAutoplay();
                this.hoverTimeout = setTimeout(() => this.setActiveCard(index), this.intentDelay);
            });
            card.addEventListener('mouseleave', () => clearTimeout(this.hoverTimeout));
            card.addEventListener('click', () => { this.stopAutoplay(); this.setActiveCard(index); });
        });

        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        this.setActiveCard(0);
        this.startAutoplay();
    }

    setActiveCard(index) {
        if (this.currentIndex === index && this.cards[index].classList.contains('is-active')) return;
        const currentActive = this.container.querySelector('.b-card.is-active');
        if (currentActive) currentActive.classList.remove('is-active');

        void this.cards[index].offsetWidth; 

        requestAnimationFrame(() => {
            this.currentIndex = index;
            this.cards[index].classList.add('is-active');
            if (window.updateBgTheme) window.updateBgTheme(index);
        });
    }

    startAutoplay() {
        if (this.timer || document.hidden) return;
        this.timer = setInterval(() => {
            const next = (this.currentIndex + 1) % this.cards.length;
            this.setActiveCard(next);
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        clearInterval(this.timer);
        this.timer = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('is-loading');
    new SmoothScroll();
    new NavigationController();
    new BaturaSlider();
    console.log('Batura System: V6.0 Stable Build Active');
});