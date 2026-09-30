document.addEventListener("DOMContentLoaded", () => {
    // 1. Navigation Hamburger Menu Toggle
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

    // 2. Footer Dates
    const currentYearEl = document.getElementById("currentyear");
    const lastModifiedEl = document.getElementById("lastModified");

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    if (lastModifiedEl) {
        lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;
    }

    // 3. Parse GET parameters from URL
    const resultsContainer = document.getElementById("results");
    const currentUrl = window.location.href;

    if (currentUrl.includes("?")) {
        const formData = currentUrl.split("?")[1].split("&");

        function show(key) {
            let result = "";
            formData.forEach(element => {
                if (element.startsWith(key + "=")) {
                    result = decodeURIComponent(element.split("=")[1].replace(/\+/g, " "));
                }
            });
            return result;
        }

        const fname = show("fname");
        const lname = show("lname");
        const email = show("email");
        const phone = show("phone");
        const organization = show("organization");
        const timestampRaw = show("timestamp");

        // Format Date/Time cleanly
        let formattedDate = timestampRaw;
        if (timestampRaw) {
            const parsedDate = new Date(timestampRaw);
            if (!isNaN(parsedDate)) {
                formattedDate = parsedDate.toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short"
                });
            }
        }

        resultsContainer.innerHTML = `
            <div class="results-row">
                <span class="results-label">First Name:</span>
                <span class="results-value">${fname || "N/A"}</span>
            </div>
            <div class="results-row">
                <span class="results-label">Last Name:</span>
                <span class="results-value">${lname || "N/A"}</span>
            </div>
            <div class="results-row">
                <span class="results-label">Email Address:</span>
                <span class="results-value">${email || "N/A"}</span>
            </div>
            <div class="results-row">
                <span class="results-label">Mobile Phone:</span>
                <span class="results-value">${phone || "N/A"}</span>
            </div>
            <div class="results-row">
                <span class="results-label">Business / Organization:</span>
                <span class="results-value">${organization || "N/A"}</span>
            </div>
            <div class="results-row">
                <span class="results-label">Date Submitted:</span>
                <span class="results-value">${formattedDate || "N/A"}</span>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = "<p>No form submission data found.</p>";
    }
});