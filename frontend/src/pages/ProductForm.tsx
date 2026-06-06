import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X, Package, DollarSign, Layers, Archive, FileText, AlertCircle, Smartphone, Shirt, Book, Apple, Sparkles, Bike, Box } from 'lucide-react'
import api from '../services/api'

interface ProductFormData {
  nome: string
  descricao: string
  preco: string
  estoque: string
  categoria: string
}

interface ValidationErrors {
  nome?: string[]
  preco?: string[]
  estoque?: string[]
  categoria?: string[]
  descricao?: string[]
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState<ProductFormData>({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoria: ''
  })

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/produtos/${id}`)
      setFormData({
        nome: response.data.nome || '',
        descricao: response.data.descricao || '',
        preco: response.data.preco?.toString() || '',
        estoque: response.data.estoque?.toString() || '',
        categoria: response.data.categoria || ''
      })
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      showToast('Erro ao carregar dados do produto', 'error')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      setSuccessMessage(message)
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      alert(message)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = ['O nome do produto é obrigatório']
    } else if (formData.nome.length < 3) {
      newErrors.nome = ['O nome deve ter pelo menos 3 caracteres']
    } else if (formData.nome.length > 255) {
      newErrors.nome = ['O nome deve ter no máximo 255 caracteres']
    }

    if (!formData.preco) {
      newErrors.preco = ['O preço é obrigatório']
    } else if (parseFloat(formData.preco) <= 0) {
      newErrors.preco = ['O preço deve ser maior que zero']
    }

    if (!formData.estoque) {
      newErrors.estoque = ['O estoque é obrigatório']
    } else if (parseInt(formData.estoque) < 0) {
      newErrors.estoque = ['O estoque não pode ser negativo']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast('Por favor, corrija os erros no formulário', 'error')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const payload = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque)
      }

      if (id) {
        await api.put(`/produtos/${id}`, payload)
        showToast('Produto atualizado com sucesso!', 'success')
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        await api.post('/produtos', payload)
        showToast('Produto criado com sucesso!', 'success')
        resetForm()
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
        showToast('Por favor, corrija os erros no formulário', 'error')
      } else {
        showToast(error.response?.data?.message || 'Erro ao salvar produto', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      estoque: '',
      categoria: ''
    })
    setErrors({})
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Toast - Responsivo */}
        {successMessage && (
          <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 animate-slide-in-right">
            <div className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-green-500 flex items-center justify-center text-xs sm:text-sm">✓</div>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header - Responsivo */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {id ? 'Editar Produto' : 'Novo Produto'}
                  </h1>
                  <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    {id ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10 rounded-lg p-1.5 sm:p-2 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Form Body - Responsivo */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
            {/* Nome do Produto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <span className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  Nome do Produto
                </span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Smartphone XYZ, Notebook Gamer, etc."
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  errors.nome 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.nome && (
                <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{errors.nome[0]}</span>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  Descrição
                </span>
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva as características do produto..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                    Preço
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    placeholder="0,00"
                    className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                      errors.preco 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {formData.preco && (
                  <p className="mt-1 text-xs text-gray-500">
                    Valor formatado: {formatCurrency(formData.preco)}
                  </p>
                )}
                {errors.preco && (
                  <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{errors.preco[0]}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                    Estoque
                  </span>
                </label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  placeholder="Quantidade em estoque"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    errors.estoque 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.estoque && (
                  <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{errors.estoque[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  Categoria
                </span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm sm:text-base"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Eletrônicos">
                  <p>

                  <Smartphone className='bg-red-500' />
                   Eletrônicos
                  </p>
                   </option>
                <option value="Roupas">👕 Roupas</option>
                <option value="Livros">📚 Livros</option>
                <option value="Alimentos">🍔 Alimentos</option>
                <option value="Beleza">💄 Beleza</option>
                <option value="Esportes">⚽ Esportes</option>
                <option value="Outros">📦 Outros</option>
              </select>
            </div>

            {/* Form Actions - Responsivo */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {id ? 'Atualizando...' : 'Salvando...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      {id ? 'Atualizar Produto' : 'Cadastrar Produto'}
                    </>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
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
      `}</style>
    </div>
  )
}