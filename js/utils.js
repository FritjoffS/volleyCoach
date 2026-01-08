// utils.js - Hjälpfunktioner för validering, dialoger och notifikationer

// ===== VALIDERING =====

/**
 * Validerar lagnamn
 * @param {string} name - Lagnamn att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validateTeamName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Lagnamn får inte vara tomt' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Lagnamn får max vara 100 tecken' };
  }
  return { valid: true };
}

/**
 * Validerar spelarnamn
 * @param {string} name - Spelarnamn att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validatePlayerName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Spelarnamn får inte vara tomt' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Spelarnamn får max vara 100 tecken' };
  }
  return { valid: true };
}

/**
 * Validerar tröjnummer
 * @param {string|number} number - Tröjnummer att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validatePlayerNumber(number) {
  if (!number) {
    return { valid: true }; // Frivilligt fält
  }
  const num = parseInt(number, 10);
  if (isNaN(num)) {
    return { valid: false, error: 'Tröjnummer måste vara ett nummer' };
  }
  if (num < 0 || num > 99) {
    return { valid: false, error: 'Tröjnummer måste vara mellan 0 och 99' };
  }
  return { valid: true };
}

/**
 * Validerar e-postadress
 * @param {string} email - E-post att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email) {
    return { valid: true }; // Frivilligt fält
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Ogiltig e-postadress' };
  }
  return { valid: true };
}

/**
 * Validerar telefonnummer (svenskt format)
 * @param {string} phone - Telefonnummer att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validatePhone(phone) {
  if (!phone) {
    return { valid: true }; // Frivilligt fält
  }
  // Acceptera svenska telefonnummer i olika format
  const phoneRegex = /^(\+46|0)[1-9]\d{1,3}[-\s]?\d{5,8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Ogiltigt telefonnummer' };
  }
  return { valid: true };
}

/**
 * Validerar kontaktinfo (e-post eller telefon)
 * @param {string} contact - Kontaktinfo att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validateContact(contact) {
  if (!contact || contact.trim().length === 0) {
    return { valid: true }; // Frivilligt fält
  }
  
  // Testa om det är e-post eller telefon
  const emailResult = validateEmail(contact);
  const phoneResult = validatePhone(contact);
  
  if (emailResult.valid || phoneResult.valid) {
    return { valid: true };
  }
  
  return { valid: false, error: 'Ange en giltig e-postadress eller ett giltigt telefonnummer' };
}

/**
 * Validerar datum (YYYY-MM-DD)
 * @param {string} date - Datum att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validateDate(date) {
  if (!date || date.trim().length === 0) {
    return { valid: false, error: 'Datum får inte vara tomt' };
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { valid: false, error: 'Ogiltigt datumformat (använd ÅÅÅÅ-MM-DD)' };
  }
  
  // Kontrollera att det är ett giltigt datum
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Ogiltigt datum' };
  }
  
  return { valid: true };
}

/**
 * Validerar tid (HH:MM)
 * @param {string} time - Tid att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validateTime(time) {
  if (!time) {
    return { valid: true }; // Frivilligt fält
  }
  
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return { valid: false, error: 'Ogiltigt tidsformat (använd HH:MM)' };
  }
  
  return { valid: true };
}

/**
 * Validerar motståndarnamn
 * @param {string} opponent - Motståndarnamn att validera
 * @returns {object} { valid: boolean, error: string }
 */
export function validateOpponent(opponent) {
  if (!opponent || opponent.trim().length === 0) {
    return { valid: false, error: 'Motståndarnamn får inte vara tomt' };
  }
  if (opponent.trim().length > 100) {
    return { valid: false, error: 'Motståndarnamn får max vara 100 tecken' };
  }
  return { valid: true };
}

// ===== DIALOGER OCH BEKRÄFTELSER =====

/**
 * Visar en bekräftelsedialog med anpassat utseende
 * @param {string} message - Meddelande att visa
 * @param {string} confirmText - Text på bekräfta-knappen (standard: "Ja")
 * @param {string} cancelText - Text på avbryt-knappen (standard: "Avbryt")
 * @returns {Promise<boolean>} - true om användaren bekräftar, annars false
 */
