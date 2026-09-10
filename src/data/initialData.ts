import { Product, Sector, StockMovement, Requisition } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'RAW-ALU-6061',
    name: 'Barra Redonda Alumínio 6061-T6 (Ø 2" x 3000mm)',
    category: 'Matéria-Prima Metálica',
    unit: 'Peça',
    minStock: 20,
    maxStock: 100,
    unitCost: 85.50,
    currentStock: 35, // 50 entrada - 15 saída = 35
    location: 'Rua A - Prateleira 03',
    description: 'Liga de alta usinabilidade para fabricação de eixos e flanges.',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'prod-2',
    sku: 'CMP-ROL-6204',
    name: 'Rolamento Rígido de Esferas SKF 6204-2RSH',
    category: 'Componentes Mecânicos',
    unit: 'Unidade',
    minStock: 30,
    maxStock: 150,
    unitCost: 42.00,
    currentStock: 55, // 80 entrada - 25 saída = 55
    location: 'Rua B - Gaveteiro 12',
    description: 'Blindagem de borracha nitrílica em ambos os lados, alta rotação.',
    createdAt: '2026-09-01T08:30:00.000Z'
  },
  {
    id: 'prod-3',
    sku: 'FLU-OLE-VG68',
    name: 'Óleo Lubrificante Hidráulico Mineral ISO VG 68',
    category: 'Fluidos e Químicos',
    unit: 'Litro',
    minStock: 50, // ESTOQUE CRÍTICO: saldo (30) < minStock (50)
    maxStock: 250,
    unitCost: 28.50,
    currentStock: 30, // 40 entrada - 10 saída = 30 (CRÍTICO!)
    location: 'Área Química - Tambor 04',
    description: 'Fluido antidesgaste para sistemas hidráulicos de prensas e tornos.',
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    id: 'prod-4',
    sku: 'CON-SOL-ER70S',
    name: 'Arame Tubular para Solda MIG/MAG ER70S-6 (Carretel 15Kg)',
    category: 'Consumíveis de Solda',
    unit: 'Caixa',
    minStock: 15, // ESTOQUE CRÍTICO: saldo (8) < minStock (15)
    maxStock: 60,
    unitCost: 195.00,
    currentStock: 8,
    location: 'Rua C - Palete 01',
    description: 'Eletrodo contínuo para caldeiraria pesada e soldagem estrutural.',
    createdAt: '2026-09-02T10:00:00.000Z'
  }
];

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 'sec-1',
    name: 'Usinagem',
    managerName: 'Eng. Carlos Eduardo Mendes',
    managerRegistration: 'MAT-1042',
    costCenter: 'CC-301 - Manufatura Mecânica',
    notes: 'Tornos CNC, Centros de Usinagem e Fresadoras.'
  },
  {
    id: 'sec-2',
    name: 'Montagem Final',
    managerName: 'Amanda Souza Ribeiro',
    managerRegistration: 'MAT-0887',
    costCenter: 'CC-302 - Linha de Integração',
    notes: 'Montagem de subconjuntos e teste funcional de máquinas.'
  },
  {
    id: 'sec-3',
    name: 'Pintura e Tratamento',
    managerName: 'Marcos Vinícius Alencar',
    managerRegistration: 'MAT-2190',
    costCenter: 'CC-303 - Acabamento Superficial',
    notes: 'Cabine de pintura eletrostática a pó e decapagem.'
  },
  {
    id: 'sec-4',
    name: 'Almoxarifado Central',
    managerName: 'Roberto Guimarães da Silva',
    managerRegistration: 'MAT-0512',
    costCenter: 'CC-101 - Logística e Suprimentos',
    notes: 'Controle de recebimento físico, inspeção e dispensação.'
  },
  {
    id: 'sec-5',
    name: 'Manutenção',
    managerName: 'Silvana Duarte Castro',
    managerRegistration: 'MAT-1334',
    costCenter: 'CC-204 - Manutenção Preditiva/Corretiva',
    notes: 'Oficina de apoio mecânico, elétrico e pneumático.'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  // 1ª Entrada
  {
    id: 'mov-1',
    type: 'ENTRADA',
    date: '2026-09-02T08:30',
    productId: 'prod-1',
    productSku: 'RAW-ALU-6061',
    productName: 'Barra Redonda Alumínio 6061-T6 (Ø 2" x 3000mm)',
    quantity: 50,
    unit: 'Peça',
    supplier: 'AluBrasil Metais e Ligas Eireli',
    unitPrice: 85.50,
    totalPrice: 4275.00,
    invoiceNumber: 'NF-e 048.912',
    balanceAfter: 50,
    notes: 'Recebimento de lote com certificado de qualidade de matéria-prima.',
    createdAt: '2026-09-02T08:35:00.000Z'
  },
  // 2ª Entrada
  {
    id: 'mov-2',
    type: 'ENTRADA',
    date: '2026-09-03T10:15',
    productId: 'prod-2',
    productSku: 'CMP-ROL-6204',
    productName: 'Rolamento Rígido de Esferas SKF 6204-2RSH',
    quantity: 80,
    unit: 'Unidade',
    supplier: 'Distribuidora Paulista de Rolamentos Ltda',
    unitPrice: 42.00,
    totalPrice: 3360.00,
    invoiceNumber: 'NF-e 012.304',
    balanceAfter: 80,
    notes: 'Reposição para montagem dos redutores da linha 2.',
    createdAt: '2026-09-03T10:20:00.000Z'
  },
  // 3ª Entrada (Extra para enriquecer)
  {
    id: 'mov-3',
    type: 'ENTRADA',
    date: '2026-09-04T14:00',
    productId: 'prod-3',
    productSku: 'FLU-OLE-VG68',
    productName: 'Óleo Lubrificante Hidráulico Mineral ISO VG 68',
    quantity: 40,
    unit: 'Litro',
    supplier: 'PetroSupply Distribuidora de Lubrificantes',
    unitPrice: 28.50,
    totalPrice: 1140.00,
    invoiceNumber: 'NF-e 077.419',
    balanceAfter: 40,
    notes: 'Tambores lacrados de 20L para uso fabril.',
    createdAt: '2026-09-04T14:05:00.000Z'
  },
  // 1ª Saída (Teste obrigatório 1)
  {
    id: 'mov-4',
    type: 'SAIDA',
    date: '2026-09-05T09:00',
    productId: 'prod-1',
    productSku: 'RAW-ALU-6061',
    productName: 'Barra Redonda Alumínio 6061-T6 (Ø 2" x 3000mm)',
    quantity: 15,
    unit: 'Peça',
    sectorId: 'sec-1',
    sectorName: 'Usinagem',
    requesterName: 'Eng. Carlos Eduardo Mendes',
    reason: 'Ordem de Produção OP-4091 (Eixos usinados do redutor)',
    requisitionNumber: 'REQ-2026-001',
    balanceAfter: 35, // 50 - 15 = 35
    notes: 'Material entregue ao operador do Torno CNC 02.',
    createdAt: '2026-09-05T09:10:00.000Z'
  },
  // 2ª Saída (Teste obrigatório 2)
  {
    id: 'mov-5',
    type: 'SAIDA',
    date: '2026-09-06T11:20',
    productId: 'prod-2',
    productSku: 'CMP-ROL-6204',
    productName: 'Rolamento Rígido de Esferas SKF 6204-2RSH',
    quantity: 25,
    unit: 'Unidade',
    sectorId: 'sec-2',
    sectorName: 'Montagem Final',
    requesterName: 'Amanda Souza Ribeiro',
    reason: 'Ordem de Produção OP-4093 (Montagem de 12 esteiras transportadoras)',
    requisitionNumber: 'REQ-2026-001',
    balanceAfter: 55, // 80 - 25 = 55
    notes: 'Conferido no balcão 01 do almoxarifado.',
    createdAt: '2026-09-06T11:25:00.000Z'
  },
  // 3ª Saída (Teste obrigatório 3)
  {
    id: 'mov-6',
    type: 'SAIDA',
    date: '2026-09-07T15:45',
    productId: 'prod-3',
    productSku: 'FLU-OLE-VG68',
    productName: 'Óleo Lubrificante Hidráulico Mineral ISO VG 68',
    quantity: 10,
    unit: 'Litro',
    sectorId: 'sec-5',
    sectorName: 'Manutenção',
    requesterName: 'Silvana Duarte Castro',
    reason: 'Manutenção Corretiva na Prensa Hidráulica P-02 (Troca preventiva)',
    requisitionNumber: 'REQ-2026-002',
    balanceAfter: 30, // 40 - 10 = 30 (CRÍTICO: min 50!)
    notes: 'Retirada emergencial para evitar parada de linha.',
    createdAt: '2026-09-07T15:50:00.000Z'
  }
];

