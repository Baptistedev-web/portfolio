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
        if (window.lucide) {
            window.lucide.createIcons();
        }
        translatePage();
        await initSectionScripts(sectionName);
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
    }
}