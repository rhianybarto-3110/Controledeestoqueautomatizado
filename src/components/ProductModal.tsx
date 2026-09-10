import React, { useState, useEffect } from 'react';
import { X, Building2, AlertCircle } from 'lucide-react';
import { Product, UnitOfMeasure } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'currentStock' | 'createdAt'> & { id?: string; initialStock?: number }) => void;
  editingProduct?: Product | null;
}

const UNITS: UnitOfMeasure[] = ['Unidade', 'Kg', 'Litro', 'Caixa', 'Peça'];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct
}) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState<UnitOfMeasure>('Unidade');
  const [minStock, setMinStock] = useState<number | ''>(10);
  const [maxStock, setMaxStock] = useState<number | ''>(100);
  const [unitCost, setUnitCost] = useState<number | ''>(25.00);
  const [initialStock, setInitialStock] = useState<number | ''>(0);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setSku(editingProduct.sku);
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setUnit(editingProduct.unit);
      setMinStock(editingProduct.minStock);
      setMaxStock(editingProduct.maxStock);
      setUnitCost(editingProduct.unitCost);
      setLocation(editingProduct.location || '');
      setDescription(editingProduct.description || '');
      setInitialStock(editingProduct.currentStock);
    } else {
      setSku('');
      setName('');
      setCategory('Componentes Mecânicos');
      setUnit('Unidade');
      setMinStock(10);
      setMaxStock(100);
      setUnitCost(50.00);
      setInitialStock(0);
      setLocation('');
      setDescription('');
    }
    setError(null);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sku.trim()) {
      setError('O Código/SKU é obrigatório.');
      return;
    }
    if (!name.trim()) {
      setError('O Nome/Descrição do produto é obrigatório.');
      return;
    }
    if (minStock === '' || Number(minStock) < 0) {
      setError('O estoque mínimo deve ser um número maior ou igual a zero.');
      return;
    }
    if (maxStock === '' || Number(maxStock) < Number(minStock)) {
      setError('O estoque máximo deve ser maior ou igual ao estoque mínimo.');
      return;
    }
    if (unitCost === '' || Number(unitCost) < 0) {
      setError('O preço unitário/custo deve ser válido.');
      return;
    }

    onSave({
      id: editingProduct?.id,
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category: category.trim() || 'Geral',
      unit,
      minStock: Number(minStock),
      maxStock: Number(maxStock),
      unitCost: Number(unitCost),
      location: location.trim(),
      description: description.trim(),
      initialStock: editingProduct ? undefined : Number(initialStock || 0)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Editar Produto de Estoque' : 'Cadastrar Novo Produto'}
              </h3>
              <p className="text-xs text-slate-500">
                InovaTech Manufatura S.A. - Controle Físico de Almoxarifado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código / SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ex: RAW-ALU-6061, CMP-ROL-6204"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unidade de Medida <span className="text-rose-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitOfMeasure)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                required
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome / Descrição do Material <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Barra Redonda Alumínio 6061-T6 (Ø 2''), Rolamento SKF 6204..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria / Grupo
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Matéria-Prima, Componentes, Fluidos"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preço / Custo Unitário (R$) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                Estoque Mínimo <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-rose-300 rounded-md focus:ring-2 focus:ring-rose-500 outline-none bg-white font-mono"
                required
              />
              <span className="text-[10px] text-slate-500">Gatilho de alerta crítico</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estoque Máximo <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-mono"
                required
              />
              <span className="text-[10px] text-slate-500">Limite sugerido de compra</span>
            </div>

            {!editingProduct && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Saldo na implantação</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Localização Física no Almoxarifado
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Rua A - Prateleira 03, Box 12"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Especificação / Observações Técnicas
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Norma técnica, tolerância, aplicação principal"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
