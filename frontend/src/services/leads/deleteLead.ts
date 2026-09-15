import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Permanently deletes a lead document from Firestore.
 */
export async function deleteLead(leadId: string): Promise<void> {
  if (!leadId) {
    throw new Error('ID do lead não fornecido.');
  }

  const leadRef = doc(db, 'leads', leadId);
  await deleteDoc(leadRef);
}
