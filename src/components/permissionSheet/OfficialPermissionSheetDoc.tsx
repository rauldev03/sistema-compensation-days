import React from 'react';
import { formatDateDisplay } from '../../utils/dateUtils';

export type SedeType =
  | 'FUNDO IV PALOS'
  | 'PLANTA IV PALOS'
  | 'PLANTA SECHIN FRESCO'
  | 'PLANTA SECHIN CONGELADO'
  | 'OFICINA CASMA'
  | 'OFICINA SECHIN'
  | 'OFICINA LIMA';

export type MotivoType = 'SALUD' | 'PERSONAL' | 'CAPACITACION' | 'ESTUDIOS' | 'OTROS';

export interface OfficialSheetData {
  id?: string;
  fechaEmision: string;
  sede: SedeType;
  tipoDocumento: string;
  numeroDocumento: string;
  apellidosNombres: string;
  condicionLaboral: 'OBRERO' | 'EMPLEADO';
  labor: string;
  responsableInmediato: string;
  tiempoSolicitado: string;
  motivo: MotivoType;
  motivoOtroEspecifique?: string;
  aprobadoPor: string;
  cargoAprobador: string;
  inicia: string;
  finaliza: string;
  diaRetorno: string;
  observaciones: string;
}

export const SEDES_LIST: SedeType[] = [
  'FUNDO IV PALOS',
  'PLANTA IV PALOS',
  'PLANTA SECHIN FRESCO',
  'PLANTA SECHIN CONGELADO',
  'OFICINA CASMA',
  'OFICINA SECHIN',
  'OFICINA LIMA'
];

interface OfficialPermissionSheetDocProps {
  data: OfficialSheetData;
  className?: string;
  isPrintable?: boolean;
  showRrhhSignature?: boolean;
}

