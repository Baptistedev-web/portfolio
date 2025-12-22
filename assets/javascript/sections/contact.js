/**
 * CONTACT FORM HANDLER
 * Gestion du formulaire de contact avec validation et envoi d'email
 * Utilise EmailJS pour l'envoi d'emails côté client
 */

// Import de la fonction de traduction depuis le système i18n centralisé
import { getTranslation } from '../core/i18n.js';

// Configuration EmailJS - VOS VRAIES CLÉS SONT DÉJÀ LÀ
const EMAIL_CONFIG = {
    PUBLIC_KEY: 'tTHdOOiAcUhWaTh8J', 
    SERVICE_ID: 'service_uwuflfg',
    TEMPLATE_ID: 'template_6ci8gif'
};

/**
 * Initialise le formulaire de contact
 */
export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    // Charger EmailJS
    loadEmailJS();

    // Écouteur de soumission
    form.addEventListener('submit', handleFormSubmit);

    // Validation en temps réel
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Réinitialisation des icônes Lucide si nécessaire
    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * Charge la bibliothèque EmailJS
 */
function loadEmailJS() {
    // Si déjà chargé, ne rien faire
    if (window.emailjs) {
        console.log('✅ EmailJS déjà chargé');
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
        emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    };
    document.head.appendChild(script);
}

/**
 * Gère la soumission du formulaire
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');

    // Validation complète
    if (!validateForm(form)) {
        showMessage(formMessage, 'error', getTranslation('contact.form.validation_error'));
        return;
    }

    // Vérification que EmailJS est chargé
    if (!window.emailjs) {
        showMessage(formMessage, 'error', 'Service d\'envoi non disponible. Veuillez réessayer dans quelques instants.');
        return;
    }

    // Désactivation du bouton et affichage du loader
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formMessage.classList.remove('show');

    try {
        // Récupération des données
        const formData = {
            from_name: form.name.value.trim(),
            from_email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        // Envoi via EmailJS
        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            formData
        );

        // Message de succès
        showMessage(formMessage, 'success', getTranslation('contact.form.success_message'));
        
        // Réinitialisation du formulaire
        form.reset();
        clearValidation(form);

        // Animation de succès
        celebrateSuccess();

    } catch (error) {
        // Message d'erreur détaillé
        let errorMessage = getTranslation('contact.form.error_message');
        
        if (error.text) {
            console.error('Détails de l\'erreur:', error.text);
            // Ajouter des détails spécifiques selon le type d'erreur
            if (error.text.includes('Invalid') || error.text.includes('template')) {
                errorMessage += ' (Configuration du service incorrecte)';
            }
        }
        
        showMessage(formMessage, 'error', errorMessage);
    } finally {
        // Réactivation du bouton
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/**
 * Valide l'ensemble du formulaire
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Valide un champ individuel
 */
function validateField(input) {
    const value = input.value.trim();
    const name = input.name;
    const errorSpan = document.querySelector(`[data-error="${name}"]`);

    let error = '';

    // Validation par type de champ
    switch (name) {
        case 'name':
            if (!value) {
                error = getTranslation('contact.form.errors.name_required');
            } else if (value.length < 2) {
                error = getTranslation('contact.form.errors.name_too_short');
            }
            break;

        case 'email':
            if (!value) {
                error = getTranslation('contact.form.errors.email_required');
            } else if (!isValidEmail(value)) {
                error = getTranslation('contact.form.errors.email_invalid');
            }
            break;

        case 'subject':
            if (!value) {
                error = getTranslation('contact.form.errors.subject_required');
            } else if (value.length < 3) {
                error = getTranslation('contact.form.errors.subject_too_short');
            }
            break;

        case 'message':
            if (!value) {
                error = getTranslation('contact.form.errors.message_required');
            } else if (value.length < 10) {
                error = getTranslation('contact.form.errors.message_too_short');
            }
            break;
    }

    // Affichage de l'erreur
    if (error) {
        input.classList.add('error');
        input.classList.remove('success');
        if (errorSpan) {
            errorSpan.textContent = error;
            errorSpan.classList.add('show');
        }
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorSpan) {
            errorSpan.classList.remove('show');
        }
        return true;
    }
}

/**
 * Valide le format d'un email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Efface la validation du formulaire
 */
function clearValidation(form) {
    const inputs = form.querySelectorAll('.form-input');
    const errors = form.querySelectorAll('.form-error');

    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });

    errors.forEach(error => {
        error.classList.remove('show');
    });
}

/**
 * Affiche un message de retour
 */
function showMessage(element, type, message) {
    if (!element) return;

    element.textContent = message;
    element.className = 'form-message show ' + type;

    // Auto-masquage après 7 secondes
    setTimeout(() => {
        element.classList.remove('show');
    }, 7000);
}

/**
 * Animation de célébration après envoi réussi
 */
function celebrateSuccess() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Animation simple de "pulse"
    form.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
}

/**
 * Style CSS pour l'animation pulse
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// Export pour utilisation externe si besoin
export { validateField, validateForm, isValidEmail };