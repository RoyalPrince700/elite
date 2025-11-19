import React, { useState } from 'react';
import { FaPlus, FaUser, FaUsers, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DeliverablesTab = ({
  filteredUsers,
  onAddDeliverable,
  deliverables = [],
  onDeleteDeliverable
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddDeliverable = (user) => {
    setSelectedUser(user);
    onAddDeliverable(user);
  };

  const handleDeleteDeliverable = async (deliverableId, userName) => {
    if (!window.confirm(`Are you sure you want to delete this deliverable for ${userName}?`)) {
      return;
    }

    try {
      await onDeleteDeliverable(deliverableId);
      toast.success('Deliverable deleted successfully');
    } catch (error) {
      toast.error('Failed to delete deliverable');
    }
  };

  const getUserDeliverables = (userId) => {
    return deliverables.filter(d => d.userId._id === userId || d.userId === userId);
  };

  return (
    <div className="space-y-6">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          const userDeliverables = getUserDeliverables(user._id);
          return (
            <div key={user._id} className="border border-gray-200 rounded-lg p-4">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaUser className="text-gray-600" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
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
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleAddDeliverable(user)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors flex items-center space-x-2 text-sm"
                    title="Add deliverable for this user"
                  >
                    <FaPlus className="text-xs" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* User Deliverables */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Deliverables ({userDeliverables.length})
                </h4>
                {userDeliverables.length > 0 ? (
                  <div className="space-y-2">
                    {userDeliverables.map((deliverable) => (
                      <div key={deliverable._id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="text-sm font-medium text-gray-900">
                                {deliverable.title}
                              </h5>
                              <a
                                href={deliverable.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                title="Open link"
                              >
                                <FaExternalLinkAlt />
                              </a>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {deliverable.description}
                            </p>
                            <div className="text-xs text-gray-500">
                              Added {new Date(deliverable.createdAt).toLocaleDateString()} by {deliverable.createdBy?.fullName || 'Admin'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDeliverable(deliverable._id, user.fullName)}
                            className="text-red-600 hover:text-red-800 p-1 ml-2"
                            title="Delete deliverable"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No deliverables added yet
                  </p>
                )}
              </div>
            </div>
          );
        })
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

export default DeliverablesTab;
