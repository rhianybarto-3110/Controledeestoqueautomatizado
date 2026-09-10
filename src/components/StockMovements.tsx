import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowDownRight, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Calendar, 
  FileText,
  Building,
  Truck,
  Plus
} from 'lucide-react';
import { StockMovement, MovementType, Requisition } from '../types';
import { formatCurrency, formatDateBR } from '../utils/storage';

interface StockMovementsProps {
  movements: StockMovement[];
  requisitions: Requisition[];
  onOpenMovementModal: (type?: MovementType) => void;
  onViewRequisition: (req: Requisition) => void;
  initialSectorFilter?: string;
}

export const StockMovements: React.FC<StockMovementsProps> = ({
  movements,
  requisitions,
  onOpenMovementModal,
  onViewRequisition,
  initialSectorFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'TODOS' | MovementType>('TODOS');
  const [selectedSector, setSelectedSector] = useState<string>(initialSectorFilter || 'TODOS');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredMovements = movements.filter(m => {
    const matchesSearch = 
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.supplier && m.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.sectorName && m.sectorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.reason && m.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.invoiceNumber && m.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.requisitionNumber && m.requisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'TODOS' || m.type === selectedType;
    const matchesSector = selectedSector === 'TODOS' || m.sectorId === selectedSector;

    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && m.date >= startDate;
    }
    if (endDate) {
      matchesDate = matchesDate && m.date <= `${endDate}T23:59`;
    }

    return matchesSearch && matchesType && matchesSector && matchesDate;
  });

  const totalEntradas = movements.filter(m => m.type === 'ENTRADA').length;
  const totalSaidas = movements.filter(m => m.type === 'SAIDA').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Controle e Rastreabilidade de Movimentações
            </h2>
            <p className="text-xs text-slate-500">
              Histórico cronológico de entradas de compras e saídas para manufatura com saldo instantâneo
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-new-entry"
            onClick={() => onOpenMovementModal('ENTRADA')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Registrar Entrada (Compra)</span>
          </button>

          <button
            id="btn-new-exit"
            onClick={() => onOpenMovementModal('SAIDA')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Registrar Saída (Setor)</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por produto, fornecedor, setor, NF ou motivo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Toggle Tipo */}
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setSelectedType('TODOS')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  selectedType === 'TODOS' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                }`}
              >
                Todas ({movements.length})
              </button>
              <button
                onClick={() => setSelectedType('ENTRADA')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  selectedType === 'ENTRADA' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'
                }`}
              >
                Entradas ({totalEntradas})
              </button>
              <button
                onClick={() => setSelectedType('SAIDA')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  selectedType === 'SAIDA' ? 'bg-amber-100 text-amber-800' : 'text-slate-500'
                }`}
              >
                Saídas ({totalSaidas})
              </button>
            </div>

            {/* Filtro de Período */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-500">De:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded-md text-xs outline-none bg-white"
              />
              <span className="text-slate-500">Até:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded-md text-xs outline-none bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-3 text-center">Tipo</th>
                <th className="py-3 px-4">Código / SKU</th>
                <th className="py-3 px-4">Descrição do Material</th>
                <th className="py-3 px-3 text-right">Quantidade</th>
                <th className="py-3 px-4">Origem / Destino & Justificativa</th>
                <th className="py-3 px-3 text-right">Valor / Custo</th>
                <th className="py-3 px-4 text-right">Saldo Resultante</th>
                <th className="py-3 px-3 text-center">Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Nenhuma movimentação localizada com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => {
                  const isEntrada = mov.type === 'ENTRADA';
                  const linkedReq = mov.requisitionNumber 
                    ? requisitions.find(r => r.requisitionNumber === mov.requisitionNumber)
                    : null;

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {formatDateBR(mov.date)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isEntrada
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {isEntrada ? (
                            <>
                              <ArrowDownRight className="w-3 h-3" />
                              <span>Entrada</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3 h-3" />
                              <span>Saída</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {mov.productSku}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs">
                        {mov.productName}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        <span className={isEntrada ? 'text-emerald-700' : 'text-amber-800'}>
                          {isEntrada ? '+' : '-'}{mov.quantity} {mov.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        {isEntrada ? (
                          <div>
                            <div className="flex items-center space-x-1 font-semibold text-slate-800">
                              <Truck className="w-3 h-3 text-slate-400" />
                              <span>{mov.supplier || 'Fornecedor Externo'}</span>
                            </div>
                            {mov.invoiceNumber && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                Doc: {mov.invoiceNumber}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-1 font-semibold text-slate-800">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span>Setor: {mov.sectorName || 'Produção'}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 line-clamp-1">
                              {mov.reason || 'Aplicação em produção'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                        {mov.totalPrice ? formatCurrency(mov.totalPrice) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap bg-slate-50/50">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                          {mov.balanceAfter} {mov.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {linkedReq ? (
                          <button
                            onClick={() => onViewRequisition(linkedReq)}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold border border-blue-200 transition-colors"
                            title="Visualizar e Imprimir Requisição Formal"
                          >
                            <FileText className="w-3 h-3" />
                            <span>{mov.requisitionNumber}</span>
                          </button>
                        ) : mov.invoiceNumber ? (
                          <span className="font-mono text-[10px] text-slate-500 font-medium">
                            {mov.invoiceNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
