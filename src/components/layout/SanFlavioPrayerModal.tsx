import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, HeartHandshake } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';

interface SanFlavioPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRAYER_TEXT = `El Padre Sueldo

Patrón nuestro que estás en Planillas,
santificado sea nuestro aumento.
Venga a nosotros la remuneración,
hágase el depósito en nuestra cuenta
así en quincena como a fin de mes.

Danos hoy nuestro sueldo de cada mes,
perdona nuestras tardanzas,
así como nosotros perdonamos
los descuentos injustificados.

No nos dejes caer en horas extras sin pago
y líbranos del sueldo mínimo.

Amén… y que llegue la gratificación. 🙏✨`;

export const SanFlavioPrayerModal: React.FC<SanFlavioPrayerModalProps> = ({ isOpen, onClose }) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PRAYER_TEXT);
    setCopied(true);
    success('¡Oración copiada al portapapeles! Que San Flavio escuche tus peticiones.', 'Oración Copiada 🙏');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '540px',
          background: 'linear-gradient(165deg, #0f172a 0%, #1e1b4b 50%, #090d16 100%)',
          border: '2px solid rgba(234, 179, 8, 0.5)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(234, 179, 8, 0.25)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.875rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)',
            borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: '#fbbf24' }} />
            <div>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#fbbf24',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: 0
                }}
              >
                Santoral de Planillas
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
                Devocionario Oficial a San Flavio
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#94a3b8',
              padding: '0.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body / Prayer Content */}
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            maxHeight: '78vh',
            overflowY: 'auto'
          }}
        >
          {/* San Flavio Image with Golden Halo */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0.5rem'
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(234, 179, 8, 0.35) 0%, rgba(234, 179, 8, 0) 70%)',
                filter: 'blur(10px)',
                zIndex: 0
              }}
            />
            <img
              src="/san-flavio.png"
              alt="San Flavio"
              style={{
                maxHeight: '210px',
                width: 'auto',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 15px rgba(234, 179, 8, 0.3))',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Prayer Title Card */}
          <div
            style={{
              textAlign: 'center',
              borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
              paddingBottom: '0.5rem',
              width: '100%'
            }}
          >
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#fef08a',
                letterSpacing: '0.05em',
                textShadow: '0 2px 10px rgba(234, 179, 8, 0.4)',
                margin: 0
              }}
            >
              El Padre Sueldo
            </h2>
            <span
              style={{
                fontSize: '0.725rem',
                color: '#fbbf24',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginTop: '0.2rem',
                display: 'block'
              }}
            >
              Oración del Trabajador Compensado
            </span>
          </div>

          {/* Stanzas */}
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '0.925rem',
              lineHeight: 1.65,
              color: '#f1f5f9',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              width: '100%',
              boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic' }}>
              Patrón nuestro que estás en Planillas,<br />
              santificado sea nuestro aumento.<br />
              Venga a nosotros la remuneración,<br />
              hágase el depósito en nuestra cuenta<br />
              así en quincena como a fin de mes.
            </p>

            <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic' }}>
              Danos hoy nuestro sueldo de cada mes,<br />
              perdona nuestras tardanzas,<br />
              así como nosotros perdonamos<br />
              los descuentos injustificados.
            </p>

            <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic' }}>
              No nos dejes caer en horas extras sin pago<br />
              y líbranos del sueldo mínimo.
            </p>

            <p
              style={{
                margin: '0',
                fontWeight: 700,
                color: '#fbbf24',
                fontSize: '1rem',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Amén… y que llegue la gratificación. 🙏✨
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(234, 179, 8, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            style={{
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            {copied ? '¡Copiado!' : 'Copiar Oración'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            icon={<HeartHandshake size={14} />}
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              borderColor: '#f59e0b',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)',
              fontWeight: 700
            }}
          >
            Amén 🙏
          </Button>
        </div>
      </div>
    </div>
  );
};
