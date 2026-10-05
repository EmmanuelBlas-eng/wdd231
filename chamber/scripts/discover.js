import { itemsOfInterest } from "../data/discover.mjs";

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initFooter();
    handleVisitorMessage();
    renderDiscoverCards();
});

function renderDiscoverCards() {
    const container = document.querySelector(".discover-grid");
    if (!container) return;

    const fragment = document.createDocumentFragment();

    itemsOfInterest.forEach((item, index) => {
        const card = document.createElement("section");
        card.classList.add("discover-card", `card-${index + 1}`);

        // Set eager loading only for the 1st card to protect LCP speed
        const loadingAttr = 'loading="lazy"';

        card.innerHTML = `
            <h2>${item.title}</h2>
            <figure>
                <img src="${item.image}" alt="${item.title}" width="200" height="100" ${loadingAttr} decoding="async">
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button type="button" class="learn-more-btn">Learn More</button>
        `;

        fragment.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
}

function initNavigation() {
    const menuBtn = document.getElementById("hamburger-menu");
    const nav = document.getElementById("primary-nav");
    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuBtn.classList.toggle("open");
            const isOpen = nav.classList.contains("open");
            menuBtn.setAttribute("aria-expanded", isOpen);
            menuBtn.innerHTML = isOpen ? "&#10005;" : "&#9776;";
        });
    }
}

function initFooter() {
    const currentYearEl = document.getElementById("currentyear");
    const lastModifiedEl = document.getElementById("lastModified");
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;
}

function handleVisitorMessage() {
    const visitorMsgEl = document.getElementById("visitor-message");
    if (!visitorMsgEl) return;

    const msInDay = 86400000;
    const lastVisit = localStorage.getItem("lastVisitTimestamp");
    const now = Date.now();

    if (!lastVisit) {
        visitorMsgEl.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = now - parseInt(lastVisit, 10);
        if (timeDiff < msInDay) {
            visitorMsgEl.textContent = "Back so soon! Awesome!";
        } else {
            const days = Math.floor(timeDiff / msInDay);
            visitorMsgEl.textContent = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
        }
    }
    localStorage.setItem("lastVisitTimestamp", now.toString());
}