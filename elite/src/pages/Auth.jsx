import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context';
import GoogleSignInButton from '../components/GoogleSignInButton';
import cubeImage from "../assets/cylinder.png";
import waveImage from "../assets/noodle.png";

const Auth = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  const handleGoogleSuccess = (data) => {
    toast.dismiss();
    toast.success("Welcome!", { toastId: 'auth-success-toast' });
    navigate('/dashboard');
  };

  const handleGoogleError = (error) => {
    console.error('❌ [Auth] Google sign-in error:', error);
    toast.dismiss();
    toast.error("Google sign-in failed. Please try again.", { toastId: 'auth-error-toast' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#183EC2] to-[#EAEEFE] relative overflow-hidden">
      {/* Animated 3D Shapes */}
      <motion.img
        src={cubeImage}
        alt="Cube"
        className="absolute top-10 left-20 w-48 opacity-80"
        animate={{
          translateY: [-30, 30],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 5,
          ease: "easeInOut",
        }}
      />
      <motion.img
        src={waveImage}
        alt="Wave"
        className="absolute bottom-10 right-10 w-60 opacity-80"
        animate={{
          translateX: [-20, 20],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 4,
          ease: "easeInOut",
        }}
      />

      {/* Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-4">
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={loading}
          />

          <div className="text-center text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