export function confirmDialog(message, confirmText = 'Ja', cancelText = 'Avbryt') {
  return new Promise((resolve) => {
    // Skapa overlay
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    // Skapa dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    
    // Meddelande
    const messageEl = document.createElement('p');
    messageEl.className = 'confirm-message';
    messageEl.textContent = message;
    
    // Knappar
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'confirm-buttons';
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'confirm-btn-yes';
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'confirm-btn-no';
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };
    
    buttonsDiv.appendChild(cancelBtn);
    buttonsDiv.appendChild(confirmBtn);
    
    dialog.appendChild(messageEl);
    dialog.appendChild(buttonsDiv);
    overlay.appendChild(dialog);
    
    document.body.appendChild(overlay);
    
    // Fokusera på bekräfta-knappen
    confirmBtn.focus();
  });
}

/**
 * Visar en bekräftelsedialog för radering
 * @param {string} itemType - Typ av objekt (t.ex. "lag", "spelare", "match")
 * @param {string} itemName - Namn på objektet
 * @returns {Promise<boolean>} - true om användaren bekräftar, annars false
 */
export function confirmDelete(itemType, itemName) {
  const message = `Är du säker på att du vill ta bort ${itemType} "${itemName}"?\n\nDetta kan inte ångras.`;
  return confirmDialog(message, 'Ta bort', 'Avbryt');
}

// ===== TOAST-NOTIFIKATIONER =====

let toastQueue = [];
let isShowingToast = false;

/**
 * Visar en toast-notifikation
 * @param {string} message - Meddelande att visa
 * @param {string} type - Typ av notifikation ('success', 'error', 'info', 'warning')
 * @param {number} duration - Hur länge toast ska visas (ms, standard: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  toastQueue.push({ message, type, duration });
  if (!isShowingToast) {
    displayNextToast();
  }
}

function displayNextToast() {
  if (toastQueue.length === 0) {
    isShowingToast = false;
    return;
  }
  
  isShowingToast = true;
  const { message, type, duration } = toastQueue.shift();
  
  // Skapa toast-element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Lägg till ikon baserat på typ
  const icon = getToastIcon(type);
  const iconEl = document.createElement('span');
  iconEl.className = 'toast-icon';
  iconEl.textContent = icon;
  
  const messageEl = document.createElement('span');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;
  
  toast.appendChild(iconEl);
  toast.appendChild(messageEl);
  
  // Lägg till i DOM
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  container.appendChild(toast);
  
  // Animera in
  setTimeout(() => toast.classList.add('toast-show'), 10);
  
  // Ta bort efter viss tid
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
      displayNextToast();
    }, 300);
  }, duration);
}

function getToastIcon(type) {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

/**
 * Visar en success-toast
 * @param {string} message - Meddelande att visa
 */
export function showSuccess(message) {
  showToast(message, 'success', 3000);
}

/**
 * Visar en error-toast
 * @param {string} message - Meddelande att visa
 */
export function showErrorToast(message) {
  showToast(message, 'error', 4000);
}

/**
 * Visar en info-toast
 * @param {string} message - Meddelande att visa
 */
export function showInfo(message) {
  showToast(message, 'info', 3000);
}

/**
 * Visar en warning-toast
 * @param {string} message - Meddelande att visa
 */
export function showWarning(message) {
  showToast(message, 'warning', 3500);
}

// ===== ÖVRIGA HJÄLPFUNKTIONER =====

/**
 * Hanterar fel och visar lämpligt meddelande
 * @param {Error} error - Fel-objekt
 * @param {string} context - Kontext där felet inträffade
 */
export function handleError(error, context = '') {
  console.error(`Fel ${context}:`, error);
  
  let message = 'Ett oväntat fel uppstod';
  
  if (error.code === 'PERMISSION_DENIED') {
    message = 'Du har inte behörighet att utföra denna åtgärd';
  } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
    message = 'Nätverksfel. Kontrollera din internetanslutning';
  } else if (error.message) {
    message = error.message;
  }
  
  if (context) {
    message += ` (${context})`;
  }
  
  showErrorToast(message);
}

/**
 * Saniterar input för att förhindra XSS
 * @param {string} str - Sträng att sanitera
 * @returns {string} - Saniterad sträng
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => (map[match]));
}
