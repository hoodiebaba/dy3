// pages/DiscussionForum/components/DuplicateTopicModal.jsx
import React from "react";
import Modal from "../../../components/Modal";

export default function DuplicateTopicModal({ 
  isOpen, 
  onClose, 
  message, 
  onOpenExisting, 
  onCancel 
}) {
  return (
    <Modal isOpen={isOpen} setIsOpen={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Similar Topic Exists</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          {message || "A similar topic already exists. Would you like to open the existing topic instead?"}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onOpenExisting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Open Existing Topic
          </button>
        </div>
      </div>
    </Modal>
  );
}