export const INITIAL_REQUISITIONS: Requisition[] = [
  {
    id: 'req-1',
    requisitionNumber: 'REQ-2026-001',
    date: '2026-09-05T08:45',
    sectorId: 'sec-1',
    sectorName: 'Usinagem',
    requesterName: 'Eng. Carlos Eduardo Mendes',
    requesterRegistration: 'MAT-1042',
    warehouseManager: 'Roberto Guimarães da Silva',
    warehouseManagerRegistration: 'MAT-0512',
    reason: 'Atendimento do Plano Mestre de Produção - Ordem de Serviço OP-4091',
    status: 'ATENDIDA',
    items: [
      {
        id: 'req-item-1',
        productId: 'prod-1',
        productSku: 'RAW-ALU-6061',
        productName: 'Barra Redonda Alumínio 6061-T6 (Ø 2" x 3000mm)',
        unit: 'Peça',
        quantity: 15,
        unitCost: 85.50,
        totalCost: 1282.50,
        availableStock: 50,
        purpose: 'Usinagem seriada de eixos motrizes de alumínio.'
      },
      {
        id: 'req-item-2',
        productId: 'prod-2',
        productSku: 'CMP-ROL-6204',
        productName: 'Rolamento Rígido de Esferas SKF 6204-2RSH',
        unit: 'Unidade',
        quantity: 25,
        unitCost: 42.00,
        totalCost: 1050.00,
        availableStock: 80,
        purpose: 'Conjunto de rolamentos de mancal.'
      }
    ],
    totalEstimatedCost: 2332.50,
    notes: 'Material inspecionado fisicamente e liberado conforme normas ISO 9001.',
    dispatchedAt: '2026-09-05T09:10:00.000Z'
  },
  {
    id: 'req-2',
    requisitionNumber: 'REQ-2026-002',
    date: '2026-09-07T15:30',
    sectorId: 'sec-5',
    sectorName: 'Manutenção',
    requesterName: 'Silvana Duarte Castro',
    requesterRegistration: 'MAT-1334',
    warehouseManager: 'Roberto Guimarães da Silva',
    warehouseManagerRegistration: 'MAT-0512',
    reason: 'Manutenção Corretiva na Prensa Hidráulica P-02 (Troca preventiva)',
    status: 'ATENDIDA',
    items: [
      {
        id: 'req-item-3',
        productId: 'prod-3',
        productSku: 'FLU-OLE-VG68',
        productName: 'Óleo Lubrificante Hidráulico Mineral ISO VG 68',
        unit: 'Litro',
        quantity: 10,
        unitCost: 28.50,
        totalCost: 285.00,
        availableStock: 40,
        purpose: 'Carga de complementação do reservatório principal de fluido.'
      }
    ],
    totalEstimatedCost: 285.00,
    notes: 'Prioridade alta para liberação de máquina crítica.',
    dispatchedAt: '2026-09-07T15:50:00.000Z'
  }
];
