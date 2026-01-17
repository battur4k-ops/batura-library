/**
 * BATURA LIBRARY | WEB COMPONENTS
 * Unified Navbar v7.8 [Hysteresis Optimized]
 */

class BaturaNavbar extends HTMLElement {
    constructor() {
        super();
        this._handleScroll = this._handleScroll.bind(this);
        this._ticking = false;
        this._isScrolled = false;
    }

    connectedCallback() {
        this.render();
        window.addEventListener('scroll', this._handleScroll, { passive: true });
        this._handleScroll(); 
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this._handleScroll);
    }

    _handleScroll() {
        if (!this._ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                
                // Добавляем гистерезис: вниз на 20px, вверх только на 5px.
                // Это предотвращает "дребезг" анимации.
                const threshold = this._isScrolled ? 5 : 20;
                const shouldScroll = currentScroll > threshold;

                if (this._isScrolled !== shouldScroll) {
                    this._isScrolled = shouldScroll;
                    document.body.classList.toggle('is-scrolled', shouldScroll);
                }
                
                this._ticking = false;
            });
            this._ticking = true;
        }
    }

    render() {
        this.innerHTML = `
            <nav class="b-navbar" id="mainNav">
                <a href="/" class="b-navbar__brand" aria-label="Batura Home">
                    <button class="ui-button ui-button--logo">
                        <div class="b-logo">
                            <svg viewBox="0 0 796 1027" xmlns="http://www.w3.org/2000/svg">
                                <path d="M327.5 0H795.5L749 1027H409L425.5 893.5H384.5L357 1027H0L327.5 0Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </button>
                </a>
            </nav>
        `;
    }
}

if (!customElements.get('batura-navbar')) {
    customElements.define('batura-navbar', BaturaNavbar);
}