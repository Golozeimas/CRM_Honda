import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Functions uses its runtime identity; never load a checked-in service account.
if (!getApps().length) initializeApp();
export const db = getFirestore();
