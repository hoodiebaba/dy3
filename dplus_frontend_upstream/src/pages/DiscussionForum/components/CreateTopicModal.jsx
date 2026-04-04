// pages/DiscussionForum/components/CreateTopicModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import { toast } from "react-hot-toast";
import DuplicateTopicModal from "./DuplicateTopicModal";
import ErrorAlert from "./ErrorAlert";
import DatasetTypeToggle from "./DatasetTypeToggle";
import SearchableMultiSelect from "./SearchableMultiSelect";
import Api from "../../../utils/api";

const INITIAL_FORM_STATE = {
  datasetType: "SITE",
  title: "",
  description: "",
  siteName: "",
  cellNames: [],
  users: [],
};

const INITIAL_ERROR_STATE = {
  field: null,
  message: null,
  type: null,
  data: null,
};

export default function CreateTopicModal({ isOpen, onClose, headers, onSuccess }) {

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(INITIAL_ERROR_STATE);
  const [loading, setLoading] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  const [siteList, setSiteList] = useState([]);
  const [cellList, setCellList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Fetch dropdown options
  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  // Reset form
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const fetchOptions = async () => {

    setLoadingOptions(true);

    try {

      const [siteRes, userRes] = await Promise.all([
        Api.get({ url: "/discussions/siteList", inst: 0 }),
        Api.get({ url: "/discussions/users" }),
      ]);

      setSiteList(siteRes?.data?.data || []);
      setUserList(userRes?.data?.data || []);

    } catch (error) {
      toast.error("Failed to load form options");
    } finally {
      setLoadingOptions(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setFieldErrors({});
    setError(INITIAL_ERROR_STATE);
    setDuplicateData(null);
    setCellList([]);
  };

  // Validation
  const validateForm = () => {

    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (formData.datasetType === "SITE" && !formData.siteName) {
      errors.siteName = "Please select a site";
    }

    if (formData.cellNames.length === 0) {
      errors.cellNames = "Select at least one cell";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {

    setError(INITIAL_ERROR_STATE);

    if (!validateForm()) return;

    setLoading(true);

    try {

      const response = await Api.post({
        url: "/discussions/topic",
        data: formData,
      });

      const json = response?.data;
      const status = response?.status;

      switch (status) {

        case 200:
        case 201:
          toast.success("Topic created successfully");
          onSuccess();
          onClose();
          break;

        case 400:
          setError({
            message: json?.msg || "Validation failed",
            type: "validation",
          });

          if (json?.errors) {
            setFieldErrors(json.errors);
          }
          break;

        case 403:
          setError({
            message: json?.msg || "Permission denied",
            type: "permission",
          });
          break;

        case 409:
          if (json?.state === 2) {

            setDuplicateData({
              topicId: json?.data?.topicId,
              message: json?.msg,
            });

            setShowDuplicateModal(true);
          }
          break;

        default:
          setError({
            message: json?.msg || "Unexpected error",
            type: "server",
          });
      }

    } catch (error) {

      setError({
        message: "Network error",
        type: "network",
      });

      toast.error("Connection failed");

    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {

    // Site change logic
    if (field === "siteName") {

      const selectedSite = siteList.find(
        (s) => s.siteName === value
      );

      if (selectedSite?.cellNames) {

        const cells = selectedSite.cellNames.split(",");

        setCellList(cells);

      } else {
        setCellList([]);
      }

      setFormData((prev) => ({
        ...prev,
        siteName: value,
        cellNames: []
      }));

      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }

    if (error.type) {
      setError(INITIAL_ERROR_STATE);
    }
  };

  const handleOpenDuplicate = () => {

    setShowDuplicateModal(false);
    onClose();

    if (duplicateData?.topicId) {

      if (window.openDuplicateTopic) {
        window.openDuplicateTopic(duplicateData.topicId);
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={onClose} size="lg">

        <div className="p-6">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Topic
          </h2>

          {error.message && error.type !== "duplicate" && (
            <ErrorAlert
              message={error.message}
              type={error.type}
              onDismiss={() => setError(INITIAL_ERROR_STATE)}
            />
          )}

          {loadingOptions && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading options...</span>
            </div>
          )}

          {!loadingOptions && (

            <div className="space-y-6">

              {/* Dataset Type */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset Type *
                </label>

                <DatasetTypeToggle
                  value={formData.datasetType}
                  onChange={(value) => handleFieldChange("datasetType", value)}
                />

              </div>

              {/* Title */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>

                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter topic title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                />

                {fieldErrors.title && (
                  <p className="text-xs text-red-500">{fieldErrors.title}</p>
                )}

              </div>

              {/* Description */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                />

              </div>

              {/* Site Dropdown */}
              {formData.datasetType === "SITE" && (

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site *
                  </label>

                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.siteName}
                    onChange={(e) =>
                      handleFieldChange("siteName", e.target.value)
                    }
                  >

                    <option value="">Select Site</option>

                    {siteList.map((site) => (
                      <option key={site.siteName} value={site.siteName}>
                        {site.siteName}
                      </option>
                    ))}

                  </select>

                </div>
              )}

              {/* Cells Dropdown */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cells *
                </label>

                <SearchableMultiSelect
                  options={cellList.map(cell => ({
                    id: cell,
                    label: cell
                  }))}
                  value={formData.cellNames}
                  onChange={(value) =>
                    handleFieldChange("cellNames", value)
                  }
                  placeholder="Select cells..."
                  error={fieldErrors.cellNames}
                />

                {fieldErrors.cellNames && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.cellNames}
                  </p>
                )}

              </div>

              {/* Participants */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participants
                </label>

                <SearchableMultiSelect
                  options={userList}
                  value={formData.users}
                  onChange={(value) =>
                    handleFieldChange("users", value)
                  }
                  placeholder="Add participants"
                />

              </div>

            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">

            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Creating..." : "Create Topic"}
            </button>

          </div>

        </div>
      </Modal>

      {showDuplicateModal && duplicateData && (

        <DuplicateTopicModal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          message={duplicateData.message}
          onOpenExisting={handleOpenDuplicate}
          onCancel={() => setShowDuplicateModal(false)}
        />

      )}
    </>
  );
}