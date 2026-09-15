import { addDoc, serverTimestamp, type FieldValue } from 'firebase/firestore';
import { leadsCollection } from '../firebase/firestore';
import type { Lead } from '../../types/auth';

export interface CreateLeadInput {
  name: string;
  phone: string;
  model: string;
  unit: string;
}

const MODEL_LABELS: Record<string, string> = {
  cg160: 'Honda CG 160',
  biz: 'Honda Biz',
  pop110: 'Honda Pop 110i',
  nxr160: 'Honda NXR 160 Bros',
  pcx: 'Honda PCX',
  cb300: 'Honda CB 300F',
  outro: 'Outro modelo'
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Ensure the payload matches the domain model, substituting the string timestamp with the Firestore serverTimestamp
type LeadCreateData = Omit<Lead, 'id' | 'createdAt'> & {
  createdAt: FieldValue;
};

export async function createLead(input: CreateLeadInput): Promise<string> {
  const normalizedName = input.name.trim();
  const normalizedPhone = input.phone.trim();
  const rawDigits = normalizedPhone.replace(/\D/g, '');
  
  const data: LeadCreateData = {
    name: normalizedName,
    initials: getInitials(normalizedName),
    email: '',
    whatsapp: normalizedPhone,
    whatsappUrl: `https://wa.me/55${rawDigits}`,
    model: input.model,
    modelDisplay: MODEL_LABELS[input.model] || 'Modelo não especificado',
    unit: input.unit.toUpperCase() as 'TERESINA' | 'TIMON',
    status: 'NOVO',
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(leadsCollection as any, data);
  return docRef.id;
}
