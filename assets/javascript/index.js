import { loadSection } from './core/loader.js';
import { initTheme } from './core/theme.js';
import { translatePage, toggleLanguage } from './core/i18n.js';

async function initPortfolio() {
    const root = document.body;
    
    try {
        // 1. Charger le layout global
        const response = await fetch('html/layout.html');
        if (!response.ok) throw new Error("Impossible de charger le layout");
        const layout = await response.text();
        
        // 2. Injecter le layout
        root.innerHTML = layout;

        // 3. Initialiser le thème (doit être fait avant la traduction)
        initTheme(); 
        
        // 4. Traduire le layout (header, footer, navigation)
        translatePage(); 
        
        // 5. Configurer le bouton de langue
        setupLanguageToggle();

        // 6. Charger la section par défaut
        // Note: loadSection() appelle automatiquement translatePage() pour le contenu chargé
        await loadSection('presentation', 'app');
        
        // 7. Activer les écouteurs d'événements sur le menu
        setupMobileMenu();
        setupNavigation();

    } catch (error) {
        console.error("Erreur d'initialisation :", error);
        root.innerHTML = `<p style="color:white; padding:2rem;">Erreur critique au chargement : ${error.message}</p>`;
    }
}

function setupLanguageToggle() {
    const langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
        langToggle.addEventListener("click", () => {
            toggleLanguage();
        });
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-links a');

    if (!menuToggle || !navMenu) return;

    const updateIcon = (iconName) => {
        menuToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
        if (window.lucide) lucide.createIcons();
    };

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        const isOpened = navMenu.classList.contains('is-open');
        updateIcon(isOpened ? 'x' : 'menu');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                updateIcon('menu');
            }
        });
    });
}

function setupNavigation() {
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-link');
        
            loadSection(section, 'app');
            
            updateActiveNav(section);
        });
    });
}

/**
 * Met à jour visuellement le lien de navigation actif
 */
function updateActiveNav(sectionName) {
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
        if (link.getAttribute('data-link') === sectionName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', initPortfolio);