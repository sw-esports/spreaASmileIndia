/**
 * Search Enhancement Module
 * Provides intelligent search functionality across the website
 */

class SearchEnhancer {
    constructor() {
        this.searchData = null;
        this.searchIndex = null;
        this.searchModal = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createSearchModal();
            this.setupKeyboardShortcuts();
            this.buildSearchIndex();
            this.enhanceExistingSearch();
        });
    }

    /**
     * Create Global Search Modal
     */
    createSearchModal() {
        const modalHTML = `
            <div id="global-search-modal" class="search-modal" style="display: none;">
                <div class="search-modal-overlay"></div>
                <div class="search-modal-content">
                    <div class="search-modal-header">
                        <div class="search-input-wrapper">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" 
                                   id="global-search-input" 
                                   placeholder="Search pages, programs, team members..."
                                   autocomplete="off">
                            <button class="search-close" aria-label="Close search">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="search-shortcuts">
                            <kbd>↑</kbd><kbd>↓</kbd> to navigate
                            <kbd>Enter</kbd> to select
                            <kbd>Esc</kbd> to close
                        </div>
                    </div>
                    <div class="search-results" id="search-results">
                        <div class="search-suggestions">
                            <div class="suggestion-category">
                                <h4>Popular Searches</h4>
                                <div class="suggestion-item" data-query="programs">
                                    <i class="fas fa-heart"></i>
                                    <span>Our Programs</span>
                                </div>
                                <div class="suggestion-item" data-query="donate">
                                    <i class="fas fa-donate"></i>
                                    <span>Donate Now</span>
                                </div>
                                <div class="suggestion-item" data-query="volunteer">
                                    <i class="fas fa-hands-helping"></i>
                                    <span>Volunteer</span>
                                </div>
                                <div class="suggestion-item" data-query="contact">
                                    <i class="fas fa-envelope"></i>
                                    <span>Contact Us</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 10vh;
            }
            
            .search-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
            }
            
            .search-modal-content {
                position: relative;
                width: 90%;
                max-width: 600px;
                background: var(--bg-primary);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                max-height: 70vh;
                display: flex;
                flex-direction: column;
            }
            
            .search-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .search-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                background: var(--bg-secondary);
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 1rem;
            }
            
            .search-icon {
                color: var(--text-secondary);
                margin-right: 0.75rem;
                font-size: 1.25rem;
            }
            
            #global-search-input {
                flex: 1;
                border: none;
                background: none;
                font-size: 1.125rem;
                color: var(--text-primary);
                outline: none;
            }
            
            #global-search-input::placeholder {
                color: var(--text-secondary);
            }
            
            .search-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .search-close:hover {
                background: var(--bg-tertiary);
                color: var(--text-primary);
            }
            
            .search-shortcuts {
                display: flex;
                gap: 1rem;
                font-size: 0.875rem;
                color: var(--text-secondary);
                align-items: center;
            }
            
            .search-shortcuts kbd {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 0.25rem 0.5rem;
                font-size: 0.75rem;
                font-family: inherit;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .search-results {
                flex: 1;
                overflow-y: auto;
                max-height: 400px;
            }
            
            .search-suggestions {
                padding: 1rem 1.5rem;
            }
            
            .suggestion-category h4 {
                color: var(--text-secondary);
                font-size: 0.875rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 1rem;
            }
            
            .suggestion-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 0.5rem;
            }
            
            .suggestion-item:hover,
            .suggestion-item.selected {
                background: var(--bg-secondary);
                color: var(--color-primary);
            }
            
            .suggestion-item i {
                width: 20px;
                color: var(--color-primary);
            }
            
            .result-item {
                display: flex;
                flex-direction: column;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .result-item:hover,
            .result-item.selected {
                background: var(--bg-secondary);
            }
            
            .result-item:last-child {
                border-bottom: none;
            }
            
            .result-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .result-description {
                color: var(--text-secondary);
                font-size: 0.875rem;
                line-height: 1.4;
            }
            
            .result-breadcrumb {
                color: var(--color-primary);
                font-size: 0.75rem;
                margin-top: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .no-results {
                text-align: center;
                padding: 3rem 1.5rem;
                color: var(--text-secondary);
            }
            
            .no-results i {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.5;
            }
            
            @media (max-width: 768px) {
                .search-modal-content {
                    width: 95%;
                    margin: 1rem;
                }
                
                .search-shortcuts {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styles);

        // Setup event listeners
        this.setupModalEvents();
    }

    setupModalEvents() {
        const modal = document.getElementById('global-search-modal');
        const input = document.getElementById('global-search-input');
        const overlay = modal.querySelector('.search-modal-overlay');
        const closeBtn = modal.querySelector('.search-close');
        const results = document.getElementById('search-results');

        let selectedIndex = -1;
        let currentResults = [];

        // Close modal
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            input.value = '';
            selectedIndex = -1;
            this.showSuggestions();
        };

        // Open modal
        window.openSearchModal = () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            input.focus();
            this.showSuggestions();
        };

        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);

        // Search input
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            selectedIndex = -1;
            
            if (query.length > 0) {
                this.performSearch(query);
            } else {
                this.showSuggestions();
            }
        });

        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            const resultItems = results.querySelectorAll('.result-item, .suggestion-item');
            
            switch (e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, resultItems.length - 1);
                    this.updateSelection(resultItems);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    this.updateSelection(resultItems);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && resultItems[selectedIndex]) {
                        this.selectResult(resultItems[selectedIndex]);
                    }
                    break;
            }
        });

        // Suggestion clicks
        results.addEventListener('click', (e) => {
            const item = e.target.closest('.suggestion-item, .result-item');
            if (item) {
                this.selectResult(item);
            }
        });
    }

    updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });

        // Scroll selected item into view
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({
                block: 'nearest'
            });
        }
    }

    selectResult(item) {
        const suggestionItem = item.closest('.suggestion-item');
        const resultItem = item.closest('.result-item');

        if (suggestionItem) {
            const query = suggestionItem.dataset.query;
            document.getElementById('global-search-input').value = query;
            this.performSearch(query);
        } else if (resultItem) {
            const url = resultItem.dataset.url;
            if (url) {
                window.location.href = url;
            }
        }
    }

    showSuggestions() {
        const results = document.getElementById('search-results');
        results.innerHTML = `
            <div class="search-suggestions">
                <div class="suggestion-category">
                    <h4>Popular Searches</h4>
                    <div class="suggestion-item" data-query="programs">
                        <i class="fas fa-heart"></i>
                        <span>Our Programs</span>
                    </div>
                    <div class="suggestion-item" data-query="donate">
                        <i class="fas fa-donate"></i>
                        <span>Donate Now</span>
                    </div>
                    <div class="suggestion-item" data-query="volunteer">
                        <i class="fas fa-hands-helping"></i>
                        <span>Volunteer</span>
                    </div>
                    <div class="suggestion-item" data-query="contact">
                        <i class="fas fa-envelope"></i>
                        <span>Contact Us</span>
                    </div>
                    <div class="suggestion-item" data-query="team">
                        <i class="fas fa-users"></i>
                        <span>Meet Our Team</span>
                    </div>
                    <div class="suggestion-item" data-query="impact">
                        <i class="fas fa-chart-line"></i>
                        <span>Our Impact</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup Keyboard Shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                window.openSearchModal();
            }
        });

        // Add search shortcut indicator to existing search buttons
        const searchButtons = document.querySelectorAll('.search-btn, .search-icon');
        searchButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.openSearchModal();
            });

            // Add keyboard hint
            btn.title = 'Search (Ctrl+K)';
        });
    }

    /**
     * Build Search Index
     */
    buildSearchIndex() {
        this.searchData = [
            // Pages
            {
                type: 'page',
                title: 'Home',
                description: 'Welcome to SASI - Transforming lives through education, health, and community development',
                url: '/',
                keywords: ['home', 'main', 'welcome', 'sasi']
            },
            {
                type: 'page',
                title: 'About Us',
                description: 'Learn about our mission, vision, and the people behind SASI',
                url: '/about',
                keywords: ['about', 'mission', 'vision', 'history', 'team']
            },
            {
                type: 'page',
                title: 'Our Programs',
                description: 'Discover our comprehensive programs in education, health, nutrition, and vocational training',
                url: '/programs',
                keywords: ['programs', 'education', 'health', 'nutrition', 'vocational', 'training']
            },
            {
                type: 'page',
                title: 'Education Program',
                description: 'Empowering children through quality education and learning opportunities',
                url: '/programs/education',
                keywords: ['education', 'learning', 'children', 'school', 'literacy']
            },
            {
                type: 'page',
                title: 'Health Program',
                description: 'Providing healthcare services and promoting wellness in communities',
                url: '/programs/health',
                keywords: ['health', 'healthcare', 'medical', 'wellness', 'treatment']
            },
            {
                type: 'page',
                title: 'Nutrition Program',
                description: 'Fighting malnutrition and promoting healthy eating habits',
                url: '/programs/nutrition',
                keywords: ['nutrition', 'food', 'malnutrition', 'healthy', 'meals']
            },
            {
                type: 'page',
                title: 'Vocational Training',
                description: 'Skill development and job training for sustainable livelihoods',
                url: '/programs/vocational',
                keywords: ['vocational', 'training', 'skills', 'jobs', 'employment']
            },
            {
                type: 'page',
                title: 'Our Impact',
                description: 'See the difference we\'re making in communities across India',
                url: '/impact',
                keywords: ['impact', 'results', 'achievements', 'success', 'stories']
            },
            {
                type: 'page',
                title: 'Get Involved',
                description: 'Join us in our mission through donations, volunteering, or partnerships',
                url: '/get-involved',
                keywords: ['donate', 'volunteer', 'partner', 'support', 'help']
            },
            {
                type: 'page',
                title: 'Donate',
                description: 'Support our cause with a donation',
                url: '/get-involved/donate',
                keywords: ['donate', 'donation', 'support', 'contribute', 'give']
            },
            {
                type: 'page',
                title: 'Volunteer',
                description: 'Volunteer your time and skills to make a difference',
                url: '/get-involved/volunteer',
                keywords: ['volunteer', 'help', 'contribute', 'time', 'skills']
            },
            {
                type: 'page',
                title: 'Contact Us',
                description: 'Get in touch with our team',
                url: '/contact',
                keywords: ['contact', 'reach', 'touch', 'email', 'phone']
            },
            {
                type: 'page',
                title: 'Media Center',
                description: 'Latest news, updates, and media coverage',
                url: '/media',
                keywords: ['media', 'news', 'updates', 'press', 'coverage']
            }
        ];
    }

    /**
     * Perform Search
     */
    performSearch(query) {
        const results = this.searchData.filter(item => {
            const searchText = `${item.title} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.displayResults(results, query);
    }

    displayResults(results, query) {
        const resultsContainer = document.getElementById('search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try different keywords or browse our popular sections</p>
                </div>
            `;
            return;
        }

        const resultHTML = results.map(result => `
            <div class="result-item" data-url="${result.url}">
                <div class="result-title">${this.highlightQuery(result.title, query)}</div>
                <div class="result-description">${this.highlightQuery(result.description, query)}</div>
                <div class="result-breadcrumb">${result.type}</div>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultHTML;
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--color-primary); color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    /**
     * Enhance Existing Search
     */
    enhanceExistingSearch() {
        // Find existing search inputs and enhance them
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
        
        searchInputs.forEach(input => {
            // Add autocomplete
            this.addAutocomplete(input);
            
            // Add search suggestions
            this.addSearchSuggestions(input);
        });
    }

    addAutocomplete(input) {
        const suggestions = this.searchData.map(item => item.title);
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const matches = suggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(query)
            ).slice(0, 5);
            
            this.showAutocomplete(input, matches);
        });
    }

    showAutocomplete(input, suggestions) {
        // Remove existing autocomplete
        const existing = input.parentNode.querySelector('.autocomplete-dropdown');
        if (existing) existing.remove();

        if (suggestions.length === 0) return;

        const dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.textContent = suggestion;
            item.style.cssText = `
                padding: 0.75rem 1rem;
                cursor: pointer;
                border-bottom: 1px solid var(--border-color);
                transition: background 0.2s ease;
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--bg-secondary)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = '';
            });
            
            item.addEventListener('click', () => {
                input.value = suggestion;
                dropdown.remove();
                // Trigger search if there's a form
                const form = input.closest('form');
                if (form) form.dispatchEvent(new Event('submit'));
            });
            
            dropdown.appendChild(item);
        });

        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(dropdown);

        // Remove dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function removeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== input) {
                    dropdown.remove();
                    document.removeEventListener('click', removeDropdown);
                }
            });
        }, 0);
    }

    addSearchSuggestions(input) {
        const suggestionsData = [
            'Our Programs',
            'Education',
            'Health',
            'Nutrition',
            'Volunteer',
            'Donate',
            'Contact',
            'About Us',
            'Our Team',
            'Impact Stories'
        ];

        input.setAttribute('list', 'search-suggestions');
        
        let datalist = document.getElementById('search-suggestions');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'search-suggestions';
            document.body.appendChild(datalist);
        }

        datalist.innerHTML = suggestionsData.map(suggestion => 
            `<option value="${suggestion}">`
        ).join('');
    }
}

// Initialize search enhancer
const searchEnhancer = new SearchEnhancer();

// Export for use in other modules
window.SearchEnhancer = searchEnhancer;