/**
 * BATURA LIBRARY | EXPRESSION FILTER
 * Система управления тегами v1.0
 */

class ExpressionFilter {
    constructor() {
        this.container = document.getElementById('filter-container');
        
        // ТВОЯ ПАНЕЛЬ УПРАВЛЕНИЯ ТЕГАМИ:
        this.tags = [
            "All Expressions",
            "Typography",
            "Transform",
            "Physics",
            "Utility"
        ];

        if (this.container) this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        // Генерируем кнопки. Первый тег делаем активным.
        this.container.innerHTML = this.tags.map((tag, index) => `
            <button class="ui-button ${index === 0 ? 'is-active' : ''}" data-filter="${tag.toLowerCase()}">
                ${tag}
            </button>
        `).join('');
    }

    bindEvents() {
        const buttons = this.container.querySelectorAll('.ui-button');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Уровень Apple: Сначала мгновенно переключаем визуальное состояние
                buttons.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                // Логика фильтрации (пока просто лог в консоль)
                console.log(`Batura System: Filtering by [${btn.dataset.filter}]`);
            });
        });
    }
}

// Инициализация только на нужной странице
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'expressions') {
        new ExpressionFilter();
    }
});