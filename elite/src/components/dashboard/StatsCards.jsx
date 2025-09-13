import React from 'react';
import { FaImages, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      icon: <FaImages className="text-blue-600 text-xl" />,
      iconBg: "bg-blue-100",
      label: "Total Photos",
      value: stats.totalPhotos,
      id: "totalPhotos"
    },
    {
      icon: <FaClock className="text-yellow-600 text-xl" />,
      iconBg: "bg-yellow-100",
      label: "Pending Orders",
      value: stats.pendingOrders,
      id: "pendingOrders"
    },
    {
      icon: <FaCheckCircle className="text-green-600 text-xl" />,
      iconBg: "bg-green-100",
      label: "Completed Orders",
      value: stats.completedOrders,
      id: "completedOrders"
    },
    {
      icon: <FaChartLine className="text-purple-600 text-xl" />,
      iconBg: "bg-purple-100",
      label: "This Month",
      value: stats.currentMonthUsage,
      id: "currentMonthUsage"
    }
  ];

  return (
    <div className="mb-8">
      {/* Mobile: Horizontal scrollable cards */}
      <div className="md:hidden overflow-x-auto pb-2">
        <div className="flex space-x-4 min-w-max px-1">
          {statItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 min-w-[140px] flex-shrink-0">
              <div className="flex items-center">
                <div className={`p-2 ${item.iconBg} rounded-lg flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet and Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-2 ${item.iconBg} rounded-lg`}>
                {item.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
