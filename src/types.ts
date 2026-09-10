export type UnitOfMeasure = 'Unidade' | 'Kg' | 'Litro' | 'Caixa' | 'Peça';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: UnitOfMeasure;
  minStock: number;
  maxStock: number;
  unitCost: number; // Preço unitário / custo em R$
  currentStock: number; // Saldo atual em estoque
  location?: string; // Prateleira, Box, Tanque, etc.
  description?: string;
  createdAt: string;
}

export interface Sector {
  id: string;
  name: string; // Ex: Usinagem, Montagem Final, Pintura, Almoxarifado Central, Manutenção
  managerName: string; // Responsável
  managerRegistration: string; // Matrícula
  costCenter?: string;
  notes?: string;
}

export type MovementType = 'ENTRADA' | 'SAIDA';

export interface StockMovement {
  id: string;
  type: MovementType;
  date: string; // YYYY-MM-DD ou ISO
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unit: UnitOfMeasure;
  
  // Específico para ENTRADA
  supplier?: string; // Fornecedor / Origem
  unitPrice?: number; // Preço unitário
  totalPrice?: number;
  invoiceNumber?: string; // NF / Documento de Entrada
  
  // Específico para SAÍDA
  sectorId?: string; // Setor de Destino
  sectorName?: string;
  requesterName?: string; // Requisitante
  reason?: string; // Motivo da saída / Ordem de Produção
  requisitionNumber?: string; // Número de requisição vinculada
  
  balanceAfter: number; // Saldo do produto após a movimentação
  notes?: string;
  createdAt: string;
}

export interface RequisitionItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  unit: UnitOfMeasure;
  quantity: number;
  unitCost: number;
  totalCost: number;
  availableStock: number;
  purpose?: string;
}

export interface Requisition {
  id: string;
  requisitionNumber: string; // Ex: REQ-2026-001
  date: string;
  sectorId: string;
  sectorName: string;
  requesterName: string;
  requesterRegistration: string;
  warehouseManager: string;
  warehouseManagerRegistration: string;
  reason: string; // Motivo / Aplicação (ex: Ordem de Fabricação OP-204)
  status: 'ATENDIDA' | 'PENDENTE' | 'CANCELADA';
  items: RequisitionItem[];
  totalEstimatedCost: number;
  notes?: string;
  dispatchedAt: string;
}

export type ActiveTab = 'dashboard' | 'products' | 'sectors' | 'movements' | 'reports' | 'requisitions' | 'tests';
