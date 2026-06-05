import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProdutos()
  }, [currentPage])

  const fetchProdutos = async () => {
    try {
      const response = await api.get(`/produtos?page=${currentPage}`)
      setProdutos(response.data.data)
      setLastPage(response.data.meta.last_page)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      await api.delete(`/produtos/${id}`)
      fetchProdutos()
    } catch (error) {
      alert('Erro ao excluir produto')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Meus Produtos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.nome}</span>
              <button
                onClick={() => navigate('/produtos/novo')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                + Novo Produto
              </button>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">{produto.nome}</h3>
                {produto.descricao && (
                  <p className="text-sm text-gray-600 mt-1">{produto.descricao}</p>
                )}
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Preço:</span> R$ {parseFloat(produto.preco).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Estoque:</span> {produto.estoque} unidades
                  </p>
                  {produto.categoria && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Categoria:</span> {produto.categoria}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {produtos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
              <button
                onClick={() => navigate('/produtos/novo')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cadastrar primeiro produto
              </button>
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                Página {currentPage} de {lastPage}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                disabled={currentPage === lastPage}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}