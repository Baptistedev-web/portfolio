import { translatePage } from './i18n.js';

/**
 * Charge le contenu d'un fichier HTML dans un élément du DOM
 * @param {string} sectionName - Le nom de la section à charger
 * @param {string} targetId - L'ID de l'élément parent où injecter le code
 */
export async function loadSection(sectionName, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
        const response = await fetch(`html/sections/${sectionName}.html`);
        if (!response.ok) throw new Error(`Section ${sectionName} introuvable`);
        
        const html = await response.text();
        target.innerHTML = html;
        
        // 1. Recréer les icônes Lucide spécifiques à la section injectée
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // 2. IMPORTANT : Appliquer les traductions au nouveau contenu injecté
        translatePage();
        
        // 3. Initialiser les scripts spécifiques à la section
        await initSectionScripts(sectionName);
        
        // 4. Émettre l'événement pour d'autres scripts qui en ont besoin
        document.dispatchEvent(new CustomEvent('sectionLoaded', { detail: sectionName }));
        
    } catch (error) {
        target.innerHTML = `<div class="error">Impossible de charger la section "${sectionName}".</div>`;
    }
}

/**
 * Initialise les scripts spécifiques pour chaque section
 * @param {string} sectionName - Le nom de la section chargée
 */
async function initSectionScripts(sectionName) {
    switch (sectionName) {
        case 'contact':
            try {
                const { initContactForm } = await import('../sections/contact.js');
                initContactForm();
            } catch (error) {
            }
            break;
        
        case 'projects':
            try {
                const { initProjects } = await import('../sections/projects.js');
                if (typeof initProjects === 'function') {
                    initProjects();
                }
            } catch (error) {
            }
            break;
        
        case 'technical':
            try {
                const { initTechnical } = await import('../sections/technical.js');
                if (typeof initTechnical === 'function') {
                    initTechnical();
                }
            } catch (error) {
            }
            break;
        
        case 'presentation':
            try {
                const { initPresentation } = await import('../sections/presentation.js');
                if (typeof initPresentation === 'function') {
                    initPresentation();
                }
            } catch (error) {
            }
            break;
    }
}