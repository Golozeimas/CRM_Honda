interface LeadsToolbarProps {
  search: string;
  statusFilter: string;
  unitFilter: string;
  modelFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

const SELECT_CLS =
  'w-full h-10 appearance-none bg-surface-container-low rounded-xl px-space-sm font-label-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary cursor-pointer';

const CHEVRON = (
  <span
    className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]"
    aria-hidden="true"
  >
    keyboard_arrow_down
  </span>
);

export function LeadsToolbar({
  search,
  statusFilter,
  unitFilter,
  modelFilter,
  onSearchChange,
  onStatusChange,
  onUnitChange,
  onModelChange,
}: LeadsToolbarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-space-sm items-center">
      {/* Search */}
      <div className="lg:col-span-4 relative">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]"
          aria-hidden="true"
        >
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome ou WhatsApp..."
          aria-label="Buscar leads por nome ou WhatsApp"
          className="w-full h-10 pl-10 pr-space-sm bg-surface-container-low rounded-xl text-on-surface font-body-sm placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {/* Status filter */}
      <div className="lg:col-span-3 relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filtrar por status"
          className={SELECT_CLS}
        >
          <option value="ALL">Todos os status</option>
          <option value="NOVO">Novo</option>
          <option value="EM_CONTATO">Em contato</option>
          <option value="CONVERTIDO">Convertido</option>
          <option value="PERDIDO">Perdido</option>
        </select>
        {CHEVRON}
      </div>

      {/* Unit filter */}
      <div className="lg:col-span-2 relative">
        <select
          value={unitFilter}
          onChange={(e) => onUnitChange(e.target.value)}
          aria-label="Filtrar por unidade"
          className={SELECT_CLS}
        >
          <option value="ALL">Todas as unidades</option>
          <option value="TERESINA">Teresina</option>
          <option value="TIMON">Timon</option>
        </select>
        {CHEVRON}
      </div>

      {/* Model filter */}
      <div className="lg:col-span-3 relative">
        <select
          value={modelFilter}
          onChange={(e) => onModelChange(e.target.value)}
          aria-label="Filtrar por modelo"
          className={`${SELECT_CLS} truncate`}
        >
          <option value="ALL">Todos os modelos</option>
          <option value="CG 160">Honda CG 160 Titan</option>
          <option value="BIZ">Honda Biz 125</option>
          <option value="POP">Honda Pop 110i</option>
          <option value="BROS">Honda NXR 160 Bros</option>
          <option value="TWISTER">Honda CB 300F Twister</option>
          <option value="PCX">Honda PCX</option>
          <option value="OUTRO">Outro modelo</option>
        </select>
        {CHEVRON}
      </div>
    </div>
  );
}
