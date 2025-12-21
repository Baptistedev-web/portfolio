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
        
        // 3. Émettre l'événement pour d'autres scripts qui en ont besoin
        document.dispatchEvent(new CustomEvent('sectionLoaded', { detail: sectionName }));
        
    } catch (error) {
        console.error("Erreur de chargement :", error);
        target.innerHTML = `<div class="error">Impossible de charger la section "${sectionName}".</div>`;
    }
}