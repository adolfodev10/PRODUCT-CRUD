import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProductForm from './pages/ProductForm'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminDashboard from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<PrivateRoute requiredAdmin={true}>
            <AdminDashboard />
            </PrivateRoute>
          } 
          />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/produtos/novo" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/produtos/editar/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App