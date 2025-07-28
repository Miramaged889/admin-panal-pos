import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import useStore from "../../store/useStore";
import { toast } from "../UI/Toast";

const ManagerForm = ({ clientId, branchId, manager, branch, onClose }) => {
  const { t } = useLanguage();
  const { updateManager } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    email: "",
    phone: "",
    role: "branch_manager",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (manager) {
      setFormData({
        name: manager.name || "",
        nameEn: manager.nameEn || "",
        email: manager.email || "",
        phone: manager.phone || "",
        role: manager.role || "branch_manager",
      });
    }
  }, [manager]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t(translations.required);
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = t(translations.required);
    }

    if (!formData.email.trim()) {
      newErrors.email = t(translations.required);
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t(translations.invalidEmail);
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t(translations.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      updateManager(clientId, branchId, {
        ...formData,
        id: manager?.id || Date.now().toString(),
      });

      toast.success(t(translations.managerUpdated));
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
    <div className="p-6 space-y-6">
      {/* Branch Info */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
        <h3 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
          {t({ en: "Assigning manager to:", ar: "تعيين مدير لـ:" })}
        </h3>
        <p className="text-sm text-primary-700 dark:text-primary-300">
          {branch?.name} - {branch?.location}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Arabic Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerNameAr)}{" "}
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
              placeholder={t(translations.managerNameAr)}
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
              {t(translations.managerNameEn)}{" "}
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
              placeholder={t(translations.managerNameEn)}
              dir="ltr"
            />
            {errors.nameEn && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.nameEn}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerEmail)}{" "}
              <span className="text-error-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${
                errors.email ? "border-error-500 focus:ring-error-500" : ""
              }`}
              placeholder={t(translations.managerEmail)}
              dir="ltr"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerPhone)}{" "}
              <span className="text-error-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${
                errors.phone ? "border-error-500 focus:ring-error-500" : ""
              }`}
              placeholder={t(translations.managerPhone)}
              dir="ltr"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.phone}
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
    </div>
  );
};

export default ManagerForm;
