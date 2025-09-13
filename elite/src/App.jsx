import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Auth from './pages/Auth';
import AuthCallback from './components/AuthCallback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './components/SideBar';
import Footer from './components/Footer';
import PricingPage from './pages/PricingPage';
import Portfolio from './pages/Portfolio';
import Services from './components/Services';
import Dashboard from './pages/Dashboard';
import SubscriptionBilling from './pages/SubscriptionBilling';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsAndPrivacy from './pages/TermsAndPrivacy';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, SocketProvider } from './context';
import { ProtectedRoute, GuestRoute } from './components/auth';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className=''>
          <ToastContainer/>
          {/* <NavBarNew/> */}
          {/* <SideBar/> */}
          <NavBar/>
          <ScrollToTop />
          <Routes>

          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/services' element={<Services/>}/>
          <Route path='/portfolio' element={<Portfolio/>}/>
          <Route path='/pricing' element={<PricingPage/>}/>
          <Route path='/terms-privacy' element={<TermsAndPrivacy/>}/>

          {/* Protected Routes - Require Authentication */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>

          <Route path='/subscriptions' element={
            <ProtectedRoute>
              <SubscriptionBilling/>
            </ProtectedRoute>
          }/>

          {/* Admin Routes - Require Admin Role */}
          <Route path='/admin' element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }/>

          {/* Guest Routes - Only accessible when not authenticated */}
          <Route path='/auth' element={
            <GuestRoute>
              <Auth/>
            </GuestRoute>
          }/>

          {/* Auth Callback Route */}
          <Route path='/auth/callback' element={<AuthCallback/>}/>

        </Routes>
        <Footer />

        </div>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App