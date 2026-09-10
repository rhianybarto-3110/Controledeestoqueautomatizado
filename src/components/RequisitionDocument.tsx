import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Requisition } from '../types';
import { formatCurrency, formatDateBR } from '../utils/storage';

interface RequisitionDocumentProps {
  requisition: Requisition | null;
  onClose: () => void;
}

export const RequisitionDocument: React.FC<RequisitionDocumentProps> = ({
  requisition,
  onClose
}) => {
  if (!requisition) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:bg-white">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        {/* Barra Superior Interativa (Oculta na impressão) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">Visualização de Documento Formal de Requisição</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-blue-300 border border-slate-700">
              {requisition.requisitionNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              id="btn-print-requisition"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Documento (A4 Estilo Corporativo) */}
        <div className="p-6 sm:p-10 overflow-y-auto print:overflow-visible print:p-8 text-slate-900 text-xs font-sans print-container">
          {/* Cabeçalho Corporativo Timbrado */}
          <div className="border-2 border-slate-900 p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-3 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-900 text-white font-black text-2xl flex items-center justify-center rounded-sm">
                  IT
                </div>
                <div>
                  <h1 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                    InovaTech Manufatura S.A.
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Divisão de Manufatura e Logística Industrial • CNPJ: 45.198.832/0001-90
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Av. da Engenharia, 1500 - Distrito Industrial - Joinville/SC
                  </p>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Documento Operacional
                </div>
                <div className="text-base font-black text-slate-900 tracking-tight font-mono">
                  {requisition.requisitionNumber}
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  Data/Hora: {formatDateBR(requisition.date)}
                </div>
              </div>
            </div>

            <div className="text-center pt-2.5 pb-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                REQUISIÇÃO INTERNA DE MATERIAIS E COMPONENTES (RIM)
              </h2>
              <span className="text-[10px] text-slate-600">
                Documento de controle físico oficial para baixa de estoque e coleta de assinaturas
              </span>
            </div>
          </div>

          {/* Dados do Setor Solicitante e Almoxarifado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 border border-slate-300 p-3.5 bg-slate-50/70 print:bg-transparent">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-1">
                1. Identificação do Setor Solicitante
              </div>
              <div className="grid grid-cols-3 gap-1 text-slate-700">
                <span className="font-semibold text-slate-900">Setor Destino:</span>
                <span className="col-span-2 font-medium">{requisition.sectorName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-slate-700">
                <span className="font-semibold text-slate-900">Requisitante:</span>
                <span className="col-span-2 font-medium">{requisition.requesterName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-slate-700">
                <span className="font-semibold text-slate-900">Matrícula:</span>
                <span className="col-span-2 font-mono font-medium">{requisition.requesterRegistration}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-1">
                2. Almoxarifado / Atendimento
              </div>
              <div className="grid grid-cols-3 gap-1 text-slate-700">
                <span className="font-semibold text-slate-900">Dispensado por:</span>
                <span className="col-span-2 font-medium">{requisition.warehouseManager}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-slate-700">
                <span className="font-semibold text-slate-900">Matrícula:</span>
                <span className="col-span-2 font-mono font-medium">{requisition.warehouseManagerRegistration}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-slate-700">
                <span className="font-semibold text-slate-900">Status Baixa:</span>
                <span className="col-span-2 font-bold text-emerald-700">ATENDIDA (BAIXA CONCRETIZADA)</span>
              </div>
            </div>
          </div>

          {/* Justificativa / Motivo de Aplicação */}
          <div className="mb-6 border border-slate-300 p-3 bg-white">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
              3. Motivo da Solicitação / Ordem de Produção / Destinação
            </div>
            <p className="text-slate-800 font-medium">
              {requisition.reason}
            </p>
            {requisition.notes && (
              <p className="text-[11px] text-slate-600 mt-1 italic">
                Obs: {requisition.notes}
              </p>
            )}
          </div>

          {/* Tabela de Itens da Requisição */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-2">
              4. Relação de Materiais Requisitados e Atendidos
            </div>
            <div className="border border-slate-300 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-900">
                    <th className="p-2 border-r border-slate-300 w-10 text-center">Item</th>
                    <th className="p-2 border-r border-slate-300 w-28">Código / SKU</th>
                    <th className="p-2 border-r border-slate-300">Descrição Completa do Material</th>
                    <th className="p-2 border-r border-slate-300 w-16 text-center">UN</th>
                    <th className="p-2 border-r border-slate-300 w-20 text-right">Qtd Req.</th>
                    <th className="p-2 border-r border-slate-300 w-20 text-right">Qtd Ent.</th>
                    <th className="p-2 border-r border-slate-300 w-24 text-right">Custo Unit.</th>
                    <th className="p-2 text-right w-24">Total (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {requisition.items.map((item, index) => (
                    <tr key={item.id} className="text-slate-800">
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-900">
                        {item.productSku}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        <div>{item.productName}</div>
                        {item.purpose && (
                          <div className="text-[10px] text-slate-500 italic">Aplicação: {item.purpose}</div>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-medium">
                        {item.unit}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold">
                        {item.quantity}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-emerald-800">
                        {item.quantity}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">
                        {formatCurrency(item.unitCost)}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                    <td colSpan={6} className="p-2 text-right border-r border-slate-300 text-slate-700">
                      Total Estimado dos Materiais Dispensados:
                    </td>
                    <td colSpan={2} className="p-2 text-right font-mono text-sm text-slate-900">
                      {formatCurrency(requisition.totalEstimatedCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Termo de Responsabilidade Formal */}
          <div className="border border-slate-200 p-3 bg-slate-50 text-[10px] text-slate-600 leading-relaxed mb-8">
            <p className="font-semibold text-slate-700 uppercase mb-0.5">Termo de Conferência e Responsabilidade:</p>
            Declaro ter conferido e recebido em perfeitas condições os materiais acima descritos, assumindo total responsabilidade
            pela guarda, uso adequado estritamente voltado às atividades produtivas da <strong>InovaTech Manufatura S.A.</strong> e
            comunicação imediata de qualquer anomalia técnica.
          </div>

          {/* Campos de Assinatura Obrigatórios para Impressão */}
          <div className="grid grid-cols-2 gap-8 pt-6 page-break-avoid border-t border-slate-300">
            <div className="text-center space-y-1">
              <div className="border-b-2 border-slate-900 h-10 w-4/5 mx-auto mb-1"></div>
              <div className="font-bold text-slate-900 text-xs">
                {requisition.requesterName}
              </div>
              <div className="text-[11px] text-slate-600">
                Solicitante / Setor {requisition.sectorName}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Matrícula: {requisition.requesterRegistration}
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="border-b-2 border-slate-900 h-10 w-4/5 mx-auto mb-1"></div>
              <div className="font-bold text-slate-900 text-xs">
                {requisition.warehouseManager}
              </div>
              <div className="text-[11px] text-slate-600">
                Responsável pelo Almoxarifado Central
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Matrícula: {requisition.warehouseManagerRegistration}
              </div>
            </div>
          </div>

          {/* Rodapé do Documento */}
          <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400">
            InovaTech Manufatura S.A. • Sistema de Gestão Operacional de Estoques • Documento Gerado em {new Date().toLocaleString('pt-BR')} • Via de Almoxarifado / Auditoria
          </div>
        </div>
      </div>
    </div>
  );
};
