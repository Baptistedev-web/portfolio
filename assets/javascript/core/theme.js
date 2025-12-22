/**
 * Initialise et gère le basculement de thème (Dark/Light)
 */
export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // 1. Vérifier s'il y a une préférence enregistrée ou utiliser le thème du système
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // 2. Appliquer le thème au démarrage
    applyTheme(savedTheme);

    // 3. Écouter le clic sur le bouton
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

function applyTheme(theme) {
    // Applique l'attribut sur la balise <html> pour que le CSS réagisse
    document.documentElement.setAttribute('data-theme', theme);
    // Sauvegarde pour la prochaine visite
    localStorage.setItem('theme', theme);
    
    // Mise à jour de l'icône Lucide
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // On remplace l'icône selon le thème
    const iconName = theme === 'dark' ? 'sun' : 'moon';
    themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
    
    // Re-rendre l'icône avec Lucide
    if (window.lucide) {
        lucide.createIcons();
    }
}