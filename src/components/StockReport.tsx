import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowDownRight, 
  ArrowUpRight,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { Product, StockMovement, MovementType } from '../types';
import { formatCurrency, formatDateBR, getStockStatus } from '../utils/storage';

interface StockReportProps {
  products: Product[];
  movements: StockMovement[];
  onQuickMovement: (productId: string, type: MovementType) => void;
}

export const StockReport: React.FC<StockReportProps> = ({
  products,
  movements,
  onQuickMovement
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'posicao' | 'criticos' | 'movimentacoes'>('posicao');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | '7D' | '30D'>('ALL');

  const totalStockValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);
  const criticalProducts = products.filter(p => p.currentStock <= p.minStock);
  const regularCount = products.filter(p => p.currentStock > p.minStock).length;

  // Exportar para CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `relatorio_estoque_${activeReportTab}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeReportTab === 'posicao' || activeReportTab === 'criticos') {
      headers = [
        'Código/SKU',
        'Nome do Produto',
        'Categoria',
        'Unidade',
        'Estoque Mínimo',
        'Saldo Atual',
        'Estoque Máximo',
        'Custo Unitário (R$)',
        'Valor Total em Estoque (R$)',
        'Status de Alerta',
        'Localização'
      ];

      const list = activeReportTab === 'criticos' ? criticalProducts : products;

      rows = list.map(p => {
        const status = getStockStatus(p);
        return [
          `"${p.sku}"`,
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.category}"`,
          `"${p.unit}"`,
          String(p.minStock),
          String(p.currentStock),
          String(p.maxStock),
          p.unitCost.toFixed(2),
          (p.currentStock * p.unitCost).toFixed(2),
          `"${status.label}"`,
          `"${p.location || ''}"`
        ];
      });
    } else {
      headers = [
        'Data/Hora',
        'Tipo de Movimento',
        'Código SKU',
        'Produto',
        'Quantidade',
        'Unidade',
        'Origem/Fornecedor',
        'Destino/Setor',
        'Valor Total (R$)',
        'Saldo Resultante',
        'Motivo/Doc'
      ];

      rows = movements.map(m => [
        `"${formatDateBR(m.date)}"`,
        m.type,
        `"${m.productSku}"`,
        `"${m.productName.replace(/"/g, '""')}"`,
        String(m.quantity),
        m.unit,
        `"${m.supplier || ''}"`,
        `"${m.sectorName || ''}"`,
        m.totalPrice ? m.totalPrice.toFixed(2) : '0.00',
        String(m.balanceAfter),
        `"${(m.reason || m.invoiceNumber || '').replace(/"/g, '""')}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs no-print">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Relatórios Gerenciais e Posição de Estoque
            </h2>
            <p className="text-xs text-slate-500">
              InovaTech Manufatura S.A. • Análise de saldos físicos, valores contábeis e itens críticos
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            id="btn-export-csv"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV / Excel</span>
          </button>

          <button
            onClick={handlePrintReport}
            id="btn-print-report"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Cards de Resumo Gerencial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Patrimônio em Estoque</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 font-mono">
            {formatCurrency(totalStockValue)}
          </div>
          <span className="text-[10px] text-slate-500">Valor contábil total dos materiais</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Itens Cadastrados</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 font-mono">
            {products.length} itens
          </div>
          <span className="text-[10px] text-slate-500">{regularCount} em nível regular</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Estoque Crítico</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-700 font-mono">
            {criticalProducts.length} itens
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Abaixo do estoque mínimo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Movimentações Registradas</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 font-mono">
            {movements.length} operações
          </div>
          <span className="text-[10px] text-slate-500">
            {movements.filter(m => m.type === 'ENTRADA').length} entradas • {movements.filter(m => m.type === 'SAIDA').length} saídas
          </span>
        </div>
      </div>

      {/* Seletor de Sub-Relatórios */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 no-print">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveReportTab('posicao')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeReportTab === 'posicao'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            1. Posição Atual de Estoque
          </button>

          <button
            onClick={() => setActiveReportTab('criticos')}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeReportTab === 'criticos'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2. Itens Críticos ({criticalProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveReportTab('movimentacoes')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeReportTab === 'movimentacoes'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            3. Histórico Consolidado de Movimentações
          </button>
        </div>
      </div>

      {/* Relatório Imprimível / Visualizável */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs print:border-none print:shadow-none">
        {/* Cabeçalho exclusivo para impressão */}
        <div className="print-only p-6 border-b-2 border-slate-900 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-black uppercase tracking-tight">InovaTech Manufatura S.A.</h1>
              <p className="text-xs text-slate-600">Almoxarifado Industrial • CNPJ: 45.198.832/0001-90</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold">
                {activeReportTab === 'posicao' ? 'RELATÓRIO DE POSIÇÃO ATUAL DE ESTOQUE' : 
                 activeReportTab === 'criticos' ? 'RELATÓRIO DE PRODUTOS EM ESTOQUE CRÍTICO' : 
                 'RELATÓRIO CONSOLIDADO DE MOVIMENTAÇÕES'}
              </p>
              <p className="text-[10px] text-slate-500">Emissão: {new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* TAB 1: POSIÇÃO ATUAL DE ESTOQUE */}
        {activeReportTab === 'posicao' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Código / SKU</th>
                  <th className="py-3 px-4">Descrição do Material</th>
                  <th className="py-3 px-3 text-center">UN</th>
                  <th className="py-3 px-3 text-right">Estoque Mín.</th>
                  <th className="py-3 px-4 text-right">Saldo Físico</th>
                  <th className="py-3 px-3 text-right">Estoque Máx.</th>
                  <th className="py-3 px-4 text-right">Custo Unitário</th>
                  <th className="py-3 px-4 text-right">Valor Total em Estoque</th>
                  <th className="py-3 px-4 text-center">Status / Sinalização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {products.map(product => {
                  const status = getStockStatus(product);
                  const totalVal = product.currentStock * product.unitCost;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        status.isAlert ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {product.sku}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{product.name}</div>
                        <div className="text-[10px] text-slate-500">{product.category} • {product.location || 'Sem local'}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-700">
                        {product.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {product.minStock}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span className={status.isAlert ? 'text-rose-700 font-black' : 'text-slate-900'}>
                          {product.currentStock} {product.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {product.maxStock}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatCurrency(product.unitCost)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(totalVal)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] ${status.badgeClass}`}>
                          {status.isAlert && <AlertTriangle className="w-3 h-3" />}
                          <span>{status.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                  <td colSpan={7} className="py-3 px-4 text-right text-slate-700 uppercase tracking-wider text-[11px]">
                    Total Geral do Patrimônio em Estoque:
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-slate-900 whitespace-nowrap">
                    {formatCurrency(totalStockValue)}
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-slate-500">
                    {products.length} itens cadastrados
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* TAB 2: ITENS CRÍTICOS (ABAIXO DO MÍNIMO) */}
        {activeReportTab === 'criticos' && (
          <div className="overflow-x-auto">
            <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-rose-800 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Relação de itens que atingiram o estoque de segurança. Requer pedido de compra emergencial.</span>
              </div>
            </div>

            {criticalProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-semibold text-slate-800 text-sm">Nenhum produto em estoque crítico no momento!</p>
                <p className="text-xs text-slate-400">Todos os saldos estão acima dos limites mínimos estipulados.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-rose-50/80 border-b border-rose-200 text-rose-900 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Código / SKU</th>
                    <th className="py-3 px-4">Descrição do Produto</th>
                    <th className="py-3 px-3 text-center">UN</th>
                    <th className="py-3 px-3 text-right">Estoque Mínimo</th>
                    <th className="py-3 px-4 text-right">Saldo Físico Atual</th>
                    <th className="py-3 px-4 text-right">Déficit para o Mínimo</th>
                    <th className="py-3 px-4 text-right">Sugestão de Reposição</th>
                    <th className="py-3 px-4 text-center no-print">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100 font-sans">
                  {criticalProducts.map(prod => {
                    const deficit = prod.minStock - prod.currentStock;
                    const sugestaoCompra = prod.maxStock - prod.currentStock;

                    return (
                      <tr key={prod.id} className="hover:bg-rose-50/50 bg-rose-50/10 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {prod.sku}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div>{prod.name}</div>
                          <span className="text-[10px] text-slate-500">{prod.location || 'Almoxarifado Geral'}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-medium">
                          {prod.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                          {prod.minStock} {prod.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-rose-700 text-sm whitespace-nowrap">
                          {prod.currentStock} {prod.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-700 whitespace-nowrap">
                          -{deficit} {prod.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-700 whitespace-nowrap">
                          Comprar +{sugestaoCompra} {prod.unit}
                        </td>
                        <td className="py-3 px-4 text-center no-print whitespace-nowrap">
                          <button
                            onClick={() => onQuickMovement(prod.id, 'ENTRADA')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors shadow-2xs inline-flex items-center space-x-1"
                          >
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            <span>Comprar / Repor</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: HISTÓRICO CONSOLIDADO DE MOVIMENTAÇÕES */}
        {activeReportTab === 'movimentacoes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Data/Hora</th>
                  <th className="py-3 px-3 text-center">Tipo</th>
                  <th className="py-3 px-4">Código SKU</th>
                  <th className="py-3 px-4">Descrição do Material</th>
                  <th className="py-3 px-3 text-right">Qtd</th>
                  <th className="py-3 px-4">Origem / Destino & Motivo</th>
                  <th className="py-3 px-3 text-right">Valor Movimentado</th>
                  <th className="py-3 px-4 text-right">Saldo Resultante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {movements.map(m => {
                  const isEntrada = m.type === 'ENTRADA';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateBR(m.date)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isEntrada ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {m.productSku}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {m.productName}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        {isEntrada ? '+' : '-'}{m.quantity} {m.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {isEntrada ? `Fornecedor: ${m.supplier || '-'}` : `Setor: ${m.sectorName || '-'} (${m.reason || '-'})`}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-800 whitespace-nowrap">
                        {m.totalPrice ? formatCurrency(m.totalPrice) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap bg-slate-50/50">
                        {m.balanceAfter} {m.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
