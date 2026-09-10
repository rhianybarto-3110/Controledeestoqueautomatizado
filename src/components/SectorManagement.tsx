import React, { useState } from 'react';
import { Users, Plus, Edit3, Building, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Sector, StockMovement } from '../types';

interface SectorManagementProps {
  sectors: Sector[];
  movements: StockMovement[];
  onAddSector: () => void;
  onEditSector: (sector: Sector) => void;
  onSelectSectorMovements: (sectorId: string) => void;
}

export const SectorManagement: React.FC<SectorManagementProps> = ({
  sectors,
  movements,
  onAddSector,
  onEditSector,
  onSelectSectorMovements
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSectors = sectors.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.managerRegistration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Setores, Departamentos e Responsáveis
            </h2>
            <p className="text-xs text-slate-500">
              Mapeamento de centros de custo e responsáveis com matrícula para assinaturas formais
            </p>
          </div>
        </div>

        <button
          id="btn-new-sector"
          onClick={onAddSector}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Setor</span>
        </button>
      </div>

      {/* Grid de Cards dos Setores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sector) => {
          // Contagem de saídas destinadas a este setor
          const sectorMovements = movements.filter(m => m.type === 'SAIDA' && m.sectorId === sector.id);
          const totalDispatched = sectorMovements.reduce((acc, m) => acc + m.quantity, 0);

          return (
            <div
              key={sector.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{sector.name}</h3>
                      {sector.costCenter && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {sector.costCenter}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onEditSector(sector)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Editar responsável"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Responsável:</span>
                    <span className="font-semibold text-slate-900">{sector.managerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Matrícula Funcional:</span>
                    <span className="font-mono font-bold text-blue-700">{sector.managerRegistration}</span>
                  </div>
                </div>

                {sector.notes && (
                  <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-2">
                    {sector.notes}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-slate-500">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>{sectorMovements.length} saídas registradas</span>
                </div>
                <button
                  onClick={() => onSelectSectorMovements(sector.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Ver histórico
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
