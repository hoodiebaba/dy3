// pages/DiscussionForum/components/SearchableMultiSelect.jsx
import React, { useState, useRef, useEffect } from "react";

const SearchableMultiSelect = ({ 
  options = [], 
  value = [], 
  onChange, 
  placeholder = "Select options...",
  label,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = options.filter(opt => 
    opt.label?.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle selection
  const toggleOption = (optionId) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  // Remove a selected item
  const removeItem = (optionId, e) => {
    e.stopPropagation();
    onChange(value.filter(id => id !== optionId));
  };

  // Get selected option labels
  const getSelectedLabels = () => {
    return value
      .map(id => options.find(opt => opt.id === id)?.label)
      .filter(Boolean);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected items display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`min-h-[42px] w-full px-3 py-2 border rounded-lg cursor-pointer transition-all ${
          error 
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-200" 
            : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
        } ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:border-gray-400"}`}
      >
        <div className="flex flex-wrap gap-1.5">
          {value.length > 0 ? (
            getSelectedLabels().map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {label}
                {!disabled && (
                  <button
                    onClick={(e) => removeItem(value[index], e)}
                    className="ml-1.5 hover:text-blue-900 focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm py-1">{placeholder}</span>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={value.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                  {option.description && (
                    <span className="ml-2 text-xs text-gray-400">{option.description}</span>
                  )}
                </label>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No options found</p>
                {search && (
                  <p className="text-xs text-gray-400">Try different keywords</p>
                )}
              </div>
            )}
          </div>

          {/* Footer with selection count */}
          {value.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              {value.length} item{value.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && typeof error === 'string' && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchableMultiSelect;