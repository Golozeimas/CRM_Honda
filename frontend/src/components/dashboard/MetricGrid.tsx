import { MetricCard, type MetricCardProps } from './MetricCard';

const METRICS: MetricCardProps[] = [
  {
    title: 'Total de Leads',
    value: 128,
    badge: '+12% esta semana',
    icon: 'groups',
    progress: 78,
    variant: 'default',
  },
  {
    title: 'Novos',
    value: 42,
    badge: 'Ação prioritária',
    icon: 'mark_email_unread',
    progress: 52,
    variant: 'primary',
  },
  {
    title: 'Em Contato',
    value: 18,
    badge: 'Em negociação',
    icon: 'phone_in_talk',
    progress: 35,
    variant: 'secondary',
  },
  {
    title: 'Convertidos',
    value: 9,
    badge: '+4 faturadas',
    icon: 'verified',
    progress: 65,
    variant: 'tertiary',
  },
];

export function MetricGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {METRICS.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
