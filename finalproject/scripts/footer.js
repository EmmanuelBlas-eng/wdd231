// Dynamic Footer Data Configuration
const footerData = {
    col1: {
        title: "Explore Cagayan Valley",
        text: "Your portal to Region 2 tourism. Discover top attractions, vibrant culture, and authentic local experiences.",
        socials: [
            { name: "Facebook", href: "https://www.facebook.com/DOTRegion2", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.65 13.75 5.65c1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.77-1.61 1.56V12h2.74l-.44 3h-2.3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>` }
        ]
    },
    col2: {
        title: "Quick Navigation",
        links: [
            { text: "Home", href: "./index.html" },
            { text: "Provinces & Attractions", href: "./provinces.html" },
            { text: "Stay & Eat Directory", href: "./directory.html#eat-directory" },
            // { text: "Local Commodities", href: "#commodities" }
        ]
    },
    col3: {
        title: "Travel Support",
        contacts: [
            { icon: "📍", text: "Department of Tourism Region II, Philippines" },
            { icon: "✉️", text: "dot2@tourism.gov.ph", href: "mailto:dot2@tourism.gov.ph" },
            { icon: "📞", text: "+63 (78) 304-1505" }
        ]
    },
    col4: {
        title: "Stay Updated",
        text: "Subscribe to receive news, weather alerts, and festival updates."
    }
};

// Function to Render 4-Column Footer Dynamically
function renderDynamicFooter() {
    const container = document.getElementById('dynamic-footer-grid');
    if (!container) return;

    // Set Copyright Year Dynamically
    const yearElem = document.getElementById('footer-year');
    if (yearElem) yearElem.textContent = new Date().getFullYear();

    container.innerHTML = `
        <!-- Column 1: Brand & Socials -->
        <div class="footer-col">
            <h3>${footerData.col1.title}</h3>
            <p>${footerData.col1.text}</p>
            <div class="footer-social">
                ${footerData.col1.socials.map(s => `
                    <a href="${s.href}" aria-label="${s.name}" class="social-icon">${s.icon}</a>
                `).join('')}
            </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div class="footer-col">
            <h3>${footerData.col2.title}</h3>
            <ul>
                ${footerData.col2.links.map(link => `
                    <li><a href="${link.href}">${link.text}</a></li>
                `).join('')}
            </ul>
        </div>

        <!-- Column 3: Contact Info -->
        <div class="footer-col">
            <h3>${footerData.col3.title}</h3>
            ${footerData.col3.contacts.map(c => `
                <p>${c.icon}${c.href ? `<a href="${c.href}">${c.text}</a>` : c.text}</p>
            `).join('')}
        </div>

        <!-- Column 4: Dynamic Newsletter Form -->
        <div class="footer-col">
            <h3>${footerData.col4.title}</h3>
            <p>${footerData.col4.text}</p>
            <form class="footer-newsletter" id="footer-newsletter-form">
                <input type="email" id="newsletter-email" placeholder="Enter your email" required aria-label="Email address">
                <button type="submit" class="btn-newsletter">Subscribe</button>
                <span class="newsletter-msg" id="newsletter-msg" role="status" aria-live="polite">Thanks for subscribing!</span>
            </form>
        </div>
    `;

    // Interactive Event Listener for Subscription Form
    const form = document.getElementById('footer-newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = document.getElementById('newsletter-msg');
            const input = document.getElementById('newsletter-email');
            if (msg && input) {
                msg.classList.add('success');
                input.value = '';
                setTimeout(() => msg.classList.remove('success'), 4000);
            }
        });
    }
}

renderDynamicFooter();
