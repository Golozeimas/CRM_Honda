import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { LeadStatus } from '../../types/auth';

/**
 * Updates the status of a lead in Firestore.
 * Performs a partial update to ensure no other lead properties are overwritten.
 *
 * @param leadId - The Firestore document ID of the lead.
 * @param status - The new status value from the domain model.
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  if (!leadId) {
    throw new Error('ID do lead não fornecido.');
  }

  const leadRef = doc(db, 'leads', leadId);
  await updateDoc(leadRef, {
    status,
  });
}
