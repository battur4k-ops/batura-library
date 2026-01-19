/**
 * BATURA LIBRARY | EXPRESSION MANAGER
 * Core System for handling data & overlays v1.2 (with Add functionality & Persistence)
 */

class ExpressionManager {
    constructor() {
        this.grid = document.getElementById('expressions-grid');
        this.overlay = document.getElementById('interface-overlay');
        
        // Получаем ссылки на элементы формы в оверлее
        this.titleInput = this.overlay.querySelector('#expression-title');
        this.descriptionInput = this.overlay.querySelector('#expression-description');
        this.addExpressionButton = this.overlay.querySelector('.js-add-expression');

        this.data = this.loadExpressions(); // Загружаем данные при инициализации

        if (this.grid) this.init();
    }

    init() {
        this.renderCards();
        this.bindEvents();
        
        // Связываем кнопку "Добавить выражение" в оверлее
        if (this.addExpressionButton) {
            this.addExpressionButton.addEventListener('click', () => this.handleAddExpression());
        }
    }

    loadExpressions() {
        try {
            const storedData = localStorage.getItem('baturaExpressions');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Если данные из localStorage пустые или некорректные, используем дефолтные
                return parsedData.length > 0 ? parsedData : this.getDefaultExpressions();
            }
        } catch (e) {
            console.error("Error loading expressions from localStorage", e);
        }
        // Дефолтные данные, если localStorage пуст или ошибка
        return this.getDefaultExpressions();
    }

    getDefaultExpressions() {
        return [
            {
                id: 'chain-core',
                title: 'Chain-Core',
                tag: 'EXPRESSION',
                desc: 'Инновационный экспрешн для связывания свойств и создания сложных динамических систем.'
            }
        ];
    }

    saveExpressions() {
        try {
            localStorage.setItem('baturaExpressions', JSON.stringify(this.data));
        } catch (e) {
            console.error("Error saving expressions to localStorage", e);
        }
    }

    renderCards() {
        if (!this.grid) return; // Проверка на существование grid

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
        // Делегирование событий для кнопок "Open Interface" на карточках
        this.grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-open-interface');
            if (btn) {
                const id = btn.dataset.id;
                // Сейчас это просто логирование, но в будущем можно открывать интерфейс редактирования
                console.log(`Batura System: Opening interface for existing expression [${id}]`);
                this.openInterface(); // Открываем оверлей (сейчас он показывает форму добавления)
            }
        });
    }

    // Метод для открытия интерфейса добавления нового выражения
    openAddExpressionInterface() {
        document.body.classList.add('interface-is-open');
        if (this.titleInput) this.titleInput.value = ''; // Очищаем поля
        if (this.descriptionInput) this.descriptionInput.value = '';
        if (this.titleInput) this.titleInput.focus(); // Устанавливаем фокус на первое поле
    }

    // Обработчик для кнопки "Добавить выражение" в оверлее
    handleAddExpression() {
        const title = this.titleInput ? this.titleInput.value.trim() : '';
        const desc = this.descriptionInput ? this.descriptionInput.value.trim() : '';

        if (!title || !desc) {
            alert('Пожалуйста, введите название и описание выражения.');
            return;
        }

        const newId = 'expr-' + Date.now(); // Простой уникальный ID
        const newExpression = {
            id: newId,
            title: title,
            tag: 'EXPRESSION', // По умолчанию всегда 'EXPRESSION' для новых
            desc: desc
        };

        this.data.push(newExpression);
        this.saveExpressions();
        this.renderCards(); // Перерисовываем сетку, чтобы показать новую карточку
        this.closeInterface(); // Закрываем оверлей после добавления
    }

    // Общий метод для открытия оверлея (без привязки к конкретному ID, пока для добавления)
    openInterface(id = null) { // id пока не используется для этой версии добавления
        console.log(`Batura System: Opening generic interface. ID: ${id || 'N/A'}`);
        document.body.classList.add('interface-is-open');
    }

    closeInterface() {
        document.body.classList.remove('interface-is-open');
        // Очищаем поля формы при закрытии, если они были использованы
        if (this.titleInput) this.titleInput.value = '';
        if (this.descriptionInput) this.descriptionInput.value = '';
    }
}

// Экспортируем в глобальное поле только то, что нужно для тестов
window.exprManager = new ExpressionManager();