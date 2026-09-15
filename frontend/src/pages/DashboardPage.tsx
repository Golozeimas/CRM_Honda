import { AppLayout } from '../components/layout/AppLayout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MetricGrid } from '../components/dashboard/MetricGrid';
import { LeadsSection } from '../components/dashboard/leads/LeadsSection';

export function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col w-full gap-space-lg">
        <DashboardHeader />
        <MetricGrid />
        <LeadsSection />
      </div>
    </AppLayout>
  );
}

