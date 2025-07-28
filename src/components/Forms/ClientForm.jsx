import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import useStore from "../../store/useStore";
import DatePicker from "../UI/DatePicker";
import { toast } from "../UI/Toast";

const ClientForm = ({ client, onClose }) => {
  const { t } = useLanguage();
  const { addClient, updateClient } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    email: "",
    phone: "",
    subscriptionStart: "",
    subscriptionEnd: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        nameEn: client.nameEn || "",
        email: client.email || "",
        phone: client.phone || "",
        subscriptionStart: client.subscriptionStart || "",
        subscriptionEnd: client.subscriptionEnd || "",
      });
    }
  }, [client]);

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

    if (!formData.subscriptionStart) {
      newErrors.subscriptionStart = t(translations.required);
    }

    if (!formData.subscriptionEnd) {
      newErrors.subscriptionEnd = t(translations.required);
    }

    if (formData.subscriptionStart && formData.subscriptionEnd) {
      if (
        new Date(formData.subscriptionStart) >=
        new Date(formData.subscriptionEnd)
      ) {
        newErrors.subscriptionEnd = t({
          en: "End date must be after start date",
          ar: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية",
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const clientData = {
        ...formData,
        status:
          new Date() > new Date(formData.subscriptionEnd)
            ? "expired"
            : "active",
      };

      if (client) {
        updateClient(client.id, clientData);
        toast.success(t(translations.clientUpdated));
      } else {
        addClient(clientData);
        toast.success(t(translations.clientAdded));
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

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user selects a date
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
            {t(translations.clientNameAr)}{" "}
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
            placeholder={t(translations.clientNameAr)}
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
            {t(translations.clientNameEn)}{" "}
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
            placeholder={t(translations.clientNameEn)}
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
            {t(translations.email)} <span className="text-error-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${
              errors.email ? "border-error-500 focus:ring-error-500" : ""
            }`}
            placeholder={t(translations.email)}
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
            {t(translations.phone)} <span className="text-error-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`input-field ${
              errors.phone ? "border-error-500 focus:ring-error-500" : ""
            }`}
            placeholder={t(translations.phone)}
            dir="ltr"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Subscription Start Date */}
        <DatePicker
          label={t(translations.subscriptionStart)}
          value={formData.subscriptionStart}
          onChange={(value) => handleDateChange("subscriptionStart", value)}
          required
          error={errors.subscriptionStart}
          max={formData.subscriptionEnd || undefined}
        />

        {/* Subscription End Date */}
        <DatePicker
          label={t(translations.subscriptionEnd)}
          value={formData.subscriptionEnd}
          onChange={(value) => handleDateChange("subscriptionEnd", value)}
          required
          error={errors.subscriptionEnd}
          min={formData.subscriptionStart || undefined}
        />
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

export default ClientForm;
