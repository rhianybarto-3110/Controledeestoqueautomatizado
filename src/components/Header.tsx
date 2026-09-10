import React from 'react';
import { 
  Building2, 
  Boxes, 
  ArrowLeftRight, 
  FileText, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  RotateCcw,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ActiveTab, Product } from '../types';
import { formatCurrency } from '../utils/storage';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  products: Product[];
  onOpenNewMovement: (defaultType?: 'ENTRADA' | 'SAIDA') => void;
  onOpenNewRequisition: () => void;
  onOpenTestGuide: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  products,
  onOpenNewMovement,
  onOpenNewRequisition,
  onOpenTestGuide,
  onResetData
}) => {
  const criticalCount = products.filter(p => p.currentStock <= p.minStock).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner / Corporate Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-xl tracking-tight">
            IT
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-900 tracking-tight">InovaTech Manufatura S.A.</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                SGI Almoxarifado
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sistema Integrado de Gestão e Controle de Estoques Industriais
            </p>
          </div>
        </div>

        {/* Quick Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Alerta de Itens Críticos */}
          <button
            onClick={() => setActiveTab('reports')}
            title="Clique para ver os itens críticos no relatório"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              criticalCount > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {criticalCount > 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>{criticalCount} {criticalCount === 1 ? 'Item Crítico' : 'Itens Críticos'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Estoque Regular</span>
              </>
            )}
          </button>

          {/* Valor Total do Estoque */}
          <div className="hidden sm:flex flex-col px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Valor em Estoque</span>
            <span className="text-xs font-bold text-slate-900">{formatCurrency(totalStockValue)}</span>
          </div>

          {/* Botão de Demonstração / Testes Obrigatórios */}
          <button
            id="btn-test-guide"
            onClick={onOpenTestGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Demonstrativo & Testes</span>
          </button>

          {/* Botões de Ação Rápida */}
          <button
            id="btn-quick-movement"
            onClick={() => onOpenNewMovement()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Movimentação</span>
          </button>

          <button
            id="btn-quick-requisition"
            onClick={onOpenNewRequisition}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <FileText className="w-4 h-4" />
            <span>Emitir Requisição</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-100" aria-label="Tabs">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Painel Principal</span>
          </button>

          <button
            id="tab-products"
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Cadastro de Produtos ({products.length})</span>
          </button>

          <button
            id="tab-sectors"
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'sectors'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Setores & Responsáveis</span>
          </button>

          <button
            id="tab-movements"
            onClick={() => setActiveTab('movements')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'movements'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Controle de Movimentações</span>
          </button>

          <button
            id="tab-reports"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Relatórios Gerenciais</span>
          </button>

          <button
            id="tab-requisitions"
            onClick={() => setActiveTab('requisitions')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'requisitions'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Emissão de Requisições</span>
          </button>

          <div className="ml-auto flex items-center pl-2">
            <button
              id="btn-reset-data"
              onClick={onResetData}
              title="Restaurar dados de teste padrão da InovaTech"
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Dados</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
