
import { initMobileNavigation } from './navigation.js';

initMobileNavigation();

document.addEventListener('DOMContentLoaded', () => {


    // Home Page Province Filter & Modal Guides
    const provinceBtns = document.querySelectorAll('.province-btn');
    const destinationCards = document.querySelectorAll('.destination-card');

    if (provinceBtns.length > 0 && destinationCards.length > 0 && !document.getElementById('destinations-grid')) {
        provinceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                provinceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedProvince = btn.getAttribute('data-province');

                destinationCards.forEach(card => {
                    const cardProvince = card.getAttribute('data-province');
                    if (selectedProvince === 'all' || cardProvince === selectedProvince) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Site Search
    const searchInput = document.getElementById('site-search');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput) {
        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();
            destinationCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
                const location = card.querySelector('.card-location')?.textContent.toLowerCase() || '';

                if (title.includes(query) || desc.includes(query) || location.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            } else if (searchInput.value === '') {
                destinationCards.forEach(card => card.style.display = 'flex');
            }
        });

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
    }

    // Guide Modal System
    const modal = document.getElementById('guide-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalLocation = document.getElementById('modal-location');
    const modalBody = document.getElementById('modal-body');

    const guideData = {
        marlboro: {
            title: "Marlboro Hills Guide",
            location: "Mahatao, Batanes",
            details: "Racuh A Payaman (Marlboro Hills) offers breathtaking sights of rolling slopes meeting the ocean. Best visited early morning or late afternoon. Remember to stay on designated trails to preserve pasture lands."
        },
        callao: {
            title: "Callao Cave Eco-Park Guide",
            location: "Peñablanca, Cagayan",
            details: "A short 184-step climb leads to the cavernous entrance. The main chamber features a natural stone altar where Catholic masses are held. Local guides are available at the entrance."
        },
        ilagan: {
            title: "Ilagan Sanctuary Guide",
            location: "City of Ilagan, Isabela",
            details: "An eco-tourism haven ideal for adventure enthusiasts. Features mountain trekking trails, natural spring pools, and cable car rides over protected forest greenery."
        },
        magat: {
            title: "Lower Magat Eco-Park Guide",
            location: "Diadi, Nueva Vizcaya",
            details: "Perfect for family picnics, overnight camping, and birdwatching. Includes native log cabins, boating facilities, and well-maintained forest walks."
        },
        governors: {
            title: "Governor's Rapid Guide",
            location: "Maddela, Quirino",
            details: "Offers exciting river boating, swimming, and rock-climbing options. Guided boat trips navigate through steep limestone gorges and cavern passages."
        }
    };

    const detailButtons = document.querySelectorAll('.btn-details[data-modal]');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-modal');
            const info = guideData[key];

            if (info && modal) {
                modalTitle.textContent = info.title;
                modalLocation.textContent = "📍 " + info.location;
                modalBody.innerHTML = `<p>${info.details}</p>`;
                modal.showModal();
            }
        });
    });

    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', () => modal.close());
        modal.addEventListener('click', (e) => {
            const dialogBounds = modal.getBoundingClientRect();
            if (
                e.clientX < dialogBounds.left ||
                e.clientX > dialogBounds.right ||
                e.clientY < dialogBounds.top ||
                e.clientY > dialogBounds.bottom
            ) {
                modal.close();
            }
        });
    }
});