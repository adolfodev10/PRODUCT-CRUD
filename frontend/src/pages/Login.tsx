import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ShoppingBag } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Auto-fill demo credentials for testing
  const fillDemoCredentials = () => {
    setEmail('admin@exemplo.com')
    setPassword('123456')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Por favor, informe seu email')
      return
    }
    if (!password) {
      setError('Por favor, informe sua senha')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      await login(email, password)
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true')
      }
      
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Email ou senha inválidos'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="max-w-md w-full mx-auto">
        {/* Logo/Brand - Responsivo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Product CRUD
          </h2>
          <p className="text-sm text-gray-600 mt-1 sm:mt-2 px-2">
            Gerencie seus produtos de forma simples e eficiente
          </p>
        </div>

        {/* Login Card - Responsivo */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-0">
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
              Bem-vindo de volta!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Faça login para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Demo Credentials */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-600">
                  Lembrar-me
                </span>
              </label>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Usar credenciais demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs text-gray-500 px-2">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  )
}