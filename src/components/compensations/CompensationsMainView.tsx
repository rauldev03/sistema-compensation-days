import React, { useState } from 'react';
import { Layers, ChevronDown, PlusCircle, Upload, UserCheck, CalendarDays, ListFilter } from 'lucide-react';
import { WorkerCompensationPanel } from './WorkerCompensationPanel';
import { GlobalCompensationList } from './GlobalCompensationList';
import { CompensationByDatePanel } from './CompensationByDatePanel';
import { RegisterPendingDayModal } from './RegisterPendingDayModal';
import { DataManagementModal } from '../common/DataManagementModal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const CompensationsMainView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'worker' | 'global' | 'bydate'>('worker');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const { triggerRefresh } = useApp();

  return (
    <div className="flex flex-col gap-2.5">
      {/* Sub navigation bar with view selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        {/* Selector de Panel / Vista */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label
            htmlFor="view-panel-select"
            style={{
              fontSize: '0.775rem',
              fontWeight: 700,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            <Layers size={15} style={{ color: '#2563eb' }} />
            Vista / Panel de Gestión:
          </label>

          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: '10px', pointerEvents: 'none', display: 'flex', color: '#2563eb' }}>
              {activeSubTab === 'worker' && <UserCheck size={15} />}
              {activeSubTab === 'bydate' && <CalendarDays size={15} />}
              {activeSubTab === 'global' && <ListFilter size={15} />}
            </div>

            <select
              id="view-panel-select"
              value={activeSubTab}
              onChange={(e) => setActiveSubTab(e.target.value as 'worker' | 'global' | 'bydate')}
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#1e40af',
                background: '#eff6ff',
                border: '1.5px solid #93c5fd',
                borderRadius: '8px',
                padding: '0.35rem 2.25rem 0.35rem 2.2rem',
                cursor: 'pointer',
                appearance: 'none',
                boxShadow: '0 1px 2px rgba(37, 99, 235, 0.08)',
                outline: 'none',
                minWidth: '260px',
                transition: 'all 0.15s ease'
              }}
            >
              <option value="worker">1. Por Trabajador (Control 1 a 1)</option>
              <option value="bydate">2. Por Fecha (Compensación / Jornada)</option>
              <option value="global">3. Historial Global de Registros</option>
            </select>

            <ChevronDown
              size={15}
              style={{
                position: 'absolute',
                right: '10px',
                pointerEvents: 'none',
                color: '#2563eb'
              }}
            />
          </div>
        </div>

        {/* Botones de acción principales */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDataModalOpen(true)}
            icon={<Upload size={13} />}
          >
            Carga Masiva (Excel)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            icon={<PlusCircle size={14} />}
          >
            + Generar Día Trabajado
          </Button>
        </div>
      </div>

      {/* SubTab Views */}
      {activeSubTab === 'worker' && <WorkerCompensationPanel />}
      {activeSubTab === 'bydate' && <CompensationByDatePanel />}
      {activeSubTab === 'global' && <GlobalCompensationList />}

      {/* Global Register Modal */}
      <RegisterPendingDayModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => triggerRefresh()}
      />

      {/* Data Management & Bulk Import Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
};
