export function initMobileNavigation() {
    const menuButton = document.getElementById('hamburger-menu');
    const primaryNav = document.getElementById('primary-nav');

    if (!menuButton || !primaryNav) return;

    const closeMenu = () => {
        menuButton.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('open');
    };

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isExpanded));
        primaryNav.classList.toggle('open', !isExpanded);
    });

    primaryNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });
}