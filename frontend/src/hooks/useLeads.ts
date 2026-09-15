import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Lead, LeadStatus } from '../types/auth';
import { leadsCollection } from '../services/firebase/firestore';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeStatus(rawStatus?: unknown): LeadStatus {
  if (typeof rawStatus === 'string') {
    const upper = rawStatus.toUpperCase().trim();
    if (upper === 'NOVO' || upper === 'EM_CONTATO' || upper === 'CONVERTIDO' || upper === 'PERDIDO') {
      return upper;
    }
  }
  return 'NOVO';
}

const MODEL_DISPLAY_FALLBACK: Record<string, string> = {
  cg160: 'Honda CG 160',
  biz: 'Honda Biz 125',
  pop110: 'Honda Pop 110i',
  nxr160: 'Honda NXR 160 Bros',
  pcx: 'Honda PCX',
  cb300: 'Honda CB 300F',
  outro: 'Outro modelo',
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(leadsCollection as any, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedLeads: Lead[] = snapshot.docs.map((doc) => {
          const data: any = doc.data() || {};
          let createdAtStr = '';
          if (data.createdAt) {
            try {
              const date = typeof data.createdAt.toDate === 'function' 
                ? data.createdAt.toDate() 
                : new Date(data.createdAt);
              if (!isNaN(date.getTime())) {
                createdAtStr = new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(date);
              }
            } catch {
              createdAtStr = String(data.createdAt || '');
            }
          }

          const name = String(data.name || 'Sem nome');
          const initials = typeof data.initials === 'string' && data.initials ? data.initials : getInitials(name);
          const status = normalizeStatus(data.status);
          const unit = (data.unit && String(data.unit).toUpperCase() === 'TIMON') ? 'TIMON' : 'TERESINA';
          const whatsapp = String(data.whatsapp || data.phone || '');
          const rawDigits = whatsapp.replace(/\D/g, '');
          const whatsappUrl = data.whatsappUrl || (rawDigits ? `https://wa.me/55${rawDigits}` : '#');
          const model = String(data.model || 'outro');
          const normalizedModelKey = model.toLowerCase().trim();
          const modelDisplay = String(
            data.modelDisplay ||
            MODEL_DISPLAY_FALLBACK[normalizedModelKey] ||
            data.model ||
            'Modelo não especificado'
          );
          const email = String(data.email || '');

          return {
            id: doc.id,
            name,
            initials,
            email,
            whatsapp,
            whatsappUrl,
            model,
            modelDisplay,
            unit,
            status,
            createdAt: createdAtStr,
          };
        });

        setLeads(fetchedLeads);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching leads:', err);
        setError('Não foi possível carregar os leads.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { leads, isLoading, error };
}
