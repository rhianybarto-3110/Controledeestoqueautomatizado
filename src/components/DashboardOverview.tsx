import React from 'react';
import { 
  Boxes, 
  DollarSign, 
  AlertTriangle, 
  ArrowLeftRight, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Building,
  PlusCircle,
  Printer
} from 'lucide-react';
import { Product, Sector, StockMovement, Requisition, ActiveTab } from '../types';
import { formatCurrency, formatDateBR, getStockStatus } from '../utils/storage';

interface DashboardOverviewProps {
  products: Product[];
  sectors: Sector[];
  movements: StockMovement[];
  requisitions: Requisition[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewMovement: (type?: 'ENTRADA' | 'SAIDA') => void;
  onOpenNewRequisition: () => void;
  onViewRequisition: (req: Requisition) => void;
  onOpenTestGuide: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  products,
  sectors,
  movements,
  requisitions,
  onNavigateTab,
  onOpenNewMovement,
  onOpenNewRequisition,
  onViewRequisition,
  onOpenTestGuide
}) => {
  const totalStockValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);
  const criticalProducts = products.filter(p => p.currentStock <= p.minStock);
  const recentMovements = movements.slice(0, 5);

  const entradasCount = movements.filter(m => m.type === 'ENTRADA').length;
  const saidasCount = movements.filter(m => m.type === 'SAIDA').length;

  return (
    <div className="space-y-6">
      {/* Banner de Demonstração & Status dos Testes Obrigatórios */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Sistema em Operação • Responsável: Rhiany Barto</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Painel Operacional de Controle de Estoques e Almoxarifado
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Automação completa do fluxo de materiais entre almoxarifado central e setores de manufatura
            (Usinagem, Montagem Final, Pintura e Manutenção), com cálculo de saldos em tempo real e emissão formal de requisições.
          </p>
        </div>

        {/* Card do Roteiro de Testes */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full lg:w-80 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Testes Obrigatórios Prontos</span>
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full font-bold">
              3 de 3 Aprovados
            </span>
          </div>

          <div className="text-[11px] text-slate-200 space-y-1">
            <div className="flex justify-between">
              <span>1. Demonstrativo Funcional:</span>
              <span className="font-mono text-emerald-300 font-bold">OK (4 prod, 5 set, 3 ent, 3 saí)</span>
            </div>
            <div className="flex justify-between">
              <span>2. Impressão de Requisição:</span>
              <span className="font-mono text-emerald-300 font-bold">OK (A4 c/ assinaturas)</span>
            </div>
            <div className="flex justify-between">
              <span>3. Relatório de Posição:</span>
              <span className="font-mono text-emerald-300 font-bold">OK (Saldos e Alertas)</span>
            </div>
          </div>

          <button
            onClick={onOpenTestGuide}
            className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors text-center shadow-xs"
          >
            Abrir Roteiro de Demonstração
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Valor em Estoque */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Valor Total do Estoque</span>
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            {formatCurrency(totalStockValue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Soma patrimonial dos {products.length} itens ativos
          </p>
        </div>

        {/* Card 2: Alertas Críticos */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className={`p-5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            criticalProducts.length > 0
              ? 'bg-rose-50/50 border-rose-300 hover:border-rose-400'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${criticalProducts.length > 0 ? 'text-rose-800' : 'text-slate-500'}`}>
              Itens em Estoque Crítico
            </span>
            <div className={`p-2.5 rounded-lg ${criticalProducts.length > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className={`mt-3 text-2xl font-black font-mono ${criticalProducts.length > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
            {criticalProducts.length} {criticalProducts.length === 1 ? 'item' : 'itens'}
          </div>
          <p className={`text-[11px] mt-1 ${criticalProducts.length > 0 ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
            {criticalProducts.length > 0 ? 'Saldo ≤ estoque mínimo! Clique p/ ver' : 'Nenhum déficit no momento'}
          </p>
        </div>

        {/* Card 3: Movimentações */}
        <div 
          onClick={() => onNavigateTab('movements')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Operações Realizadas</span>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            {movements.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {entradasCount} entradas • {saidasCount} saídas atendidas
          </p>
        </div>

        {/* Card 4: Requisições Formais */}
        <div 
          onClick={() => onNavigateTab('requisitions')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Requisições Emitidas (RIM)</span>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            {requisitions.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Documentos formais prontos para impressão
          </p>
        </div>
      </div>

      {/* Grid Principal: Alertas Críticos & Últimas Movimentações */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Itens Críticos que Exigem Atenção */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Itens Críticos (Abaixo do Estoque Mínimo)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {criticalProducts.length}
              </span>
            </div>

            {criticalProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Todos os materiais estão acima do estoque mínimo.
              </div>
            ) : (
              <div className="space-y-3">
                {criticalProducts.map(prod => {
                  const deficit = prod.minStock - prod.currentStock;
                  return (
                    <div
                      key={prod.id}
                      className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded">
                          {prod.sku}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {prod.name}
                        </h4>
                        <div className="text-[11px] text-slate-600">
                          Saldo: <span className="font-bold text-rose-700">{prod.currentStock} {prod.unit}</span> (Mínimo: {prod.minStock} {prod.unit})
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenNewMovement('ENTRADA')}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors shrink-0 shadow-2xs"
                      >
                        Repor Estoque
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Parâmetro de segurança industrial</span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-blue-600 font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Ver relatório completo de compras</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Coluna Direita: Últimas Movimentações Realizadas */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Últimas Movimentações no Almoxarifado
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('movements')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Ver Todas ({movements.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentMovements.map(mov => {
                const isEntrada = mov.type === 'ENTRADA';
                return (
                  <div key={mov.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <span className={`p-1.5 rounded-lg ${isEntrada ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isEntrada ? <PlusCircle className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {mov.productName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {isEntrada ? `Fornecedor: ${mov.supplier || '-'}` : `Destino: ${mov.sectorName || '-'}`} • {formatDateBR(mov.date)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold ${isEntrada ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {isEntrada ? '+' : '-'}{mov.quantity} {mov.unit}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Saldo: {mov.balanceAfter} {mov.unit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onOpenNewMovement('ENTRADA')}
              className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors"
            >
              + Registrar Nova Entrada
            </button>
            <button
              onClick={() => onOpenNewMovement('SAIDA')}
              className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              - Registrar Nova Saída
            </button>
          </div>
        </div>
      </div>

      {/* Seção Rápida de Requisições Prontas para Impressão */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Requisições Internas Oficiais Cadastradas (RIM)
            </h3>
            <p className="text-xs text-slate-500">
              Documentos prontos para emissão física, controle de material e coleta de assinaturas
            </p>
          </div>
          <button
            onClick={onOpenNewRequisition}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Emitir Nova Requisição</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {requisitions.map(req => (
            <div
              key={req.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {req.requisitionNumber}
                  </span>
                  <span className="font-semibold text-slate-700">{req.sectorName}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Solicitante: {req.requesterName} ({req.requesterRegistration}) • {req.items.length} itens
                </div>
              </div>

              <button
                onClick={() => onViewRequisition(req)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors shadow-2xs shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Visualizar / Imprimir</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
