
document.addEventListener('DOMContentLoaded', () =>{
    const track = document.getElementById('carouselTrack');
    const container = document.querySelector('.carousel-track-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const searchInput = document.getElementById('province-search-input');

    if (!track || !container) return;

    // Remove existing clones
    track.querySelectorAll('.clone').forEach(el => el.remove());

    const originalCards = Array.from(track.children);
    const totalOriginals = originalCards.length;

    // Create prefix and suffix clones
    const beforeFragment = document.createDocumentFragment();
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        beforeFragment.appendChild(clone);
    });

    const afterFragment = document.createDocumentFragment();
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        afterFragment.appendChild(clone);
    });

    track.insertBefore(beforeFragment, track.firstChild);
    track.appendChild(afterFragment);

    const allCards = Array.from(track.children);

    // Initial position: center card of middle set (Index 7)
    let currentIndex = totalOriginals + Math.floor(totalOriginals / 2);
    let isTransitioning = false;

    // Create dots
    dotsContainer.innerHTML = '';
    originalCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            goToSlide(totalOriginals + index, true);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index, animate = true) {
        currentIndex = index;

        if (animate) {
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.classList.remove('no-transition');
            isTransitioning = true;
        } else {
            track.style.transition = 'none';
            track.classList.add('no-transition');
        }

        allCards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });

        const targetCard = allCards[currentIndex];
        const containerWidth = container.getBoundingClientRect().width;
        const cardWidth = targetCard.offsetWidth;
        const cardOffsetLeft = targetCard.offsetLeft;

        const centerPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);

        track.style.transform = `translateX(-${centerPosition}px)`;

        const realIndex = (currentIndex % totalOriginals + totalOriginals) % totalOriginals;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }

    // Boundary reset handler
    track.addEventListener('transitionend', (e) => {
        if (e.target !== track) return;
        isTransitioning = false;

        let targetIndex = currentIndex;

        if (currentIndex >= totalOriginals * 2) {
            targetIndex = currentIndex - totalOriginals;
        } else if (currentIndex < totalOriginals) {
            targetIndex = currentIndex + totalOriginals;
        }

        if (targetIndex !== currentIndex) {
            goToSlide(targetIndex, false);
            void track.offsetHeight;
            track.classList.remove('no-transition');
        }
    });

    // Arrow Buttons Event Listeners with event propagation stop
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
                goToSlide(currentIndex + 1, true);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
                goToSlide(currentIndex - 1, true);
            }
        });
    }

    // Card click event listener
    allCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('card-link') && !isTransitioning) {
                goToSlide(index, true);
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) return;

            const matchIndex = originalCards.findIndex(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const text = card.querySelector('p').textContent.toLowerCase();
                return title.includes(query) || text.includes(query);
            });

            if (matchIndex !== -1 && !isTransitioning) {
                goToSlide(totalOriginals + matchIndex, true);
            }
        });
    }

    window.addEventListener('resize', () => goToSlide(currentIndex, false));

    // Initial display initialization
    requestAnimationFrame(() => {
        goToSlide(currentIndex, false);
        void track.offsetHeight;
        track.classList.remove('no-transition');
    });
});