// pages/DiscussionForum/components/DatasetTypeToggle.jsx
import React from "react";

const DatasetTypeToggle = ({ value, onChange, disabled }) => {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      {["SITE", "CELL"].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          disabled={disabled}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            value === type
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default DatasetTypeToggle;