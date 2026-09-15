import type { Lead } from '../../types/auth';
import { MetricCard, type MetricCardProps } from './MetricCard';

interface MetricGridProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function MetricGrid({ leads, isLoading = false }: MetricGridProps) {
  const totalLeads = leads.length;
  const novos = leads.filter((lead) => lead.status === 'NOVO').length;
  const emContato = leads.filter((lead) => lead.status === 'EM_CONTATO').length;
  const convertidos = leads.filter((lead) => lead.status === 'CONVERTIDO').length;

  const totalProgress = totalLeads > 0 ? 100 : 0;
  const novosProgress = totalLeads > 0 ? Math.round((novos / totalLeads) * 100) : 0;
  const emContatoProgress = totalLeads > 0 ? Math.round((emContato / totalLeads) * 100) : 0;
  const convertidosProgress = totalLeads > 0 ? Math.round((convertidos / totalLeads) * 100) : 0;

  const metrics: MetricCardProps[] = [
    {
      title: 'Total de Leads',
      value: isLoading ? '...' : totalLeads,
      badge: `${totalLeads} no total`,
      icon: 'groups',
      progress: totalProgress,
      variant: 'default',
    },
    {
      title: 'Novos',
      value: isLoading ? '...' : novos,
      badge: 'Ação prioritária',
      icon: 'mark_email_unread',
      progress: novosProgress,
      variant: 'primary',
    },
    {
      title: 'Em Contato',
      value: isLoading ? '...' : emContato,
      badge: 'Em negociação',
      icon: 'phone_in_talk',
      progress: emContatoProgress,
      variant: 'secondary',
    },
    {
      title: 'Convertidos',
      value: isLoading ? '...' : convertidos,
      badge: '+ faturadas',
      icon: 'verified',
      progress: convertidosProgress,
      variant: 'tertiary',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
