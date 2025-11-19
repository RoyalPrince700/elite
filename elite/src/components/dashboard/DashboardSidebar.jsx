import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaCamera,
  FaHistory,
  FaFileInvoiceDollar,
  FaDownload,
  FaCreditCard,
  FaComments,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardSidebar = ({ activeTab, onTabChange, user, isMobileOpen, onMobileToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FaTachometerAlt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'upload',
      label: 'Upload Photos',
      icon: FaCamera,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'orders',
      label: 'Order History',
      icon: FaHistory,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FaFileInvoiceDollar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: FaDownload,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: FaCreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      external: true,
      path: '/subscriptions'
    },
    {
      id: 'chat',
      label: 'Support Chat',
      icon: FaComments,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const handleTabClick = (tabId, external = false, path = null) => {
    if (external && path) {
      // Handle external links (like subscriptions page)
      window.location.href = path;
    } else {
      onTabChange(tabId);
    }

    // Close mobile sidebar after selection
    if (isMobileOpen) {
      onMobileToggle();
    }
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">Dashboard</p>
              </div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1 rounded-md hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FaChevronRight className="text-gray-400 text-sm" />
            ) : (
              <FaChevronLeft className="text-gray-400 text-sm" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileToggle}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-400 text-sm" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id, item.external, item.path)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-none transition-colors group
                    ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-700 hover:text-black'}
                    ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`flex-shrink-0 ${isCollapsed ? 'text-base' : 'text-base mr-3'}`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Elite Retoucher Dashboard
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky inset-y-0 left-0 z-50 bg-white border-r border-gray-200
        md:top-20 md:self-start
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isCollapsed ? 'md:w-16' : 'md:w-64'}
        w-64
      `}>
        <SidebarContent />
      </div>
    </>
  );
};

export default DashboardSidebar;
