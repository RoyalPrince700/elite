import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

function AuthCallback() {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const handleAuth = async () => {
      if (token) {
        try {
          // Save token to localStorage so API service can use it
          apiService.setToken(token);

          // Fetch user profile to get user data
          const response = await apiService.getProfile();

          if (response.success) {
            navigate('/dashboard');
          } else {
            navigate('/auth');
          }
        } catch (error) {
          // Clean up invalid token
          apiService.setToken(null);
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    };

    handleAuth();
  }, [location, signInWithGoogle, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
