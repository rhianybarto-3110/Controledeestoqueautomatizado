import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductManagement } from './components/ProductManagement';
import { SectorManagement } from './components/SectorManagement';
import { StockMovements } from './components/StockMovements';
import { StockReport } from './components/StockReport';
import { RequisitionManagement } from './components/RequisitionManagement';
import { ProductModal } from './components/ProductModal';
import { SectorModal } from './components/SectorModal';
import { MovementModal } from './components/MovementModal';
import { RequisitionModal } from './components/RequisitionModal';
import { RequisitionDocument } from './components/RequisitionDocument';
import { TestGuideModal } from './components/TestGuideModal';
import { StorageService } from './utils/storage';
import { Product, Sector, StockMovement, Requisition, ActiveTab, MovementType } from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modais
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementDefaultType, setMovementDefaultType] = useState<MovementType>('ENTRADA');
  const [movementDefaultProductId, setMovementDefaultProductId] = useState<string>('');

  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [selectedRequisitionForDoc, setSelectedRequisitionForDoc] = useState<Requisition | null>(null);

  const [isTestGuideOpen, setIsTestGuideOpen] = useState(false);
  const [initialSectorFilter, setInitialSectorFilter] = useState<string>('TODOS');

  // Notificação Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Carregar dados na inicialização
  useEffect(() => {
    StorageService.initializeStorage();
    loadAllData();
  }, []);

  const loadAllData = () => {
    setProducts(StorageService.getProducts());
    setSectors(StorageService.getSectors());
    setMovements(StorageService.getMovements());
    setRequisitions(StorageService.getRequisitions());
  };

  // Reset para dados de demonstração
  const handleResetToDefaults = () => {
    const fresh = StorageService.resetToDefaults();
    setProducts(fresh.products);
    setSectors(fresh.sectors);
    setMovements(fresh.movements);
    setRequisitions(fresh.requisitions);
    showToast('Cenário de teste oficial da InovaTech recarregado com sucesso!');
  };

  // Handler para Salvar Produto
  const handleSaveProduct = (productData: any) => {
    const currentList = [...products];
    if (productData.id) {
      // Editar
      const idx = currentList.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        currentList[idx] = {
          ...currentList[idx],
          ...productData
        };
        StorageService.saveProducts(currentList);
        setProducts(currentList);
        showToast(`Produto "${productData.name}" atualizado.`);
      }
    } else {
      // Novo
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        sku: productData.sku,
        name: productData.name,
        category: productData.category,
        unit: productData.unit,
        minStock: productData.minStock,
        maxStock: productData.maxStock,
        unitCost: productData.unitCost,
        currentStock: productData.initialStock || 0,
        location: productData.location,
        description: productData.description,
        createdAt: new Date().toISOString()
      };
      const updatedList = [newProd, ...currentList];
      StorageService.saveProducts(updatedList);
      setProducts(updatedList);

      // Se tiver saldo inicial > 0, registrar movimentação de entrada inicial
      if (newProd.currentStock > 0) {
        StorageService.recordMovement({
          type: 'ENTRADA',
          date: new Date().toISOString().substring(0, 16),
          productId: newProd.id,
          quantity: newProd.currentStock,
          supplier: 'Implantação de Saldo Inicial de Estoque',
          unitPrice: newProd.unitCost,
          notes: 'Inventário físico inicial de implantação do sistema'
        });
        setMovements(StorageService.getMovements());
      }

      showToast(`Produto "${newProd.name}" cadastrado com sucesso!`);
    }
  };

  // Handler para Salvar Setor
  const handleSaveSector = (sectorData: any) => {
    const currentList = [...sectors];
    if (sectorData.id) {
      const idx = currentList.findIndex(s => s.id === sectorData.id);
      if (idx !== -1) {
        currentList[idx] = {
          ...currentList[idx],
          ...sectorData
        };
        StorageService.saveSectors(currentList);
        setSectors(currentList);
        showToast(`Setor "${sectorData.name}" atualizado.`);
      }
    } else {
      const newSec: Sector = {
        id: `sec-${Date.now()}`,
        name: sectorData.name,
        managerName: sectorData.managerName,
        managerRegistration: sectorData.managerRegistration,
        costCenter: sectorData.costCenter,
        notes: sectorData.notes
      };
      const updatedList = [...currentList, newSec];
      StorageService.saveSectors(updatedList);
      setSectors(updatedList);
      showToast(`Setor "${newSec.name}" cadastrado.`);
    }
  };

  // Handler para Registrar Movimentação
  const handleRecordMovement = (params: any) => {
    const res = StorageService.recordMovement(params);
    if (res.success) {
      loadAllData();
      showToast(
        params.type === 'ENTRADA'
          ? `Entrada registrada com sucesso (+${params.quantity})! Saldo atualizado.`
          : `Saída registrada com sucesso (-${params.quantity})! Saldo atualizado.`
      );
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  // Handler para Emitir Requisição
  const handleCreateRequisition = (params: any) => {
    const res = StorageService.createRequisition(params);
    if (res.success && res.requisition) {
      loadAllData();
      showToast(`Requisição ${res.requisition.requisitionNumber} emitida com sucesso! Estoque baixado.`);
      setSelectedRequisitionForDoc(res.requisition);
      return { success: true, requisition: res.requisition };
    } else {
      return { success: false, error: res.error };
    }
  };

  // Abertura com pré-configuração
  const handleOpenMovementModal = (type: MovementType = 'ENTRADA', productId?: string) => {
    setMovementDefaultType(type);
    setMovementDefaultProductId(productId || '');
    setIsMovementModalOpen(true);
  };

  const handleSelectSectorMovements = (sectorId: string) => {
    setInitialSectorFilter(sectorId);
    setActiveTab('movements');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 no-print">
          <div className={`p-3.5 rounded-xl shadow-lg border flex items-center space-x-3 text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-slate-900 text-white border-slate-800' 
              : 'bg-rose-600 text-white border-rose-700'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Cabeçalho Principal e Navegação */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        products={products}
        onOpenNewMovement={() => handleOpenMovementModal('ENTRADA')}
        onOpenNewRequisition={() => setIsRequisitionModalOpen(true)}
        onOpenTestGuide={() => setIsTestGuideOpen(true)}
        onResetData={handleResetToDefaults}
      />

      {/* Conteúdo da Tela */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            products={products}
            sectors={sectors}
            movements={movements}
            requisitions={requisitions}
            onNavigateTab={setActiveTab}
            onOpenNewMovement={handleOpenMovementModal}
            onOpenNewRequisition={() => setIsRequisitionModalOpen(true)}
            onViewRequisition={(req) => setSelectedRequisitionForDoc(req)}
            onOpenTestGuide={() => setIsTestGuideOpen(true)}
          />
        )}

        {activeTab === 'products' && (
          <ProductManagement
            products={products}
            onAddProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsProductModalOpen(true);
            }}
            onQuickMovement={(productId, type) => {
              handleOpenMovementModal(type, productId);
            }}
          />
        )}

        {activeTab === 'sectors' && (
          <SectorManagement
            sectors={sectors}
            movements={movements}
            onAddSector={() => {
              setEditingSector(null);
              setIsSectorModalOpen(true);
            }}
            onEditSector={(s) => {
              setEditingSector(s);
              setIsSectorModalOpen(true);
            }}
            onSelectSectorMovements={handleSelectSectorMovements}
          />
        )}

        {activeTab === 'movements' && (
          <StockMovements
            movements={movements}
            requisitions={requisitions}
            onOpenMovementModal={(t) => handleOpenMovementModal(t || 'ENTRADA')}
            onViewRequisition={(req) => setSelectedRequisitionForDoc(req)}
            initialSectorFilter={initialSectorFilter}
          />
        )}

        {activeTab === 'reports' && (
          <StockReport
            products={products}
            movements={movements}
            onQuickMovement={(productId, type) => handleOpenMovementModal(type, productId)}
          />
        )}

        {activeTab === 'requisitions' && (
          <RequisitionManagement
            requisitions={requisitions}
            onOpenNewRequisition={() => setIsRequisitionModalOpen(true)}
            onViewDocument={(req) => setSelectedRequisitionForDoc(req)}
          />
        )}
      </main>

      {/* Rodapé Corporativo */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>InovaTech Manufatura S.A. • Gestão e Controle Operacional de Estoques</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsTestGuideOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Roteiro de Testes Obrigatórios
            </button>
            <span>•</span>
            <button
              onClick={handleResetToDefaults}
              className="text-slate-500 hover:text-slate-800"
            >
              Restaurar Dados Originais
            </button>
          </div>
        </div>
      </footer>

      {/* Modais Globais */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <SectorModal
        isOpen={isSectorModalOpen}
        onClose={() => setIsSectorModalOpen(false)}
        onSave={handleSaveSector}
        editingSector={editingSector}
      />

      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        products={products}
        sectors={sectors}
        defaultType={movementDefaultType}
        defaultProductId={movementDefaultProductId}
        onRecordMovement={handleRecordMovement}
      />

      <RequisitionModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        products={products}
        sectors={sectors}
        onCreateRequisition={handleCreateRequisition}
        onSuccess={(req) => setSelectedRequisitionForDoc(req)}
      />

      {/* Visualização de Documento Formal de Requisição para Impressão */}
      <RequisitionDocument
        requisition={selectedRequisitionForDoc}
        onClose={() => setSelectedRequisitionForDoc(null)}
      />

      {/* Modal Guiado de Demonstração e Testes Obrigatórios */}
      <TestGuideModal
        isOpen={isTestGuideOpen}
        onClose={() => setIsTestGuideOpen(false)}
        products={products}
        sectors={sectors}
        movements={movements}
        requisitions={requisitions}
        onNavigateTab={setActiveTab}
        onOpenRequisitionDoc={(req) => setSelectedRequisitionForDoc(req)}
        onResetData={handleResetToDefaults}
      />
    </div>
  );
}
