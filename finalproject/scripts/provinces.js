import { initMobileNavigation } from './navigation.js';

initMobileNavigation();

document.addEventListener('DOMContentLoaded', async () => {
    let allAttractions = [];
    const searchParams = new URLSearchParams(window.location.search);
    const provinceParam = searchParams.get('province')?.trim() || '';
    const queryParam = searchParams.get('q')?.trim() || '';

    const grid = document.getElementById('destinations-grid');
    const searchInput = document.getElementById('attraction-search');
    const provinceBtns = document.querySelectorAll('.province-btn');
    const noResults = document.getElementById('no-results');
    const searchButton = document.getElementById('eat-search-btn');
    const normalizeProvince = value => value.trim().toLowerCase().replace(/-/g, ' ');
    const matchingProvince = value => Array.from(provinceBtns).find(
        button => normalizeProvince(button.dataset.province) === normalizeProvince(value)
    );
    let currentProvince = 'all';
    let searchQuery = queryParam.toLowerCase();

    if (provinceParam) {
        currentProvince = matchingProvince(provinceParam)?.dataset.province || 'all';
    } else if (!queryParam) {
        try {
            const savedProvince = localStorage.getItem('preferredProvince');
            currentProvince = matchingProvince(savedProvince || '')?.dataset.province || 'all';
        } catch (error) {
            console.warn('Unable to read the saved province preference:', error);
        }
    }

    searchInput.value = queryParam;
    provinceBtns.forEach(button => {
        button.classList.toggle(
            'active',
            normalizeProvince(button.dataset.province) === normalizeProvince(currentProvince)
        );
    });
    
    // Modal Elements
    const modal = document.getElementById('attraction-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLocation = document.getElementById('modal-location');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close-btn');

    // Emoji mapper fallback if image fails or is missing
    function getCategoryEmoji(category) {
        const cat = category ? category.toLowerCase() : '';
        if (cat.includes('cave')) return '🦇';
        if (cat.includes('eco') || cat.includes('park') || cat.includes('nature')) return '🌲';
        if (cat.includes('beach') || cat.includes('coastal') || cat.includes('sea')) return '🏖️';
        if (cat.includes('river') || cat.includes('waterfall') || cat.includes('rapids')) return '🌊';
        if (cat.includes('heritage') || cat.includes('church') || cat.includes('historical')) return '🏛️';
        if (cat.includes('viewpoint') || cat.includes('hill')) return '⛰️';
        return '📍';
    }

    try {
        const response = await fetch('./data/index.json');
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        const provinces = data.region?.provinces;
        if (!Array.isArray(provinces)) throw new Error('Attraction data is unavailable.');

        allAttractions = provinces.flatMap(province =>
            (province.main_attractions || []).map(attraction => ({
                ...attraction,
                province: province.province_name
            }))
        );
        renderAttractions();
    } catch (error) {
        console.error('Error loading attractions dataset:', error);
        grid.innerHTML = '<p class="data-error">Unable to load attraction data.</p>';
    }

    // 2. Filter & Render Logic
    function renderAttractions() {
        grid.innerHTML = '';

        const filtered = allAttractions.filter(item => {
            const matchesProvince = currentProvince === 'all' ||
                normalizeProvince(item.province) === normalizeProvince(currentProvince);
            const matchesSearch = item.name.toLowerCase().includes(searchQuery) ||
                                  item.location.toLowerCase().includes(searchQuery) ||
                                  item.category.toLowerCase().includes(searchQuery) ||
                                  item.description.toLowerCase().includes(searchQuery) ||
                                  (item.image && item.image.toLowerCase().includes(searchQuery)); // Fixed typo here
            return matchesProvince && matchesSearch;
        });

        

        if (filtered.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        filtered.forEach(item => {
            const card = document.createElement('article');
            card.className = 'destination-card';
            card.dataset.province = item.province.toLowerCase();

            const fallbackEmoji = getCategoryEmoji(item.category);

            // Construct image path assuming images are inside images/
            const imagePath = item.image ? `./images/${item.image}` : '';

            // ==================== INSERT HERE ==================== //
            
            // 1. Build the Card HTML
            card.innerHTML = `
                <div class="card-media">
                    <span class="card-badge"></span>
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
                        <span class="fee-tag">${item.category}</span>
                        <button class="btn-details" data-name="${item.name}">Details</button>
                    </div>
                </div>
            `;

            // 2. Attach Image Pop-Up (Lightbox) Click Event
            const imgElement = card.querySelector('.card-media img');
            if (imgElement) {
                imgElement.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevents details modal from opening when clicking the image
                    openImageLightbox(imagePath, item.name);
                });
            }

            // 3. Attach Details Button Click Event
            const detailsBtn = card.querySelector('.btn-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => showDetails(item));
            }

            // 4. Append card to DOM grid
            grid.appendChild(card);
            
            // ==================================================== //
        });
    }

    // 3. Modal Handler
    function showDetails(item) {
        modalTitle.textContent = item.name;
        modalLocation.textContent = `📍 ${item.location}`;
        
        const fallbackEmoji = getCategoryEmoji(item.category);
        const imagePath = item.image ? `./images/${item.image}` : '';

        modalBody.innerHTML = `
            ${item.image ? `<div style="margin-bottom: 1rem; height: 180px; overflow: hidden; border-radius: 6px;"><img src="${imagePath}" alt="${item.name}" width="640" height="360" decoding="async" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none';"></div>` : ''}
            <p style="margin-bottom: 0.5rem;"><strong>Category:</strong> ${item.category}</p>
            <p style="margin-bottom: 1rem;">${item.description}</p>
            ${(item.contact_phone || item.email || item.website) ? `<div style="background-color: var(--bg-alt); padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                ${item.contact_phone ? `<p style="margin-bottom: 0.4rem;"><strong>Phone:</strong> ${item.contact_phone}</p>` : ''}
                ${item.email ? `<p style="margin-bottom: 0.4rem;"><strong>Email:</strong> <a href="mailto:${item.email}">${item.email}</a></p>` : ''}
                ${item.website ? `<p><strong>Official Site:</strong> <a href="${item.website}" target="_blank" rel="noopener" style="color: var(--accent-green); font-weight: bold;">Visit Website</a></p>` : ''}
            </div>` : ''}
        `;
        modal.showModal();
    }

    modalClose.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });

    // 4. Filter Event Listeners
    provinceBtns.forEach(button => {
        button.addEventListener('click', () => {
            currentProvince = button.dataset.province;
            provinceBtns.forEach(provinceButton => {
                provinceButton.classList.toggle('active', provinceButton === button);
            });
            try {
                localStorage.setItem('preferredProvince', currentProvince);
            } catch (error) {
                console.warn('Unable to save the province preference:', error);
            }
            renderAttractions();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderAttractions();
    });

    searchButton.addEventListener('click', () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        renderAttractions();
    });
});

// 5. Pop-up image 

// Add Lightbox Handler inside DOMContentLoaded in scripts/provinces.js
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close-btn');

function openImageLightbox(imageSrc, caption) {
    if (!lightbox || !lightboxImg || !lightboxCaption || !imageSrc) return;
    lightboxImg.src = imageSrc;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.showModal();
}

if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.close(); // Close on backdrop click
    });
}