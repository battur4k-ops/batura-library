/**
 * BATURA LIBRARY | WEB COMPONENTS
 * Unified Footer v6.6 [Gravity Anchor]
 */

class BaturaFooter extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <footer class="b-footer l-container">
                <div class="b-footer__grid">
                    
                    <!-- BRAND COLUMN -->
                    <div class="b-footer__brand l-flow">
                        <span class="text-data">Batura Library</span>
                        <p class="text-body">
                            Архитектура стабильна. Кнопки статичны. <br>
                            Разрабатываем инструменты будущего для тех, кто создает движение сегодня.
                        </p>
                        
                        <!-- Логотип: Визуальный якорь -->
                        <div class="b-footer__logo">
                            <div class="b-logo">
                                <svg viewBox="0 0 796 1027" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M327.5 0H795.5L749 1027H409L425.5 893.5H384.5L357 1027H0L327.5 0Z" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- RESOURCES -->
                    <div class="b-footer__group">
                        <span class="text-data">Resources</span>
                        <div class="l-flow" style="--space-md: var(--space-xs)">
                            <a href="#" class="b-footer__link">Main Site</a>
                            <a href="https://t.me/batur4k0" target="_blank" class="b-footer__link">Telegram</a>
                            <a href="#" class="b-footer__link">Donation</a>
                        </div>
                    </div>

                    <!-- CONNECT -->
                    <div class="b-footer__group">
                        <span class="text-data">Connect</span>
                        <div class="l-flow" style="--space-md: var(--space-xs)">
                            <a href="mailto:hello@batura.me" class="b-footer__link">Email Me</a>
                            <a href="#" class="b-footer__link">Support</a>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM TERMINAL -->
                <div class="b-footer__bottom">
                    <span class="text-data">© 2026 BATURA SYSTEM</span>
                    <span class="text-data">V6.6 GRAVITY_CORE</span>
                </div>
            </footer>
        `;
    }
}

customElements.define('batura-footer', BaturaFooter);