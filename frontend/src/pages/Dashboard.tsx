import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Package,
  Plus,
  LogOut,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Box,
  Tag,
  User,
  ShoppingBag,
  Shield,
  Search,
  Grid3X3,
  List,
  AlertCircle,
  CheckCircle,
  XCircle,
  Coins
} from 'lucide-react'
import api from '../services/api'

interface Product {
  id: number
  nome: string
  descricao: string | null
  preco: number
  estoque: number
  categoria: string | null
  created_at: string
  updated_at: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProdutos()
  }, [currentPage])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/produtos?page=${currentPage}`)
      setProdutos(response.data.data)
      setMeta({
        current_page: response.data.current_page || response.data.meta?.current_page || 1,
        last_page: response.data.last_page || response.data.meta?.last_page || 1,
        per_page: response.data.per_page || response.data.meta?.per_page || 10,
        total: response.data.total || response.data.meta?.total || 0
      })
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showToast('Erro ao carregar produtos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/produtos/${id}`)
      showToast('Produto excluído com sucesso!', 'success')
      fetchProdutos()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      showToast('Erro ao excluir produto', 'error')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  const getStockStatus = (estoque: number) => {
    if (estoque === 0) return { label: 'Esgotado', color: 'bg-red-100 text-red-800', icon: XCircle }
    if (estoque < 5) return { label: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    return { label: 'Em Estoque', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  }

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.categoria && produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus produtos...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white text-sm sm:text-base`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-auto sm:h-16 py-2 sm:py-0 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Meus Produtos
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {meta.total} produto{meta.total !== 1 ? 's' : ''} cadastrado{meta.total !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>

              {user?.is_admin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-1 sm:gap-2 shadow-md"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </button>
              )}

              <button
                onClick={() => navigate('/produtos/novo')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-1 sm:gap-2 shadow-md"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Novo Produto</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-red-50"
                title="Sair"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              title="Visualizar em grade"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              title="Visualizar em tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredProdutos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              {searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando seu primeiro produto'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/produtos/novo')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center gap-2 shadow-md text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Cadastrar primeiro produto
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProdutos.map((produto) => {
                  const StockIcon = getStockStatus(produto.estoque).icon
                  return (
                    <div
                      key={produto.id}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm sm:text-base">
                            {produto.nome}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStockStatus(produto.estoque).color}`}>
                            <StockIcon className="w-3 h-3" />
                            {getStockStatus(produto.estoque).label}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {produto.descricao && (
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{produto.descricao}</p>
                        )}

                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                              <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Preço</span>
                            </div>
                            <span className="text-base sm:text-lg font-bold text-blue-600">
                              {formatCurrency(produto.preco)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                              <Box className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Estoque</span>
                            </div>
                            <span className="font-medium text-gray-900 text-sm sm:text-base">{produto.estoque} un.</span>
                          </div>

                          {produto.categoria && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Categoria</span>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-700">{produto.categoria}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                          className="flex-1 py-2 sm:py-2.5 text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          Editar
                        </button>
                        {deleteConfirm === produto.id ? (
                          <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-red-50 py-2 sm:py-2.5">
                            <span className="text-xs text-gray-600">Confirmar?</span>
                            <button
                              onClick={() => handleDelete(produto.id)}
                              className="text-red-600 hover:text-red-700 text-xs font-medium"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-gray-500 hover:text-gray-600 text-xs font-medium"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(produto.id)}
                            className="flex-1 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium border-l border-gray-100"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {viewMode === 'table' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[768px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Categoria</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProdutos.map((produto) => {
                        const StockIcon = getStockStatus(produto.estoque).icon
                        return (
                          <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{produto.nome}</p>
                                {produto.descricao && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{produto.descricao}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                              <span className="text-sm text-gray-600">{produto.categoria || '-'}</span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className="font-semibold text-blue-600 text-sm sm:text-base">
                                {formatCurrency(produto.preco)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className="text-sm text-gray-700">{produto.estoque} un.</span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(produto.estoque).color}`}>
                                <StockIcon className="w-3 h-3" />
                                {getStockStatus(produto.estoque).label}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                                  className="text-yellow-600 hover:text-yellow-700 transition-colors p-1"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {deleteConfirm === produto.id ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">Confirmar?</span>
                                    <button
                                      onClick={() => handleDelete(produto.id)}
                                      className="text-red-600 hover:text-red-700 text-xs"
                                    >
                                      Sim
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm(null)}
                                      className="text-gray-500 hover:text-gray-600 text-xs"
                                    >
                                      Não
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirm(produto.id)}
                                    className="text-red-600 hover:text-red-700 transition-colors p-1"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {meta.last_page > 1 && (
              <div className="flex justify-center items-center space-x-2 sm:space-x-3 mt-8 sm:mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Anterior
                </button>
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                    let pageNum = currentPage
                    if (meta.last_page <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= meta.last_page - 2) {
                      pageNum = meta.last_page - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-all text-sm sm:text-base ${currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={currentPage === meta.last_page}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  Próxima
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}