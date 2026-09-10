import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product, Sector, MovementType } from '../types';
import { formatCurrency, getStockStatus } from '../utils/storage';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sectors: Sector[];
  defaultType?: MovementType;
  defaultProductId?: string;
  onRecordMovement: (params: {
    type: MovementType;
    date: string;
    productId: string;
    quantity: number;
    supplier?: string;
    unitPrice?: number;
    invoiceNumber?: string;
    sectorId?: string;
    requesterName?: string;
    reason?: string;
    notes?: string;
  }) => { success: boolean; error?: string };
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  products,
  sectors,
  defaultType = 'ENTRADA',
  defaultProductId,
  onRecordMovement
}) => {
  const [type, setType] = useState<MovementType>(defaultType);
  const [productId, setProductId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  
  // Campos para Entrada
  const [supplier, setSupplier] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  
  // Campos para Saída
  const [sectorId, setSectorId] = useState<string>('');
  const [requesterName, setRequesterName] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      const initialProdId = defaultProductId || (products.length > 0 ? products[0].id : '');
      setProductId(initialProdId);
      
      const now = new Date();
      // Formato YYYY-MM-DDTHH:mm
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDate(localIso);
      setQuantity('');
      setSupplier('');
      setInvoiceNumber('');
      setSectorId(sectors.length > 0 ? sectors[0].id : '');
      setRequesterName(sectors.length > 0 ? sectors[0].managerName : '');
      setReason('');
      setNotes('');
      setError(null);
    }
  }, [isOpen, defaultType, defaultProductId, products, sectors]);

  // Atualiza preço unitário padrão ao trocar o produto
  const selectedProduct = products.find(p => p.id === productId);

  useEffect(() => {
    if (selectedProduct && type === 'ENTRADA' && unitPrice === '') {
      setUnitPrice(selectedProduct.unitCost);
    }
  }, [selectedProduct, type, unitPrice]);

  // Atualiza nome do requisitante ao mudar o setor
  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSectorId(sId);
    const sec = sectors.find(s => s.id === sId);
    if (sec) {
      setRequesterName(sec.managerName);
    }
  };

  if (!isOpen) return null;

  // Cálculo de previsão de saldo
  const numericQty = Number(quantity) || 0;
  const currentBal = selectedProduct ? selectedProduct.currentStock : 0;
  const projectedBal = type === 'ENTRADA' ? currentBal + numericQty : currentBal - numericQty;
  const isInsufficient = type === 'SAIDA' && numericQty > currentBal;
  const willBeCritical = selectedProduct ? projectedBal <= selectedProduct.minStock : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productId) {
      setError('Selecione um produto.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('A quantidade deve ser um número positivo maior que zero.');
      return;
    }

    if (type === 'ENTRADA') {
      if (!supplier.trim()) {
        setError('O fornecedor ou origem da entrada é obrigatório.');
        return;
      }
      if (unitPrice === '' || Number(unitPrice) < 0) {
        setError('Informe um preço unitário válido.');
        return;
      }
    } else {
      // Saída
      if (!sectorId) {
        setError('Selecione o setor de destino da saída.');
        return;
      }
      if (!reason.trim()) {
        setError('Informe o motivo da saída ou ordem de produção atendida.');
        return;
      }
      if (isInsufficient) {
        setError(`Saldo insuficiente! Estoque disponível é de apenas ${currentBal} ${selectedProduct?.unit}.`);
        return;
      }
    }

    const result = onRecordMovement({
      type,
      date,
      productId,
      quantity: Number(quantity),
      supplier: type === 'ENTRADA' ? supplier.trim() : undefined,
      unitPrice: type === 'ENTRADA' ? Number(unitPrice) : undefined,
      invoiceNumber: type === 'ENTRADA' ? invoiceNumber.trim() : undefined,
      sectorId: type === 'SAIDA' ? sectorId : undefined,
      requesterName: type === 'SAIDA' ? requesterName.trim() : undefined,
      reason: type === 'SAIDA' ? reason.trim() : undefined,
      notes: notes.trim()
    });

    if (!result.success) {
      setError(result.error || 'Erro ao registrar movimentação.');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header com Toggle Tipo de Movimento */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Controle de Movimentação de Estoque
            </h3>
            <p className="text-xs text-slate-500">
              InovaTech Manufatura S.A. - Registro com atualização de saldo em tempo real
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seletor do Tipo de Movimentação */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => { setType('ENTRADA'); setError(null); }}
              className={`flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-md transition-all ${
                type === 'ENTRADA'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Entrada (Recebimento / Compra)</span>
            </button>

            <button
              type="button"
              onClick={() => { setType('SAIDA'); setError(null); }}
              className={`flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-md transition-all ${
                type === 'SAIDA'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Saída (Produção / Consumo)</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Seleção de Produto e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Material / Produto <span className="text-rose-500">*</span>
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-medium"
                required
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} (Saldo: {p.currentStock} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data e Horário <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                required
              />
            </div>
          </div>

          {/* Quantidade e Simulação Instantânea de Saldo */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantidade a {type === 'ENTRADA' ? 'Adicionar' : 'Retirar'} ({selectedProduct?.unit || 'Un'}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`Informe a qtd em ${selectedProduct?.unit || 'unidades'}`}
                  className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:ring-2 outline-none ${
                    isInsufficient
                      ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-rose-500'
                      : 'border-slate-300 bg-white focus:ring-blue-500'
                  }`}
                  required
                />
              </div>

              {/* Painel de Cálculo em Tempo Real */}
              {selectedProduct && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Saldo em Estoque Atual:</span>
                    <span className="font-bold text-slate-900">{selectedProduct.currentStock} {selectedProduct.unit}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Estoque Mínimo de Segurança:</span>
                    <span className="font-mono text-slate-700">{selectedProduct.minStock} {selectedProduct.unit}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Saldo Projetado Após Movimento:</span>
                    <span className={`font-bold font-mono text-sm ${
                      isInsufficient 
                        ? 'text-rose-600' 
                        : willBeCritical 
                        ? 'text-amber-600' 
                        : 'text-emerald-700'
                    }`}>
                      {projectedBal} {selectedProduct.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Alertas Visuais Condicionais */}
            {isInsufficient && (
              <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 bg-rose-100/70 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Bloqueio: A quantidade solicitada excede o saldo físico disponível ({currentBal} {selectedProduct?.unit}).</span>
              </div>
            )}

            {!isInsufficient && willBeCritical && type === 'SAIDA' && (
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 bg-amber-100/70 p-2 rounded-lg border border-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Alerta Visual: Esta saída levará o produto para o nível crítico (saldo projetado ≤ estoque mínimo {selectedProduct?.minStock}).</span>
              </div>
            )}
          </div>

          {/* Campos específicos para ENTRADA */}
          {type === 'ENTRADA' && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fornecedor / Origem do Material <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Ex: AluBrasil Metais, SKF do Brasil, Petrobras..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={type === 'ENTRADA'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preço Unitário (R$) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={type === 'ENTRADA'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nota Fiscal / Documento de Entrada
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Ex: NF-e 048.912"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                    <span className="text-slate-600">Valor Total da Entrada:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatCurrency(numericQty * (Number(unitPrice) || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campos específicos para SAÍDA */}
          {type === 'SAIDA' && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Setor Produtivo de Destino <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={sectorId}
                    onChange={handleSectorChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                    required={type === 'SAIDA'}
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.managerName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do Requisitante / Recebedor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Ex: Carlos Mendes"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={type === 'SAIDA'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo da Saída / Ordem de Produção <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Ordem de Produção OP-4091, Manutenção do Torno CNC 02, etc."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required={type === 'SAIDA'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações Adicionais
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Lote inspecionado, conferência realizada no balcão 01"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
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
              disabled={isInsufficient}
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs ${
                type === 'ENTRADA'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed'
              }`}
            >
              {type === 'ENTRADA' ? 'Confirmar Entrada' : 'Confirmar Saída'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
