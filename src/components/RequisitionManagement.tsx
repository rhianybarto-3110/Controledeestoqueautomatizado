import React from 'react';
import { FileText, Plus, Printer, CheckCircle2, Building, Calendar, UserCheck } from 'lucide-react';
import { Requisition } from '../types';
import { formatCurrency, formatDateBR } from '../utils/storage';

interface RequisitionManagementProps {
  requisitions: Requisition[];
  onOpenNewRequisition: () => void;
  onViewDocument: (req: Requisition) => void;
}

export const RequisitionManagement: React.FC<RequisitionManagementProps> = ({
  requisitions,
  onOpenNewRequisition,
  onViewDocument
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Emissão e Controle de Requisições Internas de Materiais (RIM)
            </h2>
            <p className="text-xs text-slate-500">
              Documentos oficiais formatados para coleta física de assinaturas do solicitante e almoxarife
            </p>
          </div>
        </div>

        <button
          id="btn-emit-new-req"
          onClick={onOpenNewRequisition}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Nova Requisição</span>
        </button>
      </div>

      {/* Grid de Requisições */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requisitions.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black font-mono text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    {req.requisitionNumber}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateBR(req.date)}</span>
                  </span>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{req.status}</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Setor Solicitante:</span>
                  </span>
                  <span className="font-bold text-slate-900">{req.sectorName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Solicitante:</span>
                  </span>
                  <span className="font-medium text-slate-800">
                    {req.requesterName} <span className="text-[10px] font-mono text-slate-500">({req.requesterRegistration})</span>
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700 text-[11px] leading-snug">
                  <span className="font-semibold text-slate-900 block mb-0.5">Motivo / Finalidade:</span>
                  {req.reason}
                </div>

                {/* Lista compacta de itens */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">
                    Itens Atendidos ({req.items.length}):
                  </span>
                  <div className="space-y-1">
                    {req.items.map(it => (
                      <div key={it.id} className="flex justify-between items-center text-xs py-0.5 border-b border-slate-50">
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">
                          {it.productName}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {it.quantity} {it.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Valor dos Materiais</span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  {formatCurrency(req.totalEstimatedCost)}
                </span>
              </div>

              <button
                onClick={() => onViewDocument(req)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Visualizar & Imprimir</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
