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

    // 3. Set ISO Timestamp into hidden form input
    const timestampInput = document.getElementById("timestamp");
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }

    // 4. Modal Dialog Handlers
    const openButtons = document.querySelectorAll(".modal-open-btn");
    const closeButtons = document.querySelectorAll(".modal-close-btn");

    openButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest("dialog");
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking on backdrop
    const dialogs = document.querySelectorAll("dialog");
    dialogs.forEach(dialog => {
        dialog.addEventListener("click", (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                dialog.close();
            }
        });
    });
});