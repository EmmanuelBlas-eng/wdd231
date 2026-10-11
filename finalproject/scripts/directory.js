/* ==========================================================================
   EAT AND STAY DIRECTORY - DYNAMIC JSON DATA FETCH & SEARCH LOGIC
   ========================================================================== */

import { initMobileNavigation } from './navigation.js';

initMobileNavigation();

document.addEventListener('DOMContentLoaded', async () => {
    let eatData = [];
    let stayData = [];

    let currentEatFilter = 'all';
    let currentStayFilter = 'all';

    // Shared Modal Elements
    const modal = document.getElementById('directory-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLocation = document.getElementById('modal-location');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close-btn');

    // Lightbox Elements
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    try {
        const response = await fetch('./data/index.json');
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        processJsonData(data);
        renderEatCards(eatData);
        renderStayCards(stayData);
        setupEventListeners();
    } catch (error) {
        console.error('Error fetching directory JSON data:', error);
        showErrorMessage();
    }

    function processJsonData(data) {
        const provinces = data.region?.provinces || [];

        provinces.forEach(province => {
            if (province.popular_eat_and_dine) {
                province.popular_eat_and_dine.forEach(item => {
                    eatData.push({
                        ...item,
                        type: item.type || "Local Dining",
                        location: item.location || province.province_name,
                        specialty: item.specialty || "Local delicacies and dining",
                        province: province.province_name
                    });
                });
            }

            if (province.popular_stays) {
                province.popular_stays.forEach(item => {
                    stayData.push({
                        ...item,
                        type: item.type || "Accommodation",
                        location: item.location || province.province_name,
                        description: item.description || `${item.type || 'Accommodation'} in ${item.location || province.province_name}.`,
                        province: province.province_name
                    });
                });
            }
        });
    }

    /**
     * Render Eat & Dine Cards
     */
    function renderEatCards(items) {
        const container = document.getElementById('eat-grid');
        if (!container) return;

       // Render Eat Cards Empty State
        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-results-box" style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                    <h3>No dining found</h3>
                    <p>Try adjusting your search query or dining filter.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'eat-card';

            const fallbackEmoji = '🍽️';
            const imagePath = item.image ? `./images/${item.image}` : '';

            card.innerHTML = `
                <div class="card-media">
                    ${item.image ? 
                        `<img src="${imagePath}" alt="${item.name}" loading="lazy" decoding="async" width="110" height="130" style="cursor: pointer;" onerror="this.outerHTML='<span style=\\'font-size: 1.8rem;\\'>${fallbackEmoji}</span>';">`
                        : `<span style="font-size: 1.8rem;">${fallbackEmoji}</span>`
                    }
                </div>
                <div class="card-body">
                    <div>
                        <h3>${item.name}</h3>
                        <p class="card-location">📍 ${item.location}</p>
                        <p class="card-desc"><strong>Specialty:</strong> ${item.specialty}</p>
                    </div>
                    <div class="card-footer">
                        <span class="fee-tag">${item.type}</span>
                        <button class="btn-details">Details</button>
                    </div>
                </div>
            `;

            // Attach Image Lightbox Event
            const imgElement = card.querySelector('.card-media img');
            if (imgElement) {
                imgElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openImageLightbox(imagePath, item.name);
                });
            }

            // Attach Details Button Click
            const detailsBtn = card.querySelector('.btn-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => showEatDetails(item));
            }

            container.appendChild(card);
        });
    }

    /**
     * Render Stay Cards
     */
    function renderStayCards(items) {
        const container = document.getElementById('stay-grid');
        if (!container) return;

       // Render Stay Cards Empty State
        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-results-box" style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                    <h3>No accommodations found</h3>
                    <p>Try adjusting your search query or stay filter.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'stay-card';

            const fallbackEmoji = '🏨';
            const imagePath = item.image ? `./images/${item.image}` : '';

            card.innerHTML = `
                <div class="card-media">
                    ${item.image ? 
                        `<img src="${imagePath}" alt="${item.name}" loading="lazy" decoding="async" width="110" height="130" style="cursor: pointer;" onerror="this.outerHTML='<span style=\\'font-size: 1.8rem;\\'>${fallbackEmoji}</span>';">`
                        : `<span style="font-size: 1.8rem;">${fallbackEmoji}</span>`
                    }
                </div>
                <div class="card-body">
                    <div>
                        <h3>${item.name}</h3>
                        <p class="card-location">📍 ${item.location}</p>
                        <p class="card-desc">${item.description}</p>
                    </div>
                    <div class="card-footer">
                        <span class="fee-tag">${item.type}</span>
                        <button class="btn-details">Details</button>
                    </div>
                </div>
            `;

            // Attach Image Lightbox Event
            const imgElement = card.querySelector('.card-media img');
            if (imgElement) {
                imgElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openImageLightbox(imagePath, item.name);
                });
            }

            // Attach Details Button Click
            const detailsBtn = card.querySelector('.btn-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => showStayDetails(item));
            }

            container.appendChild(card);
        });
    }

    /**
     * Modal Display Handlers
     */
    function showEatDetails(item) {
        modalTitle.textContent = item.name;
        modalLocation.textContent = `📍 ${item.location}`;
        
        const imagePath = item.image ? `./images/${item.image}` : '';

        modalBody.innerHTML = `
            ${item.image ? `<div style="margin-bottom: 1rem; height: 180px; overflow: hidden; border-radius: 6px; "><img src="${imagePath}" alt="${item.name}" width="640" height="360" decoding="async" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none';"></div>` : ''}
            <p style="margin-bottom: 0.5rem;"><strong>Type:</strong> ${item.type}</p>
            <p style="margin-bottom: 1rem;"><strong>Specialty:</strong> ${item.specialty}</p>
            ${(item.phone || item.email || (item.facebook && item.facebook !== '#')) ? `<div style="background-color: var(--bg-alt); padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                ${item.phone ? `<p style="margin-bottom: 0.4rem;"><strong>Phone:</strong> ${item.phone}</p>` : ''}
                ${item.email ? `<p style="margin-bottom: 0.4rem;"><strong>Email:</strong> <a href="mailto:${item.email}">${item.email}</a></p>` : ''}
                ${item.facebook && item.facebook !== '#' ? `<p><strong>Facebook:</strong> <a href="${item.facebook}" target="_blank" rel="noopener" style="color: var(--accent-green); font-weight: bold;">Visit Facebook Page</a></p>` : ''}
            </div>` : ''}
        `;
        modal.showModal();
    }

    function showStayDetails(item) {
        modalTitle.textContent = item.name;
        modalLocation.textContent = `📍 ${item.location}`;
        
        const imagePath = item.image ? `./images/${item.image}` : '';

        modalBody.innerHTML = `
            ${item.image ? `<div style="margin-bottom: 1rem; height: 180px; overflow: hidden; border-radius: 6px;"><img src="${imagePath}" alt="${item.name}" width="640" height="360" decoding="async" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none';"></div>` : ''}
            <p style="margin-bottom: 0.5rem;"><strong>Type:</strong> ${item.type}</p>
            <p style="margin-bottom: 1rem;">${item.description}</p>
            ${(item.phone || item.email || (item.website && item.website !== '#')) ? `<div style="background-color: var(--bg-alt); padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                ${item.phone ? `<p style="margin-bottom: 0.4rem;"><strong>Phone:</strong> ${item.phone}</p>` : ''}
                ${item.email ? `<p style="margin-bottom: 0.4rem;"><strong>Email:</strong> <a href="mailto:${item.email}">${item.email}</a></p>` : ''}
                ${item.website && item.website !== '#' ? `<p><strong>Website:</strong> <a href="${item.website}" target="_blank" rel="noopener" style="color: var(--accent-green); font-weight: bold;">Visit Website</a></p>` : ''}
            </div>` : ''}
        `;
        modal.showModal();
    }

    // Modal Close Listeners
    if (modalClose) modalClose.addEventListener('click', () => modal.close());
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });
    }

    // Lightbox Handlers
    function openImageLightbox(imageSrc, caption) {
        if (!lightbox || !imageSrc) return;
        lightboxImg.src = imageSrc;
        lightboxCaption.textContent = caption;
        lightbox.showModal();
    }

    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', () => lightbox.close());
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.close();
        });
    }

   /**
     * Enhanced Search & Multi-Keyword Filter Matching
     */
    function setupEventListeners() {
        const eatSearchInput = document.getElementById('eat-search-input');
        const eatSearchBtn = document.getElementById('eat-search-btn');
        const eatFilterBtns = document.querySelectorAll('[data-eat-filter]');

        function matchEatCategory(item, filterCategory) {
            if (filterCategory === 'all') return true;

            const textToSearch = `${item.type} ${item.name} ${item.specialty}`.toLowerCase();

            switch (filterCategory) {
                case 'panciteria':
                    return textToSearch.includes('panciteria') || textToSearch.includes('pancit') || textToSearch.includes('batil');
                case 'seafood':
                    return textToSearch.includes('seafood') || textToSearch.includes('native') || textToSearch.includes('fish') || textToSearch.includes('grill') || textToSearch.includes('filipino');
                case 'cafe':
                    return textToSearch.includes('cafe') || textToSearch.includes('coffee') || textToSearch.includes('dessert') || textToSearch.includes('bakery') || textToSearch.includes('pastry');
                default:
                    return textToSearch.includes(filterCategory.toLowerCase());
            }
        }

        function filterEat() {
            const query = eatSearchInput ? eatSearchInput.value.toLowerCase().trim() : '';

            const filtered = eatData.filter(item => {
                const matchesSearch = !query || 
                                      item.name.toLowerCase().includes(query) ||
                                      item.location.toLowerCase().includes(query) ||
                                      item.specialty.toLowerCase().includes(query) ||
                                      item.province.toLowerCase().includes(query) ||
                                      item.type.toLowerCase().includes(query);

                const matchesFilter = matchEatCategory(item, currentEatFilter);

                return matchesSearch && matchesFilter;
            });

            renderEatCards(filtered);
        }

        if (eatSearchInput) eatSearchInput.addEventListener('input', filterEat);
        if (eatSearchBtn) eatSearchBtn.addEventListener('click', filterEat);

        eatFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                eatFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentEatFilter = btn.getAttribute('data-eat-filter');
                filterEat();
            });
        });

        const staySearchInput = document.getElementById('stay-search-input');
        const staySearchBtn = document.getElementById('stay-search-btn');
        const stayFilterBtns = document.querySelectorAll('[data-stay-filter]');

        function matchStayCategory(item, filterCategory) {
            if (filterCategory === 'all') return true;

            const textToSearch = `${item.type} ${item.name} ${item.description}`.toLowerCase();

            switch (filterCategory) {
                case 'hotel':
                    return textToSearch.includes('hotel') || textToSearch.includes('inn') || textToSearch.includes('suites') || textToSearch.includes('lodge');
                case 'resort':
                    return textToSearch.includes('resort') || textToSearch.includes('beach') || textToSearch.includes('villas');
                case 'homestay':
                    return textToSearch.includes('homestay') || textToSearch.includes('home') || textToSearch.includes('guesthouse') || textToSearch.includes('bed and dine');
                default:
                    return textToSearch.includes(filterCategory.toLowerCase());
            }
        }

        function filterStay() {
            const query = staySearchInput ? staySearchInput.value.toLowerCase().trim() : '';

            const filtered = stayData.filter(item => {
                const matchesSearch = !query ||
                                      item.name.toLowerCase().includes(query) ||
                                      item.location.toLowerCase().includes(query) ||
                                      item.description.toLowerCase().includes(query) ||
                                      item.province.toLowerCase().includes(query) ||
                                      item.type.toLowerCase().includes(query);

                const matchesFilter = matchStayCategory(item, currentStayFilter);

                return matchesSearch && matchesFilter;
            });

            renderStayCards(filtered);
        }

        if (staySearchInput) staySearchInput.addEventListener('input', filterStay);
        if (staySearchBtn) staySearchBtn.addEventListener('click', filterStay);

        stayFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                stayFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentStayFilter = btn.getAttribute('data-stay-filter');
                filterStay();
            });
        });
    }

    function showErrorMessage() {
        const eatGrid = document.getElementById('eat-grid');
        const stayGrid = document.getElementById('stay-grid');

        const errorHtml = `<p class="no-results" style="grid-column: 1/-1; color: #E53E3E; text-align: center; padding: 2rem;">Failed to load directory data.</p>`;

        if (eatGrid) eatGrid.innerHTML = errorHtml;
        if (stayGrid) stayGrid.innerHTML = errorHtml;
    }
});