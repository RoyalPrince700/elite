import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context'

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    // Redirect to dashboard if user is already authenticated
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return children
}

export default GuestRoute
