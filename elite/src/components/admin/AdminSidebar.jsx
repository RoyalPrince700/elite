import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaCrown,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaComments,
  FaImage,
  FaNewspaper,
  FaChartLine,
  FaDownload,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  subscriptionRequests,
  payPerImageRequests,
  paymentReceipts,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = (onClick) => {
    onClick();
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const getPendingRequestsCount = () => {
    return subscriptionRequests?.filter(request => request.status === 'pending').length || 0;
  };

  const getPendingPayPerImageRequestsCount = () => {
    return payPerImageRequests?.filter(request => request.status === 'pending').length || 0;
  };

  const getPendingPaymentsCount = () => {
    return paymentReceipts?.filter(receipt => receipt.status === 'submitted').length || 0;
  };

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FaChartLine,
      onClick: () => setActiveTab('overview')
    },
    {
      id: 'users',
      label: 'Users',
      icon: FaUsers,
      onClick: () => setActiveTab('users')
    },
    {
      id: 'deliverables',
      label: 'Deliverables',
      icon: FaDownload,
      onClick: () => setActiveTab('deliverables')
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: FaCrown,
      onClick: () => setActiveTab('subscriptions')
    },
    {
      id: 'requests',
      label: 'Sub Requests',
      icon: FaFileInvoiceDollar,
      onClick: () => setActiveTab('requests'),
      badge: getPendingRequestsCount()
    },
    {
      id: 'pay-per-image-requests',
      label: 'PPI Requests',
      icon: FaImage,
      onClick: () => setActiveTab('pay-per-image-requests'),
      badge: getPendingPayPerImageRequestsCount()
    },
    {
      id: 'pay-per-image-subscriptions',
      label: 'PPI Subscriptions',
      icon: FaImage,
      onClick: () => setActiveTab('pay-per-image-subscriptions')
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FaFileInvoiceDollar,
      onClick: () => setActiveTab('invoices')
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: FaCreditCard,
      onClick: () => setActiveTab('payments'),
      badge: getPendingPaymentsCount()
    },
    {
      id: 'chat',
      label: 'Messages',
      icon: FaComments,
      onClick: () => setActiveTab('chat'),
      badge: unreadMessagesCount
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: FaNewspaper,
      onClick: () => setActiveTab('blog')
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`${
          isMobile
            ? `fixed left-0 top-0 h-screen w-64 z-50 transform transition-transform duration-300 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `fixed left-0 top-0 h-screen ${
                isCollapsed ? "w-16" : "w-64"
              } z-40 transition-all duration-300`
        } bg-white border-r border-gray-200 flex flex-col`}
      >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          {!isCollapsed && !isMobile && (
            <h2 className="text-base font-semibold text-gray-900">Admin Panel</h2>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasBadge = item.badge && item.badge > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    // Reset filters when switching tabs
                    handleNavClick(item.onClick);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`${isCollapsed ? 'mx-auto' : ''} text-base flex-shrink-0`} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-sm flex-1">{item.label}</span>
                      {hasBadge && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && hasBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
    </>
  );
};

export default AdminSidebar;
