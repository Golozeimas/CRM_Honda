export interface UnitData {
  id: string;
  name: string;
  badge: string;
  address: string;
  schedule: string;
}

interface UnitCardProps {
  unit: UnitData;
  onSelect: (id: string) => void;
}

export function UnitCard({ unit, onSelect }: UnitCardProps) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{unit.name}</h3>
          <span className="bg-surface-container text-secondary text-[11px] font-bold px-2 py-0.5 rounded">{unit.badge}</span>
        </div>
        <p className="font-body-md text-body-md text-secondary flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span>
          <span>{unit.address}</span>
        </p>
        <p className="font-body-sm text-body-sm text-secondary flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
          <span>{unit.schedule}</span>
        </p>
      </div>
      <div className="pt-space-md flex gap-2">
        <button 
          className="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors text-center cursor-pointer" 
          onClick={() => onSelect(unit.id)}
          type="button"
        >
          Falar com {unit.name.split(' ')[1]}
        </button>
      </div>
    </div>
  );
}
