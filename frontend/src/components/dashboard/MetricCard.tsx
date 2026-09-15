/** Visual variant controls icon bg, value color, badge color, and progress bar color */
export type MetricVariant = 'default' | 'primary' | 'secondary' | 'tertiary';

export interface MetricCardProps {
  title: string;
  value: string | number;
  badge: string;
  /** Material Symbol icon name */
  icon: string;
  /** Progress bar percentage, 0–100 */
  progress: number;
  variant?: MetricVariant;
}

const VARIANT_STYLES: Record<
  MetricVariant,
  {
    iconBg: string;
    iconText: string;
    valueCls: string;
    badgeCls: string;
    progressCls: string;
    badgeIcon?: string;
  }
> = {
  default: {
    iconBg: 'bg-surface-container',
    iconText: 'text-on-surface',
    valueCls: 'text-on-surface',
    badgeCls: 'text-tertiary bg-tertiary-fixed/30',
    progressCls: 'bg-on-surface',
    badgeIcon: 'trending_up',
  },
  primary: {
    iconBg: 'bg-primary-fixed',
    iconText: 'text-primary',
    valueCls: 'text-primary',
    badgeCls: 'text-primary bg-primary-fixed/40',
    progressCls: 'bg-primary-container',
  },
  secondary: {
    iconBg: 'bg-secondary-fixed',
    iconText: 'text-on-secondary-fixed',
    valueCls: 'text-on-surface',
    badgeCls: 'text-secondary bg-secondary-container',
    progressCls: 'bg-secondary',
  },
  tertiary: {
    iconBg: 'bg-tertiary-fixed',
    iconText: 'text-tertiary',
    valueCls: 'text-tertiary',
    badgeCls: 'text-tertiary bg-tertiary-fixed/40',
    progressCls: 'bg-tertiary-container',
  },
};

export function MetricCard({
  title,
  value,
  badge,
  icon,
  progress,
  variant = 'default',
}: MetricCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span className="font-label-md text-secondary uppercase font-semibold tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center ${styles.iconText}`}>
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{icon}</span>
        </div>
      </div>

      {/* Value + badge */}
      <div className="flex items-baseline justify-between mt-space-md">
        <span className={`font-headline-xl ${styles.valueCls} font-bold`}>{value}</span>
        <span className={`inline-flex items-center gap-1 font-label-sm ${styles.badgeCls} px-space-xs py-0.5 rounded-md font-semibold`}>
          {styles.badgeIcon && (
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
              {styles.badgeIcon}
            </span>
          )}
          {badge}
        </span>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-surface-container-high h-1 rounded-full mt-space-sm overflow-hidden">
        <div
          className={`${styles.progressCls} h-full rounded-full`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title}: ${progress}%`}
        />
      </div>
    </div>
  );
}
