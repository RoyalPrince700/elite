import React from 'react';
import { FaUsers, FaUser } from 'react-icons/fa';

const UsersTab = ({ filteredUsers, handleUserRoleChange }) => {
  return (
    <div className="space-y-4">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div key={user._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FaUser className="text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.fullName || 'No name'}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Company:</strong> {user.companyName || 'N/A'}
                  </div>
                  <div>
                    <strong>Phone:</strong> {user.phone || 'N/A'}
                  </div>
                  <div>
                    <strong>User Type:</strong> {user.userType || 'N/A'}
                  </div>
                  <div>
                    <strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <select
                  value={user.role}
                  onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No users match your current search and filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
