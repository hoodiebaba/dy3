import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Modal from "../../components/Modal"; // Using existing Modal
import Api from "../../utils/api";
import { toast } from "react-hot-toast";

function EnterpriseTagInput({
  options = [], // [{id, label}]
  value = [],   // [id, id]
  onChange,
  placeholder = "Type to search...",
  loading = false,
  error = null,
  disabled = false,
  maxTags = 20
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 🔥 FILTER (label based)
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter(opt =>
      (opt.label || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // keyboard nav
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (["ArrowDown", "Enter", " "].includes(e.key)) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          toggleOption(filteredOptions[focusedIndex]);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;

      case "Backspace":
        if (searchTerm === "" && value.length > 0) {
          removeOption(value[value.length - 1]);
        }
        break;
    }
  };

  // 🔥 TOGGLE (store id only)
  const toggleOption = (option) => {
    if (!value.includes(option.id) && value.length < maxTags) {
      onChange([...value, option.id]);
    } else {
      onChange(value.filter(v => v !== option.id));
    }
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const removeOption = (idToRemove) => {
    onChange(value.filter(v => v !== idToRemove));
  };

  // scroll
  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current) {
      const el = dropdownRef.current.children[focusedIndex];
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <div className="relative" ref={containerRef}>
      
      {/* INPUT BOX */}
      <div
        className={`
          relative w-full min-h-[48px] bg-white rounded-lg border
          ${isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"}
          ${disabled ? "bg-gray-100" : ""}
        `}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center gap-1.5 p-2 max-h-[100px] overflow-y-auto">
          
          {/* TAGS */}
          {value.map(id => {
            const user = options.find(o => o.id === id);

            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                <span className="truncate max-w-[150px]">
                  {user?.label || id}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(id);
                  }}
                >
                  ✕
                </button>
              </span>
            );
          })}

          {/* INPUT */}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-[120px] h-7 px-1 text-sm bg-transparent outline-none"
            placeholder={value.length === 0 ? placeholder : ""}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              setFocusedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
          />
        </div>

        {/* ICON */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button onClick={() => setIsOpen(!isOpen)}>
            ⌄
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* DROPDOWN */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow max-h-60 overflow-y-auto"
        >
          {loading ? (
            <div className="p-3 text-sm text-gray-500 text-center">
              Loading...
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">
              No data
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.id}
                className={`
                  px-3 py-2 cursor-pointer
                  ${focusedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"}
                  ${value.includes(option.id) ? "bg-blue-100" : ""}
                `}
                onClick={() => toggleOption(option)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- ENTERPRISE SELECT COMPONENT ---------- */
function EnterpriseSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Select...",
  loading = false,
  error = null,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt === value);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`
          relative w-full min-h-[42px] bg-white rounded-lg border px-3 py-2
          transition-all duration-200 cursor-pointer
          ${isOpen 
            ? "border-blue-500 ring-2 ring-blue-200" 
            : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            {selectedOption ? (
              <span className="text-sm text-gray-900">{selectedOption}</span>
            ) : (
              <span className="text-sm text-gray-400">{placeholder}</span>
            )}
          </div>

          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          ) : (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
      )}

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500 text-center">Loading...</div>
          ) : options.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option}
                className={`
                  px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150
                  border-b border-gray-100 last:border-0
                  ${value === option ? "bg-blue-50 text-blue-700" : "text-gray-700"}
                `}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span className="text-sm">{option}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- FORM SECTION COMPONENT ---------- */
function FormSection({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ---------- TELECOM CONSTANTS ---------- */
const TELECOM_CONSTANTS = {
  TECHNOLOGY: ["2G", "3G", "4G", "5G"],
  ISSUE_CATEGORIES: ["RF", "Transmission", "Hardware", "Performance"],
  PRIORITIES: ["Critical", "High", "Medium", "Low"],
  SEVERITIES: ["S1", "S2", "S3", "S4"],
  REGIONS: ["North", "South", "East", "West", "Central"],
  TEAMS: {
    RF: "RF Team",
    Transmission: "TX Team",
    Hardware: "Hardware Team",
    Performance: "Performance Team"
  }
};

/* ---------- INITIAL STATE ---------- */
const INITIAL_FORM = {
  datasetType: "SITE",
  title: "",
  description: "",
  technology: "4G",
  issueCategory: "",
  severity: "S3",
  priority: "Medium",
  region: "",
  assignedTeam: "",
  siteName: "",
  cellNames: [],
  assignedUsers: []
};

/* ---------- MAIN COMPONENT ---------- */
export default function CreateTicketModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [siteList, setSiteList] = useState([]);
  const [allCells, setAllCells] = useState([]);
  const [cellOptions, setCellOptions] = useState([]);
  const [userList, setUserList] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingCells, setLoadingCells] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});
  const [siteError, setSiteError] = useState(null);
  const [cellError, setCellError] = useState(null);
  const [userError, setUserError] = useState(null);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    } else {
      resetForm();
    }
  }, [isOpen]);

  // Fetch cells immediately when switching to CELL mode
  useEffect(() => {
    if (formData.datasetType === "CELL" && isOpen) {
      fetchAllCells();
    }
  }, [formData.datasetType, isOpen]);

  const fetchInitialData = async () => {
    setLoadingSites(true);
    setLoadingUsers(true);

    try {
      const [siteRes, userRes] = await Promise.all([
        Api.get({ url: "/tickets/siteList" }).catch(() => {
          setSiteError("Failed to load sites");
          return { data: { data: [] } };
        }),
        Api.get({ url: "/tickets/users" }).catch(() => {
          setUserError("Failed to load users");
          return { data: { data: [] } };
        })
      ]);

      setSiteList(siteRes?.data?.data || []);
      setUserList(userRes?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load form data");
    } finally {
      setLoadingSites(false);
      setLoadingUsers(false);
    }
  };

  const fetchAllCells = async () => {
    setLoadingCells(true);
    setCellError(null);

    try {
      const cellRes = await Api.get({ url: "/tickets/cellList" });
      const cells = cellRes?.data?.data || [];
      setAllCells(cells);
      setCellOptions(cells);
    } catch (err) {
      setCellError("Failed to load cells");
      toast.error("Could not load cells");
    } finally {
      setLoadingCells(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setCellOptions([]);
    setErrors({});
  };

  // Smart team assignment
  useEffect(() => {
    if (formData.issueCategory) {
      setFormData(prev => ({
        ...prev,
        assignedTeam: TELECOM_CONSTANTS.TEAMS[formData.issueCategory] || ""
      }));
    }
  }, [formData.issueCategory]);

  const handleChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: null }));

    if (field === "datasetType") {
      setFormData({
        ...formData,
        datasetType: value,
        siteName: "",
        cellNames: []
      });
      setCellOptions(value === "CELL" ? allCells : []);
      return;
    }

    if (field === "siteName") {
      const selectedSite = siteList.find(s => s.siteName === value);
      const siteCells = selectedSite?.cellNames
        ?.split(',')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0) || [];

      setCellOptions(siteCells);
      setFormData({
        ...formData,
        siteName: value,
        cellNames: []
      });
      return;
    }

    setFormData({ ...formData, [field]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.issueCategory) newErrors.issueCategory = "Issue category is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (formData.datasetType === "SITE" && !formData.siteName) {
      newErrors.siteName = "Site is required";
    }
    if (formData.cellNames.length === 0) {
      newErrors.cellNames = "At least one cell must be selected";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const ticketId = `TKT-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const payload = {
        ticketId,
        ...formData,
        description: formData.description.trim(),
        title: formData.title.trim(),
        siteName: formData.datasetType === "SITE" ? formData.siteName : null,
        createdAt: new Date().toISOString()
      };

      await Api.post({ url: "/tickets/create", data: payload });

      toast.success(
        <div>
          <div className="font-medium">Ticket Created</div>
          <div className="text-xs opacity-75">{ticketId}</div>
        </div>
      );

      onSuccess?.(payload);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={onClose} size="lg">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Header with updated heading */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            Raise Ticket
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and assign network issue tickets
          </p>
        </div>

        {/* Scrollable Form - Fixed Height */}
        <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Dataset Type */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dataset Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {["SITE", "CELL"].map(type => (
                <button
                  key={type}
                  onClick={() => handleChange("datasetType", type)}
                  className={`
                    flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all
                    ${formData.datasetType === type
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info Section */}
          <FormSection title="Basic Information">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`
                  w-full px-3 py-2 border rounded-md transition-all
                  ${errors.title
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }
                `}
                placeholder="e.g., RNC Down - North Region"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                rows={3}
                placeholder="Provide detailed description of the issue..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </FormSection>

          {/* Network Info Section */}
          <FormSection title="Network Information">
            {/* Technology & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.technology}
                  onChange={(e) => handleChange("technology", e.target.value)}
                >
                  {TELECOM_CONSTANTS.TECHNOLOGY.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={`
                    w-full px-3 py-2 border rounded-md transition-all
                    ${errors.issueCategory
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }
                  `}
                  value={formData.issueCategory}
                  onChange={(e) => handleChange("issueCategory", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {TELECOM_CONSTANTS.ISSUE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.issueCategory && <p className="text-xs text-red-500 mt-1">{errors.issueCategory}</p>}
              </div>
            </div>

            {/* Site (SITE mode only) */}
            {formData.datasetType === "SITE" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site <span className="text-red-500">*</span>
                </label>
                <EnterpriseSelect
                  options={siteList.map(s => s.siteName)}
                  value={formData.siteName}
                  onChange={(v) => handleChange("siteName", v)}
                  placeholder="Select site..."
                  loading={loadingSites}
                  error={siteError}
                />
                {errors.siteName && <p className="text-xs text-red-500 mt-1">{errors.siteName}</p>}
              </div>
            )}

            {/* Cells */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cells <span className="text-red-500">*</span>
              </label>
              <EnterpriseTagInput
                // options={cellOptions}
                options={cellOptions.map(c => ({ id: c, label: c }))}
                value={formData.cellNames}
                onChange={(v) => handleChange("cellNames", v)}
                placeholder={
                  formData.datasetType === "SITE"
                    ? loadingSites ? "Loading sites..." : "Select a site first"
                    : loadingCells ? "Loading cells..." : "Search cells..."
                }
                loading={formData.datasetType === "CELL" ? loadingCells : false}
                error={cellError}
                disabled={formData.datasetType === "SITE" && !formData.siteName}
              />
              {errors.cellNames && <p className="text-xs text-red-500 mt-1">{errors.cellNames}</p>}
            </div>

            {/* Severity & Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.severity}
                  onChange={(e) => handleChange("severity", e.target.value)}
                >
                  {TELECOM_CONSTANTS.SEVERITIES.map(sev => (
                    <option key={sev} value={sev}>{sev}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                >
                  <option value="">Select Region</option>
                  {TELECOM_CONSTANTS.REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormSection>

          {/* Assignment Section */}
          <FormSection title="Assignment">
            {/* Priority & Team */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  className={`
                    w-full px-3 py-2 border rounded-md transition-all
                    ${errors.priority
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }
                  `}
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="">Select Priority</option>
                  {TELECOM_CONSTANTS.PRIORITIES.map(pri => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
                {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Team</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  value={formData.assignedTeam}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Users */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Users</label>
              <EnterpriseTagInput
                options={userList.map(u => u.label)}
                value={formData.assignedUsers}
                onChange={(v) => handleChange("assignedUsers", v)}
                placeholder="Search users..."
                loading={loadingUsers}
                error={userError}
              />
            </div> */}
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Assign to Users
  </label>

  <EnterpriseTagInput
    options={userList} 
    value={formData.assignedUsers} 
    onChange={(v) => handleChange("assignedUsers", v)}
    placeholder="Search users..."
    loading={loadingUsers}
    error={userError}
  />
</div>
          </FormSection>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || loadingSites || loadingCells || loadingUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            {loading ? "Creating..." : "Raise Ticket"}
          </button>
        </div>
      </div>
    </Modal>
  );
}