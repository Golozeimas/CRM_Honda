// Re-export from the canonical Firebase config to prevent duplicate initializeApp() calls.
// The app was previously initializing Firebase twice, causing a runtime crash.
export { auth } from '../services/firebase/config';