export const OfficialPermissionSheetDoc: React.FC<OfficialPermissionSheetDocProps> = ({
  data,
  className = '',
  isPrintable = false,
  showRrhhSignature = true
}) => {
  return (
    <div
      className={`official-permission-doc ${isPrintable ? 'official-permission-doc-printable' : ''} ${className}`}
    >
      <table className="doc-table">
        <tbody>
          {/* 1. HEADER INSTITUCIONAL */}
          <tr>
            {/* LOGO CHAVIN */}
            <td className="doc-header-logo-cell" style={{ width: '22%', verticalAlign: 'middle' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="chavin-logo-title">
                  <span>Chav</span>
                  <span className="chavin-dot">í</span>
                  <span>n</span>
                </div>
                <div className="chavin-logo-subtitle">
                  Car. Carretera Casma - Huaraz<br />
                  Nro. S/N Monte Grande (Sector Sechín Alto)<br />
                  Ancash, Casma, Buena Vista Alta, Perú.
                </div>
              </div>
            </td>

            {/* TITULO DE LA HOJA */}
            <td style={{ width: '54%', textAlign: 'center', verticalAlign: 'middle', padding: '6px' }}>
              <div className="doc-title-main">
                AGRICOLA Y GANADERA CHAVIN DE HUANTAR S.A.
              </div>
              <div className="doc-title-docname">
                HOJA DE PERMISO DEL PERSONAL
              </div>
            </td>

            {/* METADATA OFICIAL */}
            <td style={{ width: '24%', padding: 0 }}>
              <table className="doc-meta-table">
                <tbody>
                  <tr>
                    <td><strong>Código:</strong> AGCH-R-RH-770-02</td>
                  </tr>
                  <tr>
                    <td><strong>Versión:</strong> 02</td>
                  </tr>
                  <tr>
                    <td><strong>Fecha Aprob.:</strong> 01/08/2025</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 2. FECHA DE EMISION */}
          <tr>
            <td colSpan={3} style={{ padding: '4px 8px', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                <span className="doc-label" style={{ minWidth: '60px' }}>FECHA:</span>
                <span className="doc-value">{formatDateDisplay(data.fechaEmision)}</span>
              </div>
            </td>
          </tr>

          {/* 3. SEDES */}
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '80px', fontWeight: 800, fontSize: '9px', background: '#fafafa' }}>
                      SEDE:
                    </td>
                    {SEDES_LIST.map((s) => (
                      <td key={s} style={{ fontSize: '7.5px', fontWeight: 800, padding: '3px 2px' }}>
                        {s}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ background: '#fafafa' }}></td>
                    {SEDES_LIST.map((s) => (
                      <td key={s} style={{ height: '18px', textAlign: 'center', fontSize: '11px', fontWeight: 900 }}>
                        {data.sede === s ? 'X' : ''}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 4. DATOS DEL TRABAJADOR */}
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa', textAlign: 'center' }}>
                    <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>TIPO DOCUMENTO</td>
                    <td style={{ width: '18%', fontSize: '8px', fontWeight: 800 }}>NUMERO DOCUMENTO</td>
                    <td style={{ width: '47%', fontSize: '8px', fontWeight: 800 }}>APELLIDOS Y NOMBRES</td>
                    <td style={{ width: '20%', fontSize: '8px', fontWeight: 800 }}>CONDICION LABORAL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '9.5px', height: '22px' }}>
                      {data.tipoDocumento || 'D.N.I.'}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '10px' }}>
                      {data.numeroDocumento || '-'}
                    </td>
                    <td style={{ paddingLeft: '8px', fontWeight: 800, fontSize: '10px' }}>
                      {data.apellidosNombres || '-'}
                    </td>
                    <td style={{ padding: 0 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <tbody>
                          <tr>
                            <td style={{ border: 'none', borderBottom: '1px solid #000', fontSize: '7.5px', fontWeight: 800, padding: '2px' }}>
                              OBRERO {data.condicionLaboral === 'OBRERO' ? ' [ X ]' : ' [   ]'}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: 'none', fontSize: '7.5px', fontWeight: 800, padding: '2px' }}>
                              EMPLEADO {data.condicionLaboral === 'EMPLEADO' ? ' [ X ]' : ' [   ]'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 5. LABOR Y RESPONSABLE INMEDIATO */}
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                      LABOR:
                    </td>
                    <td style={{ width: '35%', fontWeight: 700, fontSize: '9.5px' }}>
                      {data.labor || '-'}
                    </td>
                    <td style={{ width: '22%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                      RESPONSABLE INMEDIATO:
                    </td>
                    <td style={{ width: '28%', fontWeight: 700, fontSize: '9.5px' }}>
                      {data.responsableInmediato || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 6. TIEMPO SOLICITADO */}
          <tr>
            <td colSpan={3} style={{ padding: '4px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="doc-label" style={{ minWidth: '130px' }}>TIEMPO SOLICITADO:</span>
                <span className="doc-value" style={{ textTransform: 'uppercase' }}>{data.tiempoSolicitado || '-'}</span>
              </div>
            </td>
          </tr>

          {/* 7. MOTIVOS DEL PERMISO */}
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    <td style={{ width: '140px', fontWeight: 800, fontSize: '8.5px' }}>
                      PERMISO POR MOTIVOS DE:
                    </td>
                    <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>SALUD</td>
                    <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>PERSONAL</td>
                    <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>CAPACITACION</td>
                    <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>ESTUDIOS</td>
                    <td style={{ fontSize: '8px', fontWeight: 800 }}>OTROS (Especifique)</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ background: '#fafafa' }}></td>
                    <td style={{ height: '18px', fontWeight: 900, fontSize: '11px' }}>
                      {data.motivo === 'SALUD' ? 'X' : ''}
                    </td>
                    <td style={{ fontWeight: 900, fontSize: '11px' }}>
                      {data.motivo === 'PERSONAL' ? 'X' : ''}
                    </td>
                    <td style={{ fontWeight: 900, fontSize: '11px' }}>
                      {data.motivo === 'CAPACITACION' ? 'X' : ''}
                    </td>
                    <td style={{ fontWeight: 900, fontSize: '11px' }}>
                      {data.motivo === 'ESTUDIOS' ? 'X' : ''}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '9px', textAlign: 'left', paddingLeft: '6px' }}>
                      {data.motivo === 'OTROS' ? `[ X ] ${data.motivoOtroEspecifique || 'COMPENSACIÓN'}` : '[   ]'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 8. APROBADO POR Y CARGO */}
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                      APROBADO POR:
                    </td>
                    <td style={{ width: '45%', fontWeight: 700, fontSize: '9.5px' }}>
                      {data.aprobadoPor || '-'}
                    </td>
                    <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                      CARGO:
                    </td>
                    <td style={{ width: '25%', fontWeight: 700, fontSize: '9.5px' }}>
                      {data.cargoAprobador || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 9. INICIA Y FINALIZA */}
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                      INICIA:
                    </td>
                    <td style={{ width: '35%', fontWeight: 700, fontSize: '9.5px' }}>
                      {data.inicia ? formatDateDisplay(data.inicia) : '-'}
                    </td>
                    <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                      FINALIZA:
                    </td>
                    <td style={{ width: '35%', fontWeight: 700, fontSize: '9.5px' }}>
                      {data.finaliza ? formatDateDisplay(data.finaliza) : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 10. DIA DE RETORNO */}
          <tr>
            <td colSpan={3} style={{ padding: '4px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="doc-label" style={{ minWidth: '130px' }}>DIA DE RETORNO:</span>
                <span className="doc-value">{data.diaRetorno ? formatDateDisplay(data.diaRetorno) : '-'}</span>
              </div>
            </td>
          </tr>

          {/* 11. OBSERVACIONES */}
          <tr>
            <td colSpan={3} style={{ padding: '4px 8px', minHeight: '65px', verticalAlign: 'top' }}>
              <div className="doc-label" style={{ marginBottom: '2px' }}>OBSERVACIONES:</div>
              <div
                style={{
                  fontSize: '9.5px',
                  fontWeight: 600,
                  color: '#000000',
                  lineHeight: 1.35,
                  minHeight: '42px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {data.observaciones || '-'}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 12. FIRMAS INFERIORES */}
      <div className="doc-signatures-container">
        <div className="doc-signature-box">
          <div className="doc-signature-line" />
          <div className="doc-signature-label">TRABAJADOR</div>
        </div>

        <div className="doc-signature-box">
          <div className="doc-signature-line" />
          <div className="doc-signature-label">JEFE DE AREA</div>
        </div>

        <div className="doc-signature-box doc-signature-box-rrhh">
          {showRrhhSignature && (
            <div className="doc-signature-img-wrapper">
              <img
                src="/firma-jefe-rrhh.png"
                alt="Firma Jefe de RRHH"
                className="doc-signature-img"
              />
            </div>
          )}
          <div className="doc-signature-line" />
          <div className="doc-signature-label">JEFE DE RRHH</div>
        </div>

        <div className="doc-signature-box">
          <div className="doc-signature-line" />
          <div className="doc-signature-label">GERENCIA DE OPER.</div>
        </div>

        <div className="doc-signature-box">
          <div className="doc-signature-line" />
          <div className="doc-signature-label">GERENCIA GENERAL</div>
        </div>
      </div>
    </div>
  );
};
