// pages/DiscussionForum/components/ErrorAlert.jsx
import React from "react";

const ErrorAlert = ({ message, type = "validation", onDismiss }) => {
  const getStyles = () => {
    switch (type) {
      case "validation":
        return "bg-red-50 border-red-200 text-red-700";
      case "invalid-cells":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "cells-not-found":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "permission":
        return "bg-red-50 border-red-200 text-red-700";
      case "network":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-red-50 border-red-200 text-red-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "validation":
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case "invalid-cells":
      case "cells-not-found":
        return (
          <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 animate-slideDown ${getStyles()}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;