/**
 * Firestore service foundation.
 * Lead CRUD operations will be implemented in subsequent tasks.
 *
 * Collection structure:
 *   leads/  — one document per lead
 */

import {
  collection,
  type CollectionReference,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import type { Lead } from '../../types/auth';

// Typed collection reference — ready for CRUD when needed
export const leadsCollection = collection(
  db,
  'leads'
) as CollectionReference<Lead, DocumentData>;
