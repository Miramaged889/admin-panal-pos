import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import useStore from "../../store/useStore";
import { toast } from "../UI/Toast";

const BranchForm = ({ clientId, branch, onClose }) => {
  const { t } = useLanguage();
  const { addBranch, updateBranch } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    location: "",
    locationEn: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        nameEn: branch.nameEn || "",
        location: branch.location || "",
        locationEn: branch.locationEn || "",
      });
    }
  }, [branch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t(translations.required);
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = t(translations.required);
    }

    if (!formData.location.trim()) {
      newErrors.location = t(translations.required);
    }

    if (!formData.locationEn.trim()) {
      newErrors.locationEn = t(translations.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (branch) {
        updateBranch(clientId, branch.id, formData);
        toast.success(t(translations.branchUpdated));
      } else {
        addBranch(clientId, formData);
        toast.success(t(translations.branchAdded));
      }

      onClose();
    } catch {
      toast.error(t(translations.somethingWentWrong));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arabic Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {t(translations.branchNameAr)}{" "}
            <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${
              errors.name ? "border-error-500 focus:ring-error-500" : ""
            }`}
            placeholder={t(translations.branchNameAr)}
            dir="rtl"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* English Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {t(translations.branchNameEn)}{" "}
            <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            className={`input-field ${
              errors.nameEn ? "border-error-500 focus:ring-error-500" : ""
            }`}
            placeholder={t(translations.branchNameEn)}
            dir="ltr"
          />
          {errors.nameEn && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.nameEn}
            </p>
          )}
        </div>

        {/* Arabic Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {t(translations.locationAr)}{" "}
            <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`input-field ${
              errors.location ? "border-error-500 focus:ring-error-500" : ""
            }`}
            placeholder={t(translations.locationAr)}
            dir="rtl"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.location}
            </p>
          )}
        </div>

        {/* English Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {t(translations.locationEn)}{" "}
            <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            name="locationEn"
            value={formData.locationEn}
            onChange={handleChange}
            className={`input-field ${
              errors.locationEn ? "border-error-500 focus:ring-error-500" : ""
            }`}
            placeholder={t(translations.locationEn)}
            dir="ltr"
          />
          {errors.locationEn && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.locationEn}
            </p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={isLoading}
        >
          {t(translations.cancel)}
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t(translations.loading)}
            </div>
          ) : (
            t(translations.save)
          )}
        </button>
      </div>
    </form>
  );
};

export default BranchForm;
