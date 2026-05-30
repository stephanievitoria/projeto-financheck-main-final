import { Plus, ChevronRight, Search, X, Pencil, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { TransactionModal } from './TransactionModal';
import { TransactionsExpandedModal } from './TransactionsExpandedModal';
import { useTransactions } from '@/app/context/TransactionsContext';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function TransactionsList() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading, errorMessage } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<typeof transactions[number] | null>(null);

  // Inicializa com o mês atual
  const currentMonth = new Date().getMonth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));
    return uniqueCategories.sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filtro de busca por nome (case-insensitive)
      const matchesSearch = searchTerm === '' ||
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // Filtro por mês - sempre filtra (padrão é mês atual)
      const matchesMonth = transaction.month === parseInt(selectedMonth);

      // Filtro por categoria
      const matchesCategory = selectedCategory === '' ||
        transaction.category === selectedCategory;

      return matchesSearch && matchesMonth && matchesCategory;
    });
  }, [transactions, searchTerm, selectedMonth, selectedCategory]);

  // Verifica se há filtros ativos além do mês atual
  const hasActiveFilters = searchTerm !== '' || selectedMonth !== currentMonth.toString() || selectedCategory !== '';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMonth(currentMonth.toString()); // Volta para o mês atual
    setSelectedCategory('');
  };
  return (
    <div className="relative bg-white/70 backdrop-blur-3xl rounded-3xl md:rounded-[32px] px-4 py-6 md:px-12 md:py-10 shadow-[0_20px_60px_rgba(91,143,232,0.15),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_24px_70px_rgba(91,143,232,0.2),0_0_0_1px_rgba(255,255,255,0.6)_inset] transition-all duration-500 border-2 border-white/60 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-3xl md:rounded-[32px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl md:rounded-[32px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-1 md:w-1.5 h-5 md:h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
            <h2 className="text-[#2E4A7C] text-xl md:text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Transações</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsExpandedModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[#7BA8F5] hover:text-[#4A7BD8] hover:bg-white/60 hover:backdrop-blur-xl hover:border-white/70 hover:shadow-[0_4px_20px_rgba(123,168,245,0.15),0_1px_4px_rgba(255,255,255,0.4)_inset] transition-all duration-300 group border-2 border-transparent text-xs md:text-sm"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              Ver mais
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300 md:hidden" strokeWidth={2.5} />
              <ChevronRight size={16} className="hidden md:block group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
              className="relative flex items-center gap-2 md:gap-2.5 px-5 py-3 md:px-8 md:py-3.5 rounded-full bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] text-white shadow-[0_10px_36px_rgba(123,168,245,0.45)] hover:shadow-[0_14px_48px_rgba(123,168,245,0.55)] hover:translate-y-[-2px] hover:scale-[1.03] transition-all duration-300 border-2 border-white/30 overflow-hidden group text-xs md:text-sm"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus size={15} strokeWidth={2.5} className="relative md:hidden" />
              <Plus size={17} strokeWidth={2.5} className="relative hidden md:block" />
              <span className="relative">Nova transação</span>
            </button>
          </div>
        </div>

        <div className="mb-4 md:mb-6 space-y-2 md:space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search size={16} className="text-[#7BA8F5] md:hidden" strokeWidth={2.5} />
                <Search size={18} className="text-[#7BA8F5] hidden md:block" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar transação..."
                className="w-full pl-10 pr-4 py-2.5 md:pl-12 md:pr-5 md:py-3 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300 text-xs md:text-sm"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              />
            </div>

            <select
              aria-label="Mês da transação"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300 appearance-none cursor-pointer text-xs md:text-sm"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index.toString()}>
                  {month}{index === currentMonth ? ' (atual)' : ''}
                </option>
              ))}
            </select>

            <select
              aria-label="Categoria da transação"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300 appearance-none cursor-pointer text-xs md:text-sm"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-2xl md:rounded-[16px] bg-white/50 backdrop-blur-xl border-2 border-white/60 transition-all duration-300 ease-out">
              <p className="text-[#2E4A7C] text-[11px] md:text-[13px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação encontrada' : 'transações encontradas'}
                {searchTerm && ` • Busca: "${searchTerm}"`}
                {selectedMonth !== currentMonth.toString() && ` • Mês: ${MONTHS[parseInt(selectedMonth)]}`}
                {selectedCategory && ` • Categoria: ${selectedCategory}`}
              </p>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[#7BA8F5] hover:text-[#4A7BD8] hover:bg-white/60 transition-all duration-300 group text-[11px] md:text-[13px]"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                <X size={12} strokeWidth={2.5} className="md:hidden" />
                <X size={14} strokeWidth={2.5} className="hidden md:block" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-2xl bg-[#FF6B6B]/10 px-4 py-3 text-[#FF6B6B] text-sm">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-12 md:py-16 text-center text-[#7BA8F5]">
            Carregando transações...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-12 md:py-16 text-center transition-opacity duration-500 ease-out">
            <div className="mb-3 md:mb-4 flex justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center border-2 border-white/70 shadow-[0_8px_32px_rgba(123,168,245,0.2)]">
                <Search size={20} className="text-[#7BA8F5] md:hidden" strokeWidth={2} />
                <Search size={24} className="text-[#7BA8F5] hidden md:block" strokeWidth={2} />
              </div>
            </div>
            <p className="text-[#2E4A7C] mb-1.5 md:mb-2 text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {selectedMonth === currentMonth.toString() && searchTerm === '' && selectedCategory === ''
                ? 'Nenhuma transação neste mês'
                : 'Nenhuma transação encontrada'}
            </p>
            <p className="text-[#7BA8F5] text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              {selectedMonth === currentMonth.toString() && searchTerm === '' && selectedCategory === ''
                ? 'Adicione sua primeira transação deste mês'
                : 'Tente ajustar os filtros de busca'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {filteredTransactions.map((transaction) => {
          const Icon = transaction.icon;
          const isPositive = transaction.amount > 0;

          return (
            <div
              key={transaction.id}
              className="group relative flex items-center justify-between px-3 py-3 md:px-6 md:py-5 rounded-2xl md:rounded-[20px] hover:bg-white/60 hover:backdrop-blur-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-white/70 hover:shadow-[0_8px_28px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.5)_inset]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 rounded-2xl md:rounded-[20px] transition-opacity duration-300"></div>

              <div className="relative flex items-center gap-3 md:gap-5">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 ${
                    isPositive
                      ? 'bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8]'
                      : 'bg-gradient-to-br from-[#C5D9F5] to-[#E5EEFB]'
                  }`}></div>
                  <div className={`relative w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl group-hover:scale-105 ${
                    isPositive
                      ? 'bg-white/60 border-2 border-white/70 shadow-[0_6px_24px_rgba(123,168,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]'
                      : 'bg-white/60 border-2 border-white/70 shadow-[0_6px_24px_rgba(197,217,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]'
                  }`}>
                    <Icon size={17} className={`${isPositive ? 'text-[#4A7BD8]' : 'text-[#5B8FE8]'} md:hidden`} strokeWidth={2.5} />
                    <Icon size={20} className={`${isPositive ? 'text-[#4A7BD8]' : 'text-[#5B8FE8]'} hidden md:block`} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[#2E4A7C] mb-0.5 md:mb-1.5 truncate text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, lineHeight: '1.3' }}>{transaction.name}</p>
                  <p className="text-[#7BA8F5] truncate text-[11px] md:text-[13px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, opacity: 0.85 }}>{transaction.category}</p>
                </div>
              </div>

              <div className="relative text-right flex-shrink-0">
                <p className={`mb-0.5 md:mb-1.5 text-sm md:text-lg ${isPositive ? 'text-[#4A7BD8]' : 'text-[#2E4A7C]'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.6px' }}>
                  {isPositive ? '+' : ''}{transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-[#7BA8F5] text-[10px] md:text-[13px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, opacity: 0.9 }}>{transaction.date}</p>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setIsModalOpen(true);
                    }}
                    aria-label="Editar transação"
                    title="Editar"
                    className="h-8 w-8 rounded-full bg-white/70 inline-flex items-center justify-center text-[#4A7BD8] hover:bg-white"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTransaction(transaction.id)}
                    aria-label="Excluir transação"
                    title="Excluir"
                    className="h-8 w-8 rounded-full bg-white/70 inline-flex items-center justify-center text-[#FF6B6B] hover:bg-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        initialTransaction={editingTransaction}
        onSubmit={(transaction) => (
          editingTransaction
            ? updateTransaction(editingTransaction.id, transaction)
            : addTransaction(transaction)
        )}
      />

      <TransactionsExpandedModal
        isOpen={isExpandedModalOpen}
        onClose={() => setIsExpandedModalOpen(false)}
        transactions={filteredTransactions}
      />
    </div>
  );
}
