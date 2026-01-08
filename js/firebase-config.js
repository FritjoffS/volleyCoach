// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";

const firebaseConfig = {
  // DU MÅSTE FYLLA I DINA RIKTIGA FIREBASE-VÄRDEN HÄR
  // Gå till Firebase Console > Project Settings > General > Your apps
  // Välj din webbapp och kopiera config-objektet hit
    apiKey: "AIzaSyBafqkVIVo_n1IaWv4Dc5jUAUhBXy-k7Kg",
    authDomain: "volleycoach-be999.firebaseapp.com",
    databaseURL: "https://volleycoach-be999-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "volleycoach-be999",
    storageBucket: "volleycoach-be999.firebasestorage.app",
    messagingSenderId: "896479832137",
    appId: "1:896479832137:web:89fad4a971da9cd96cb798",
    measurementId: "G-FTRQQXMNZ0"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Initiera Analytics
let analytics = null;
try {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initierat');
} catch (error) {
  console.warn('⚠️ Analytics kunde inte initieras:', error);
}

// Exportera analytics och helper-funktioner
export { analytics };

// Helper-funktion för att logga events
export function trackEvent(eventName, params = {}) {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params);
    console.log('📊 Analytics event:', eventName, params);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Helper-funktion för att sätta användaregenskaper
export function setUserProperty(propertyName, value) {
  if (!analytics) return;
  try {
    setUserProperties(analytics, { [propertyName]: value });
    console.log('👤 User property set:', propertyName, value);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}
