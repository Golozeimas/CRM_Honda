import type { Lead } from '../../types/auth';

const HEADERS = [
  'ID',
  'Nome',
  'WhatsApp',
  'Link WhatsApp',
  'E-mail',
  'Modelo de Interesse',
  'Concessionária / Unidade',
  'Status do Atendimento',
  'Data de Cadastro',
];

function escapeCsvField(value: string | null | undefined): string {
  const text = String(value ?? '');
  return /[;"\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function formatCreatedAt(value: string): string {
  return value.replace(/^(\d{2}\/\d{2}\/\d{4}),?\s+(\d{2}:\d{2})$/, '$1 $2');
}

export function exportLeadsToCsv(leads: Lead[]): void {
  if (leads.length === 0) return;

  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.whatsapp,
    lead.whatsappUrl,
    lead.email,
    lead.modelDisplay ?? lead.model,
    lead.unit,
    lead.status,
    formatCreatedAt(lead.createdAt ?? ''),
  ]);
  const csv = '\uFEFF' + [HEADERS, ...rows]
    .map((row) => row.map(escapeCsvField).join(';'))
    .join('\r\n');

  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const filename = `leads_sol_nascente_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}.csv`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
