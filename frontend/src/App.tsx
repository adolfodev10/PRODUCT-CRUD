import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProductForm from './pages/ProductForm'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/produtos/novo" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/produtos/editar/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App