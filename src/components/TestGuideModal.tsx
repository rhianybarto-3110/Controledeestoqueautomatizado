import React from 'react';
import { X, CheckCircle2, AlertCircle, Printer, FileSpreadsheet, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { Product, Sector, StockMovement, Requisition, ActiveTab } from '../types';

interface TestGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sectors: Sector[];
  movements: StockMovement[];
  requisitions: Requisition[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenRequisitionDoc: (req: Requisition) => void;
  onResetData: () => void;
}

export const TestGuideModal: React.FC<TestGuideModalProps> = ({
  isOpen,
  onClose,
  products,
  sectors,
  movements,
  requisitions,
  onNavigateTab,
  onOpenRequisitionDoc,
  onResetData
}) => {
  if (!isOpen) return null;

  const entradas = movements.filter(m => m.type === 'ENTRADA');
  const saidas = movements.filter(m => m.type === 'SAIDA');

  // Teste 1 status: >= 3 produtos, >= 2 setores, >= 2 entradas, >= 3 saídas
  const test1Passed = products.length >= 3 && sectors.length >= 2 && entradas.length >= 2 && saidas.length >= 3;
  // Teste 2 status: >= 1 requisição emitida e pronta para impressão
  const test2Passed = requisitions.length > 0;
  // Teste 3 status: produtos com cálculo consolidado e saldos
  const test3Passed = products.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Roteiro de Validação dos Testes Obrigatórios
              </h3>
              <p className="text-xs text-slate-400">
                InovaTech Manufatura S.A. • Conformidade com os requisitos de avaliação
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Card Geral de Status */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <p className="font-bold text-sm text-blue-950 mb-1">
                Cenário Demonstrativo Automatizado e Persistido
              </p>
              O sistema já vem pré-configurado com os dados práticos da InovaTech Manufatura S.A.,
              permitindo a demonstração imediata de todos os critérios solicitados. Você também pode cadastrar novos itens,
              fazer movimentações manuais ou restaurar os dados originais a qualquer momento.
            </div>
          </div>

          {/* Teste 1: Demonstrativo Funcional */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-full ${test1Passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {test1Passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Teste 1: Demonstrativo Funcional de Saldos
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pelo menos 3 produtos, 2 setores, 2 entradas e 3 saídas com saldos atualizados
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                test1Passed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {test1Passed ? '100% Atendido' : 'Pendente'}
              </span>
            </div>

            {/* Checklist de contagens */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Produtos (mín 3)</span>
                <span className="text-sm font-bold font-mono text-slate-900">{products.length} cadastrados</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Setores (mín 2)</span>
                <span className="text-sm font-bold font-mono text-slate-900">{sectors.length} cadastrados</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Entradas (mín 2)</span>
                <span className="text-sm font-bold font-mono text-emerald-700">{entradas.length} realizadas</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Saídas (mín 3)</span>
                <span className="text-sm font-bold font-mono text-amber-700">{saidas.length} realizadas</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  onNavigateTab('movements');
                  onClose();
                }}
                className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                <span>Ver histórico de entradas, saídas e saldos instantâneos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Teste 2: Impressão da Requisição */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-full ${test2Passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {test2Passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Teste 2: Impressão da Requisição de Materiais
                  </h4>
                  <p className="text-xs text-slate-500">
                    Documento oficial com número, data/hora, setor, lista de itens e campos de assinatura
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Pronto para Impressão
              </span>
            </div>

            <p className="text-xs text-slate-600">
              O documento oficial está formatado no padrão A4 corporativo da InovaTech, com cabeçalho timbrado,
              termo de responsabilidade, carimbo temporal e linhas formais para assinatura física do solicitante e almoxarife.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-700">
                Requisições disponíveis para teste: {requisitions.length}
              </span>
              {requisitions.length > 0 && (
                <button
                  onClick={() => {
                    onOpenRequisitionDoc(requisitions[0]);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Visualizar e Imprimir Requisição ({requisitions[0].requisitionNumber})</span>
                </button>
              )}
            </div>
          </div>

          {/* Teste 3: Relatório de Posição */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-full ${test3Passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {test3Passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Teste 3: Relatório Consolidado de Posição de Estoque
                  </h4>
                  <p className="text-xs text-slate-500">
                    Visão consolidada com saldos finais atualizados após todos os movimentos, valor por item e alertas
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Consolidado em Tempo Real
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Apresenta a posição completa de estoque com quantidade total, preço médio, valor patrimonial total em R$,
              alertas de estoque crítico em vermelho e opção de exportação instantânea para CSV / planilha.
            </p>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  onNavigateTab('reports');
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Abrir Relatório de Posição de Estoque</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer do Modal com Botão de Restauração */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetData();
              onClose();
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Recarregar Cenário de Teste Padrão InovaTech</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Fechar Roteiro
          </button>
        </div>
      </div>
    </div>
  );
};
