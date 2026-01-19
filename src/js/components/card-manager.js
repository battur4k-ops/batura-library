/* ============================================================
   JS / COMPONENTS / CARD-MANAGER.JS
   Batura Library | Master Assembly v23.3 [Global Search Sync]
   ============================================================ */

import { CatalogEngine } from '../core/catalog-engine.js';
import { EXPRESSIONS_DB } from '../data/library-expressions.js';

export class CardManager {
    constructor() {
        this.container = document.getElementById('expressionsGrid');
        // Данные текущей страницы
        this.currentData = [...EXPRESSIONS_DB];

        if (!this.container) return;
        this.init();
    }

    init() {
        this.render();
        
        // 1. Слушаем фильтры категорий (AE_MATH и т.д.)
        window.addEventListener('batura:filterChanged', (e) => this.filter(e.detail.tag));
        
        // 2. СВЯЗКА: Слушаем глобальное событие поиска из Навбара
        window.addEventListener('batura:search', (e) => this.search(e.detail.query));
    }

    /**
     * LEGO-КОНСТРУКТОР ТЕМПЛЕЙТА
     */
    cardTemplate(item, index) {
        const displayIndex = index.toString().padStart(2, '0');
        
        const tagsPart = item.tags ? `
            <div class="b-static-card__tags l-flex-group">
                ${item.tags.map(tag => `<span class="ui-tag"><span>${tag}</span></span>`).join('')}
            </div>` : '';

        const previewPart = item.previewID ? `
            <div class="b-preview-box" data-preview="${item.previewID}">
                <div class="b-preview-box__canvas"></div>
            </div>` : '';

        const bodyPart = `
            <div class="b-static-card__body">
                <h3 class="text-heading">${item.title}</h3>
                ${tagsPart} 
                <p class="text-body">${item.description}</p>
            </div>`;

        const actionPart = `
            <div class="b-static-card__actions">
                <button class="ui-button" type="button">
                    <span>Open_Interface</span>
                </button>
            </div>`;

        return `
            <article class="b-static-card" data-category="${item.category || 'math'}">
                <div class="b-static-card__viewport">
                    <div class="b-static-card__top">
                        <span class="b-static-card__index">${displayIndex}</span>
                        <span class="text-data">// AE_${(item.category || 'math').toUpperCase()}</span>
                    </div>
                    ${previewPart}
                    ${bodyPart}
                    ${actionPart}
                </div>
            </article>
        `;
    }

    render() {
        CatalogEngine.render(this.currentData, this.container, this.cardTemplate.bind(this));
        
        // Оживляем физику и цвета (Chroma)
        window.dispatchEvent(new CustomEvent('batura:contentReady'));
    }

    filter(tag) {
        this.currentData = tag === 'all' 
            ? [...EXPRESSIONS_DB] 
            : EXPRESSIONS_DB.filter(i => i.category === tag);
            
        this.render();
    }

    search(query) {
        const q = query.toLowerCase();
        // Фильтруем данные ТОЛЬКО этой страницы
        this.currentData = EXPRESSIONS_DB.filter(i => {
            const inTitle = i.title.toLowerCase().includes(q);
            const inDesc = i.description.toLowerCase().includes(q);
            const inTags = i.tags ? i.tags.some(t => t.toLowerCase().includes(q)) : false;
            
            return inTitle || inDesc || inTags;
        });
        this.render();
    }
}