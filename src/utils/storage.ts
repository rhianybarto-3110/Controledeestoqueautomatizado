import { Product, Sector, StockMovement, Requisition, UnitOfMeasure } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SECTORS, INITIAL_MOVEMENTS, INITIAL_REQUISITIONS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'inovatech_products_v2',
  SECTORS: 'inovatech_sectors_v2',
  MOVEMENTS: 'inovatech_movements_v2',
  REQUISITIONS: 'inovatech_requisitions_v2',
  INITIALIZED: 'inovatech_initialized_v2'
};

export const StorageService = {
  initializeStorage(): void {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults(): {
    products: Product[];
    sectors: Sector[];
    movements: StockMovement[];
    requisitions: Requisition[];
  } {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SECTORS, JSON.stringify(INITIAL_SECTORS));
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(INITIAL_MOVEMENTS));
    localStorage.setItem(STORAGE_KEYS.REQUISITIONS, JSON.stringify(INITIAL_REQUISITIONS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

    return {
      products: INITIAL_PRODUCTS,
      sectors: INITIAL_SECTORS,
      movements: INITIAL_MOVEMENTS,
      requisitions: INITIAL_REQUISITIONS
    };
  },

  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getSectors(): Sector[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SECTORS);
      return data ? JSON.parse(data) : INITIAL_SECTORS;
    } catch {
      return INITIAL_SECTORS;
    }
  },

  saveSectors(sectors: Sector[]): void {
    localStorage.setItem(STORAGE_KEYS.SECTORS, JSON.stringify(sectors));
  },

  getMovements(): StockMovement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      return data ? JSON.parse(data) : INITIAL_MOVEMENTS;
    } catch {
      return INITIAL_MOVEMENTS;
    }
  },

  saveMovements(movements: StockMovement[]): void {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  },

  getRequisitions(): Requisition[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUISITIONS);
      return data ? JSON.parse(data) : INITIAL_REQUISITIONS;
    } catch {
      return INITIAL_REQUISITIONS;
    }
  },

  saveRequisitions(requisitions: Requisition[]): void {
    localStorage.setItem(STORAGE_KEYS.REQUISITIONS, JSON.stringify(requisitions));
  },

  // Registra movimentação individual de Entrada ou Saída com recálculo atômico de saldo
  recordMovement(params: {
    type: 'ENTRADA' | 'SAIDA';
    date: string;
    productId: string;
    quantity: number;
    supplier?: string;
    unitPrice?: number;
    invoiceNumber?: string;
    sectorId?: string;
    requesterName?: string;
    reason?: string;
    requisitionNumber?: string;
    notes?: string;
  }): { success: boolean; error?: string; movement?: StockMovement; updatedProduct?: Product } {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === params.productId);

    if (productIndex === -1) {
      return { success: false, error: 'Produto não encontrado no cadastro.' };
    }

    const product = { ...products[productIndex] };
    const quantity = Number(params.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, error: 'A quantidade deve ser um número maior que zero.' };
    }

    let newBalance = product.currentStock;

    if (params.type === 'ENTRADA') {
      newBalance = product.currentStock + quantity;
      if (params.unitPrice && params.unitPrice > 0) {
        // Atualiza preço unitário para refletir o custo mais recente
        product.unitCost = Number(params.unitPrice);
      }
    } else {
      // Saída
      if (quantity > product.currentStock) {
        return {
          success: false,
          error: `Saldo insuficiente! Estoque atual de "${product.name}" é de apenas ${product.currentStock} ${product.unit}. Não é possível retirar ${quantity} ${product.unit}.`
        };
      }
      newBalance = product.currentStock - quantity;
    }

    product.currentStock = newBalance;
    products[productIndex] = product;
    this.saveProducts(products);

    // Identificar setor se houver
    let sectorName = '';
    if (params.sectorId) {
      const sectors = this.getSectors();
      const sector = sectors.find(s => s.id === params.sectorId);
      sectorName = sector ? sector.name : '';
    }

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: params.type,
      date: params.date || new Date().toISOString().substring(0, 16),
      productId: product.id,
      productSku: product.sku,
      productName: product.name,
      quantity,
      unit: product.unit,
      supplier: params.supplier,
      unitPrice: params.unitPrice,
      totalPrice: params.unitPrice ? params.unitPrice * quantity : undefined,
      invoiceNumber: params.invoiceNumber,
      sectorId: params.sectorId,
      sectorName,
      requesterName: params.requesterName,
      reason: params.reason,
      requisitionNumber: params.requisitionNumber,
      balanceAfter: newBalance,
      notes: params.notes,
      createdAt: new Date().toISOString()
    };

    const movements = this.getMovements();
    const updatedMovements = [newMovement, ...movements];
    this.saveMovements(updatedMovements);

    return {
      success: true,
      movement: newMovement,
      updatedProduct: product
    };
  },

  // Emissão de Requisição formal com baixa automática no estoque
  createRequisition(params: {
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
  }): { success: boolean; error?: string; requisition?: Requisition } {
    if (!params.items || params.items.length === 0) {
      return { success: false, error: 'A requisição deve conter pelo menos um item.' };
    }

    const products = this.getProducts();
    const sectors = this.getSectors();
    const sector = sectors.find(s => s.id === params.sectorId);

    if (!sector) {
      return { success: false, error: 'Setor de destino não localizado.' };
    }

    // Validação prévia de estoque para todos os itens
    for (const item of params.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `Produto com ID ${item.productId} não encontrado.` };
      }
      if (item.quantity <= 0) {
        return { success: false, error: `A quantidade para "${prod.name}" deve ser maior que zero.` };
      }
      if (item.quantity > prod.currentStock) {
        return {
          success: false,
          error: `Estoque insuficiente para "${prod.name}"! Saldo disponível: ${prod.currentStock} ${prod.unit}, Requisitado: ${item.quantity} ${prod.unit}.`
        };
      }
    }

    // Gerar número sequencial da requisição
    const existingReqs = this.getRequisitions();
    const nextSeq = existingReqs.length + 1;
    const requisitionNumber = `REQ-2026-${String(nextSeq).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const requisitionItems = params.items.map((item, idx) => {
      const prod = products.find(p => p.id === item.productId)!;
      return {
        id: `req-item-${Date.now()}-${idx}`,
        productId: prod.id,
        productSku: prod.sku,
        productName: prod.name,
        unit: prod.unit,
        quantity: item.quantity,
        unitCost: prod.unitCost,
        totalCost: prod.unitCost * item.quantity,
        availableStock: prod.currentStock,
        purpose: item.purpose || params.reason
      };
    });

    const totalEstimatedCost = requisitionItems.reduce((acc, it) => acc + it.totalCost, 0);

    const newRequisition: Requisition = {
      id: `req-${Date.now()}`,
      requisitionNumber,
      date: new Date().toISOString().substring(0, 16),
      sectorId: sector.id,
      sectorName: sector.name,
      requesterName: params.requesterName,
      requesterRegistration: params.requesterRegistration,
      warehouseManager: params.warehouseManager,
      warehouseManagerRegistration: params.warehouseManagerRegistration,
      reason: params.reason,
      status: 'ATENDIDA',
      items: requisitionItems,
      totalEstimatedCost,
      notes: params.notes,
      dispatchedAt: nowIso
    };

    // Baixa automática no estoque para cada item
    for (const item of params.items) {
      this.recordMovement({
        type: 'SAIDA',
        date: newRequisition.date,
        productId: item.productId,
        quantity: item.quantity,
        sectorId: sector.id,
        requesterName: params.requesterName,
        reason: params.reason,
        requisitionNumber,
        notes: `Atendimento formal da requisição ${requisitionNumber}. Item: ${item.purpose || ''}`
      });
    }

    const updatedReqs = [newRequisition, ...this.getRequisitions()];
    this.saveRequisitions(updatedReqs);

    return { success: true, requisition: newRequisition };
  }
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getStockStatus(product: Product): {
  status: 'CRITICO' | 'ATENCAO' | 'NORMAL' | 'EXCESSO';
  label: string;
  badgeClass: string;
  isAlert: boolean;
} {
  if (product.currentStock <= product.minStock) {
    return {
      status: 'CRITICO',
      label: 'Estoque Crítico (Abaixo do Mínimo)',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold',
      isAlert: true
    };
  }

  // Atenção quando estiver próximo do mínimo (até 20% acima do mínimo)
  if (product.currentStock <= product.minStock * 1.25) {
    return {
      status: 'ATENCAO',
      label: 'Atenção (Próximo ao Mínimo)',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300 font-medium',
      isAlert: false
    };
  }

  if (product.maxStock > 0 && product.currentStock > product.maxStock) {
    return {
      status: 'EXCESSO',
      label: 'Excesso (Acima do Máximo)',
      badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-300 font-medium',
      isAlert: false
    };
  }

  return {
    status: 'NORMAL',
    label: 'Regular / Normal',
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium',
    isAlert: false
  };
}
