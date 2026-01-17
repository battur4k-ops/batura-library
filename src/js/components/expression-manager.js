/**
 * BATURA LIBRARY | EXPRESSION MANAGER
 * Core System for handling data & overlays v1.1
 */

class ExpressionManager {
    constructor() {
        this.grid = document.getElementById('expressions-grid');
        this.overlay = document.getElementById('interface-overlay');
        
        this.data = [
            {
                id: 'elastic-bounce',
                title: 'Elastic Bounce',
                tag: 'physics',
                desc: 'Инерционный отскок с затуханием для любых свойств.'
            },
            {
                id: 'smart-loop',
                title: 'Smart Loop',
                tag: 'utility',
                desc: 'Бесконечный цикл с защитой от обрезки слоев.'
            }
        ];

        if (this.grid) this.init();
    }

    init() {
        this.renderCards();
        this.bindEvents();
    }

    renderCards() {
        this.grid.innerHTML = this.data.map(item => `
            <div class="b-card b-card--static">
                <div class="b-card__viewport">
                    <div class="b-card__content l-flow">
                        <span class="text-data">// ${item.tag.toUpperCase()}</span>
                        <h3 class="text-heading" style="font-size: 24px;">${item.title}</h3>
                        <p class="text-body">${item.desc}</p>
                        <button class="ui-button js-open-interface" data-id="${item.id}">
                            Open Interface
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Делегирование событий: слушаем клик на всей сетке
        this.grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-open-interface');
            if (btn) {
                const id = btn.dataset.id;
                this.openInterface(id);
            }
        });
    }

    openInterface(id) {
        console.log(`Batura System: Opening interface for [${id}]`);
        document.body.classList.add('interface-is-open');
    }

    closeInterface() {
        document.body.classList.remove('interface-is-open');
    }
}

// Экспортируем в глобальное поле только то, что нужно для тестов
window.exprManager = new ExpressionManager();