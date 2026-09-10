import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, AlertCircle } from 'lucide-react';
import { Product, Sector, Requisition } from '../types';

interface RequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sectors: Sector[];
  onCreateRequisition: (data: {
    sectorId: string;
    requesterName: string;
    requesterRegistration: string;
    warehouseManager: string;
    warehouseManagerRegistration: string;
    reason: string;
    notes?: string;
    items: Array<{
      productId: string;
      quantity: number;
      purpose?: string;
    }>;
  }) => { success: boolean; error?: string; requisition?: Requisition };
  onSuccess: (req: Requisition) => void;
}

interface DraftItem {
  productId: string;
  quantity: number | '';
  purpose: string;
}

export const RequisitionModal: React.FC<RequisitionModalProps> = ({
  isOpen,
  onClose,
  products,
  sectors,
  onCreateRequisition,
  onSuccess
}) => {
  const [sectorId, setSectorId] = useState(sectors[0]?.id || '');
  const [requesterName, setRequesterName] = useState(sectors[0]?.managerName || '');
  const [requesterRegistration, setRequesterRegistration] = useState(sectors[0]?.managerRegistration || '');
  const [warehouseManager, setWarehouseManager] = useState('Roberto Guimarães da Silva');
  const [warehouseManagerRegistration, setWarehouseManagerRegistration] = useState('MAT-0512');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<DraftItem[]>([
    { productId: products[0]?.id || '', quantity: 1, purpose: '' }
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSectorId(sId);
    const sec = sectors.find(s => s.id === sId);
    if (sec) {
      setRequesterName(sec.managerName);
      setRequesterRegistration(sec.managerRegistration);
    }
  };

  const handleAddItem = () => {
    const availableProd = products.find(p => !items.some(it => it.productId === p.id)) || products[0];
    if (availableProd) {
      setItems([...items, { productId: availableProd.id, quantity: 1, purpose: '' }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setError('A requisição deve conter pelo menos um item.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof DraftItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sectorId) {
      setError('Selecione o setor solicitante.');
      return;
    }
    if (!requesterName.trim() || !requesterRegistration.trim()) {
      setError('Informe o nome e a matrícula do solicitante.');
      return;
    }
    if (!reason.trim()) {
      setError('Informe a justificativa ou Ordem de Produção.');
      return;
    }

    // Validar itens
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const prod = products.find(p => p.id === it.productId);
      if (!prod) {
        setError(`Item #${i + 1}: Selecione um produto válido.`);
        return;
      }
      const qty = Number(it.quantity);
      if (isNaN(qty) || qty <= 0) {
        setError(`Item #${i + 1} (${prod.name}): A quantidade deve ser maior que zero.`);
        return;
      }
      if (qty > prod.currentStock) {
        setError(
          `Item #${i + 1} (${prod.name}): Saldo insuficiente! Estoque atual é de apenas ${prod.currentStock} ${prod.unit}.`
        );
        return;
      }
    }

    const payload = {
      sectorId,
      requesterName: requesterName.trim(),
      requesterRegistration: requesterRegistration.trim(),
      warehouseManager: warehouseManager.trim(),
      warehouseManagerRegistration: warehouseManagerRegistration.trim(),
      reason: reason.trim(),
      notes: notes.trim(),
      items: items.map(it => ({
        productId: it.productId,
        quantity: Number(it.quantity),
        purpose: it.purpose.trim()
      }))
    };

    const res = onCreateRequisition(payload);
    if (!res.success) {
      setError(res.error || 'Erro ao emitir requisição.');
      return;
    }

    if (res.requisition) {
      onSuccess(res.requisition);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Emitir Nova Requisição Interna de Materiais (RIM)
              </h3>
              <p className="text-xs text-slate-500">
                InovaTech Manufatura S.A. - Gera baixa automática no estoque e documento para impressão
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Dados do Solicitante */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Identificação do Solicitante
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Setor de Destino <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sectorId}
                  onChange={handleSectorChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  required
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Solicitante <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Nome do colaborador"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matrícula <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={requesterRegistration}
                  onChange={(e) => setRequesterRegistration(e.target.value)}
                  placeholder="Ex: MAT-1042"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                  required
                />
              </div>
            </div>
          </div>

          {/* Justificativa da Requisição */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Finalidade / Motivo da Solicitação / Ordem de Produção <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Atendimento da Ordem de Fabricação OP-4095 - Conjunto Redutor"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Relação de Materiais */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                2. Materiais Requisitados ({items.length})
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Mais um Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => {
                const prod = products.find(p => p.id === item.productId);
                const isItemInsufficient = prod ? Number(item.quantity || 0) > prod.currentStock : false;

                return (
                  <div
                    key={idx}
                    className="p-3 border border-slate-200 rounded-lg bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-1">
                      <span>Item #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-0.5"
                          title="Remover este item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Material
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              [{p.sku}] {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Qtd ({prod?.unit || 'Un'})
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                          className={`w-full px-2.5 py-1.5 text-xs border rounded-md font-mono focus:ring-2 outline-none ${
                            isItemInsufficient ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-slate-300'
                          }`}
                          required
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Saldo Físico Atual
                        </label>
                        <div className="px-2 py-1 bg-slate-100 rounded-md text-xs font-mono font-bold text-slate-800 text-center">
                          {prod ? `${prod.currentStock} ${prod.unit}` : '-'}
                        </div>
                      </div>
                    </div>

                    {isItemInsufficient && (
                      <p className="text-[11px] text-rose-600 font-semibold">
                        A quantidade solicitada excede o saldo físico de {prod?.currentStock} {prod?.unit}!
                      </p>
                    )}

                    <div>
                      <input
                        type="text"
                        value={item.purpose}
                        onChange={(e) => handleItemChange(idx, 'purpose', e.target.value)}
                        placeholder="Aplicação específica desta peça (opcional)"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-md text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dados do Almoxarifado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsável pelo Almoxarifado
              </label>
              <input
                type="text"
                value={warehouseManager}
                onChange={(e) => setWarehouseManager(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula do Almoxarife
              </label>
              <input
                type="text"
                value={warehouseManagerRegistration}
                onChange={(e) => setWarehouseManagerRegistration(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md font-mono uppercase bg-white"
                required
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
              Emitir e Baixar Estoque
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
