import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  ArrowDownRight, 
  ArrowUpRight, 
  AlertTriangle,
  Layers,
  MapPin
} from 'lucide-react';
import { Product, UnitOfMeasure } from '../types';
import { formatCurrency, getStockStatus } from '../utils/storage';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onQuickMovement: (productId: string, type: 'ENTRADA' | 'SAIDA') => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onQuickMovement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState<boolean>(false);

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'TODAS' || p.category === selectedCategory;
    const matchesAlert = !filterAlertsOnly || p.currentStock <= p.minStock;

    return matchesSearch && matchesCategory && matchesAlert;
  });

  const criticalCount = products.filter(p => p.currentStock <= p.minStock).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Catálogo e Cadastro de Produtos de Estoque
              </h2>
              <p className="text-xs text-slate-500">
                Parâmetros de estoque mínimo, máximo, unidades de medida e localização
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="btn-new-product"
            onClick={onAddProduct}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Alerta de Estoque Crítico Banner se houver */}
      {criticalCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-rose-900">
                Atenção: {criticalCount} {criticalCount === 1 ? 'produto atingiu' : 'produtos atingiram'} o estoque mínimo de segurança!
              </span>
              <p className="text-[11px] text-rose-700">
                Necessária reposição imediata para evitar parada das linhas de produção.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              filterAlertsOnly
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-100'
            }`}
          >
            {filterAlertsOnly ? 'Ver Todos os Itens' : 'Filtrar Apenas Críticos'}
          </button>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por SKU, nome ou localização..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Categoria:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none"
          >
            <option value="TODAS">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              filterAlertsOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Apenas Alertas ({criticalCount})
          </button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Código / SKU</th>
                <th className="py-3 px-4">Nome & Especificação</th>
                <th className="py-3 px-3 text-center">Unidade</th>
                <th className="py-3 px-3 text-right">Estoque Mínimo</th>
                <th className="py-3 px-4 text-right">Saldo em Estoque</th>
                <th className="py-3 px-3 text-right">Estoque Máximo</th>
                <th className="py-3 px-4 text-right">Custo Unitário</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4 text-center">Status / Alerta</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  const totalValue = product.currentStock * product.unitCost;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        status.isAlert ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {product.sku}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 leading-tight">
                          {product.name}
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="flex items-center space-x-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>{product.category}</span>
                          </span>
                          {product.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{product.location}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                          {product.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600 font-semibold whitespace-nowrap">
                        {product.minStock} {product.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span className={`text-sm ${
                          status.isAlert 
                            ? 'text-rose-700 font-black' 
                            : 'text-slate-900'
                        }`}>
                          {product.currentStock} {product.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                        {product.maxStock} {product.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 whitespace-nowrap">
                        {formatCurrency(product.unitCost)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(totalValue)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] ${status.badgeClass}`}>
                          {status.isAlert && <AlertTriangle className="w-3 h-3" />}
                          <span>{status.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onQuickMovement(product.id, 'ENTRADA')}
                            title="Entrada / Reposição de Estoque"
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <ArrowDownRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onQuickMovement(product.id, 'SAIDA')}
                            title="Saída / Consumo de Estoque"
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            title="Editar Parâmetros do Produto"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
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
