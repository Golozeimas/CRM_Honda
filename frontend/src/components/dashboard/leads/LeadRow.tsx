import { useState } from 'react';
import type { Lead, LeadStatus } from '../../../types/auth';
import { LeadIdentity } from './LeadIdentity';
import { LeadStatus as LeadStatusBadge } from './LeadStatus';
import { LeadActions } from './LeadActions';

interface LeadRowProps {
  lead: Lead;
  isActionOpen: boolean;
  onToggleAction: () => void;
  onCloseAction: () => void;
  onViewDetails?: (lead: Lead) => void;
  onChangeStatus?: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
}

export function LeadRow({
  lead,
  isActionOpen,
  onToggleAction,
  onCloseAction,
  onViewDetails,
  onChangeStatus,
  onStatusChange,
  onEditLead,
  onDeleteLead,
}: LeadRowProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleTriggerChangeStatus = () => {
    setIsStatusDropdownOpen(true);
    onChangeStatus?.(lead);
  };

  return (
    <tr className="hover:bg-surface-container-low/70 transition-colors group">
      {/* Lead identity */}
      <td className="py-space-md px-space-md">
        <LeadIdentity
          initials={lead.initials}
          name={lead.name}
          email={lead.email}
          status={lead.status}
        />
      </td>

      {/* WhatsApp */}
      <td className="py-space-md px-space-sm font-label-md text-secondary">
        <a
          href={lead.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-tertiary flex items-center gap-1 transition-colors"
          aria-label={`Abrir WhatsApp de ${lead.name}: ${lead.whatsapp}`}
        >
          <span className="material-symbols-outlined text-[16px] text-tertiary" aria-hidden="true">chat</span>
          {lead.whatsapp}
        </a>
      </td>

      {/* Model */}
      <td className="py-space-md px-space-sm">
        <span className="inline-flex items-center px-space-sm py-0.5 rounded-md bg-inverse-surface text-inverse-on-surface font-label-sm font-semibold">
          {lead.modelDisplay}
        </span>
      </td>

      {/* Unit */}
      <td className="py-space-md px-space-sm font-label-md text-on-surface capitalize">
        {lead.unit === 'TERESINA' ? 'Teresina' : 'Timon'}
      </td>

      {/* Status */}
      <td className="py-space-md px-space-sm">
        <LeadStatusBadge
          leadId={lead.id}
          status={lead.status}
          isOpen={isStatusDropdownOpen}
          onToggleOpen={setIsStatusDropdownOpen}
          onStatusChange={onStatusChange}
        />
      </td>

      {/* Created at */}
      <td className="py-space-md px-space-sm font-body-sm text-secondary">
        {lead.createdAt}
      </td>

      {/* Actions */}
      <td className="py-space-md px-space-sm text-right">
        <LeadActions
          lead={lead}
          isOpen={isActionOpen}
          onToggle={onToggleAction}
          onClose={onCloseAction}
          onViewDetails={onViewDetails}
          onChangeStatus={handleTriggerChangeStatus}
          onEditLead={onEditLead}
          onDeleteLead={onDeleteLead}
        />
      </td>
    </tr>
  );
}
