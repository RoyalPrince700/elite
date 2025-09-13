import React from 'react';
import { FaImages, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaImages className="text-blue-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Photos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPhotos}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completed Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaChartLine className="text-purple-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{stats.currentMonthUsage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
