import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X, Package, DollarSign, Layers, Archive, FileText, AlertCircle } from 'lucide-react'
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
    
    // Clear field error when user starts typing
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Toast */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white text-green-500 flex items-center justify-center">✓</div>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {id ? 'Editar Produto' : 'Novo Produto'}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {id ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Nome do Produto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Nome do Produto
                </span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Smartphone XYZ, Notebook Gamer, etc."
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nome 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.nome && (
                <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.nome[0]}</span>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Descrição
                </span>
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva as características do produto..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Preço
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    placeholder="0,00"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.preco[0]}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-blue-600" />
                    Estoque
                  </span>
                </label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  placeholder="Quantidade em estoque"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.estoque 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.estoque && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.estoque[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Categoria
                </span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Eletrônicos"> Eletrônicos</option>
                <option value="Roupas">Roupas</option>
                <option value="Livros">Livros</option>
                <option value="Alimentos"> Alimentos</option>
                <option value="Beleza"> Beleza</option>
                <option value="Esportes"> Esportes</option>
                <option value="Outros"> Outros</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {id ? 'Atualizando...' : 'Salvando...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {id ? 'Atualizar Produto' : 'Cadastrar Produto'}
                    </>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
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