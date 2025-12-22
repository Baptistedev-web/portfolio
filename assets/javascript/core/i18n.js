import { translations } from './translations.js';

let currentLang = localStorage.getItem("lang") || "fr";

/**
 * Récupère la langue actuelle
 */
export function getCurrentLanguage() {
    return currentLang;
}

/**
 * Récupère une traduction spécifique par clé
 * @param {string} key - Clé de traduction (ex: "contact.form.errors.name_required")
 * @returns {string} - Traduction ou clé si non trouvée
 */
export function getTranslation(key) {
    return getNestedTranslation(translations[currentLang], key) || key;
}

/**
 * Traduit toute la page actuelle
 */
export function translatePage() {
    // 1. Traduire les éléments textuels
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        const translation = getNestedTranslation(translations[currentLang], key);
        
        if (translation) {
            // Si le texte contient du HTML (ex: <span>), on utilise innerHTML
            if (translation.includes('<')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // 2. Traduire les attributs (comme aria-label)
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
        const [attr, key] = el.dataset.i18nAttr.split(':');
        const translation = getNestedTranslation(translations[currentLang], key);
        if (translation) {
            el.setAttribute(attr, translation);
        }
    });

    // 3. Traduire les placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const translation = getNestedTranslation(translations[currentLang], key);
        if (translation) {
            el.setAttribute('placeholder', translation);
        }
    });

    // 4. Mettre à jour la langue du document
    document.documentElement.lang = currentLang;
    
    // 5. Mettre à jour l'icône ou le texte du bouton
    updateLangButton();
}

/**
 * Bascule entre FR et EN
 */
export function toggleLanguage() {
    currentLang = currentLang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", currentLang);
    translatePage();
}

/**
 * Récupère une valeur imbriquée (ex: nav.presentation)
 */
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

/**
 * Met à jour l'apparence du bouton de langue
 */
function updateLangButton() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;

    // 1. Mise à jour de l'accessibilité (lecture d'écran)
    const nextLang = currentLang === 'fr' ? 'Anglais' : 'Français';
    btn.setAttribute('aria-label', `Passer en ${nextLang}`);

    // 2. On s'assure que l'icône est bien présente
    btn.innerHTML = `<i data-lucide="languages"></i>`;

    // 3. Demander à Lucide de transformer le <i> en <svg>
    if (window.lucide) {
        window.lucide.createIcons();
    }
}