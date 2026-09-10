import React, { useState, useEffect } from 'react';
import { X, Users, AlertCircle } from 'lucide-react';
import { Sector } from '../types';

interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sector: Omit<Sector, 'id'> & { id?: string }) => void;
  editingSector?: Sector | null;
}

export const SectorModal: React.FC<SectorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSector
}) => {
  const [name, setName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerRegistration, setManagerRegistration] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingSector) {
      setName(editingSector.name);
      setManagerName(editingSector.managerName);
      setManagerRegistration(editingSector.managerRegistration);
      setCostCenter(editingSector.costCenter || '');
      setNotes(editingSector.notes || '');
    } else {
      setName('');
      setManagerName('');
      setManagerRegistration('');
      setCostCenter('');
      setNotes('');
    }
    setError(null);
  }, [editingSector, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('O nome do setor/departamento é obrigatório.');
      return;
    }
    if (!managerName.trim()) {
      setError('O nome do responsável pelo setor é obrigatório.');
      return;
    }
    if (!managerRegistration.trim()) {
      setError('A matrícula funcional do responsável é obrigatória.');
      return;
    }

    onSave({
      id: editingSector?.id,
      name: name.trim(),
      managerName: managerName.trim(),
      managerRegistration: managerRegistration.trim().toUpperCase(),
      costCenter: costCenter.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingSector ? 'Editar Setor Industrial' : 'Novo Setor / Departamento'}
              </h3>
              <p className="text-xs text-slate-500">
                InovaTech Manufatura S.A. - Estrutura Organizacional
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Setor / Linha Produtiva <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Usinagem, Montagem Final, Pintura, Manutenção..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsável <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Ex: Carlos Mendes"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula Funcional <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={managerRegistration}
                onChange={(e) => setManagerRegistration(e.target.value)}
                placeholder="Ex: MAT-1042"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Centro de Custo (Opcional)
            </label>
            <input
              type="text"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              placeholder="Ex: CC-301 - Usinagem CNC"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Finalidade / Observações do Setor
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Responsável por máquinas CNC e fabricação de eixos mecânicos"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
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
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              {editingSector ? 'Salvar Setor' : 'Cadastrar Setor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
