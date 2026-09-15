import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface UpdateLeadInput {
  name: string;
  whatsapp: string;
  model: string;
  unit: 'TERESINA' | 'TIMON';
  email?: string;
}

const MODEL_LABELS: Record<string, string> = {
  cg160: 'Honda CG 160',
  biz: 'Honda Biz 125',
  pop110: 'Honda Pop 110i',
  nxr160: 'Honda NXR 160 Bros',
  pcx: 'Honda PCX',
  cb300: 'Honda CB 300F',
  outro: 'Outro modelo',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Updates lead registration details in Firestore.
 */
export async function updateLead(leadId: string, input: UpdateLeadInput): Promise<void> {
  if (!leadId) {
    throw new Error('ID do lead não fornecido.');
  }

  const normalizedName = input.name.trim();
  const normalizedWhatsapp = input.whatsapp.trim();
  const rawDigits = normalizedWhatsapp.replace(/\D/g, '');
  const modelKey = input.model.toLowerCase().trim();
  const modelDisplay = MODEL_LABELS[modelKey] || input.model || 'Modelo não especificado';

  const leadRef = doc(db, 'leads', leadId);

  await updateDoc(leadRef, {
    name: normalizedName,
    initials: getInitials(normalizedName),
    whatsapp: normalizedWhatsapp,
    whatsappUrl: rawDigits ? `https://wa.me/55${rawDigits}` : '#',
    model: input.model,
    modelDisplay,
    unit: input.unit,
    email: (input.email || '').trim(),
  });
}
