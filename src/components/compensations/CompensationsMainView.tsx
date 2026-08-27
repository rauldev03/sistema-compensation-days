import React, { useState } from 'react';
import { UserCheck, ListFilter, PlusCircle, Upload, CalendarDays } from 'lucide-react';
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
    <div className="flex flex-col gap-4">
      {/* Sub navigation tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${activeSubTab === 'worker' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('worker')}
            style={{ fontSize: '0.875rem' }}
          >
            <UserCheck size={16} />
            Por Trabajador
          </button>

          <button
            type="button"
            className={`btn ${activeSubTab === 'bydate' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('bydate')}
            style={{ fontSize: '0.875rem' }}
          >
            <CalendarDays size={16} />
            Por Fecha (Compensación / Jornada)
          </button>

          <button
            type="button"
            className={`btn ${activeSubTab === 'global' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('global')}
            style={{ fontSize: '0.875rem' }}
          >
            <ListFilter size={16} />
            Historial Global
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDataModalOpen(true)}
            icon={<Upload size={14} />}
          >
            Carga Masiva (Excel)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            icon={<PlusCircle size={15} />}
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
