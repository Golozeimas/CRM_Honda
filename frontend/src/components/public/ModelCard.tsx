export interface ModelData {
  id: string;
  name: string;
  tag: string;
  badge: string;
  description: string;
  priceText: string;
}

interface ModelCardProps {
  model: ModelData;
  onSelect: (id: string) => void;
}

export function ModelCard({ model, onSelect }: ModelCardProps) {
  return (
    <div className="bg-surface rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="bg-[#1F2937] text-white text-[11px] font-bold px-2 py-0.5 rounded">{model.tag}</span>
          <span className="text-tertiary font-label-sm text-label-sm font-bold">{model.badge}</span>
        </div>
        <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{model.name}</h4>
        <p className="font-body-sm text-body-sm text-secondary mb-3">{model.description}</p>
      </div>
      <div className="pt-space-sm">
        <span className="block font-label-sm text-label-sm text-secondary">Parcelas a partir de</span>
        <span className="font-headline-md text-headline-md text-primary font-bold">{model.priceText}</span>
        <button 
          className="w-full mt-2 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" 
          onClick={() => onSelect(model.id)}
          type="button"
        >
          Simular esta moto
        </button>
      </div>
    </div>
  );
}
