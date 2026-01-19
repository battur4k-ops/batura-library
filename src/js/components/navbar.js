/**
 * BATURA LIBRARY | WEB COMPONENTS
 * Unified Navbar v7.9 [Search Integrated & Context Aware]
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
        
        // Проверяем контекст: нужен ли поиск на этой странице?
        this._checkContext();
        this._setupSearch();
        this._handleScroll(); 
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this._handleScroll);
    }

    _checkContext() {
        // Если на странице есть элемент с ID 'expressionsGrid' (или любой другой грид), показываем поиск
        const hasCatalog = !!document.getElementById('expressionsGrid') || !!document.querySelector('.l-grid-expressions');
        const searchContainer = this.querySelector('.b-navbar__search');
        
        if (hasCatalog && searchContainer) {
            searchContainer.classList.remove('is-hidden');
        }
    }

    _setupSearch() {
        const input = this.querySelector('#globalSearch');
        if (!input) return;

        input.addEventListener('input', (e) => {
            // Транслируем событие поиска на весь сайт
            window.dispatchEvent(new CustomEvent('batura:search', {
                detail: { query: e.target.value }
            }));
        });
    }

    _handleScroll() {
        if (!this._ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                const threshold = this._isScrolled ? 15 : 60;
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
                    <div class="ui-button ui-button--logo">
                        <div class="b-logo">
                            <svg viewBox="0 0 796 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M327.5 0H795.5L749 1027H409L425.5 893.5H384.5L357 1027H0L327.5 0Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                </a>

                <!-- Модуль поиска (скрыт по умолчанию классом is-hidden) -->
                <div class="b-navbar__search is-hidden">
                    <input type="text" id="globalSearch" placeholder="Search_Library..." autocomplete="off">
                </div>
            </nav>
        `;
    }
}

if (!customElements.get('batura-navbar')) {
    customElements.define('batura-navbar', BaturaNavbar);
}