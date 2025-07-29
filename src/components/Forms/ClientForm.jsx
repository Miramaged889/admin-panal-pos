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
    numberOfUsers: "",
    subscriptionOptions: {
      hetchin: true,
      delivery: true,
    },
    manager: {
      name: "",
      nameEn: "",
      email: "",
      phone: "",
    },
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
        numberOfUsers: client.numberOfUsers || "",
        subscriptionOptions: client.subscriptionOptions || {
          hetchin: true,
          delivery: true,
        },
        manager: client.manager || {
          name: "",
          nameEn: "",
          email: "",
          phone: "",
        },
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

    if (formData.numberOfUsers && isNaN(formData.numberOfUsers)) {
      newErrors.numberOfUsers = t(translations.invalidNumber);
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

  const handleSubscriptionOptionChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      subscriptionOptions: {
        ...prev.subscriptionOptions,
        [option]: !prev.subscriptionOptions[option],
      },
    }));
  };

  const handleManagerChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      manager: {
        ...prev.manager,
        [field]: value,
      },
    }));
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

        {/* Number of Users */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {t(translations.numberOfUsers)}
          </label>
          <input
            type="number"
            name="numberOfUsers"
            value={formData.numberOfUsers}
            onChange={handleChange}
            className={`input-field ${
              errors.numberOfUsers
                ? "border-error-500 focus:ring-error-500"
                : ""
            }`}
            placeholder={t(translations.numberOfUsers)}
            min="0"
          />
          {errors.numberOfUsers && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.numberOfUsers}
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

      {/* Client Manager Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
          {t(translations.clientManager)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manager Arabic Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerNameAr)}
            </label>
            <input
              type="text"
              value={formData.manager.name}
              onChange={(e) => handleManagerChange("name", e.target.value)}
              className="input-field"
              placeholder={t(translations.managerNameAr)}
              dir="rtl"
            />
          </div>

          {/* Manager English Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerNameEn)}
            </label>
            <input
              type="text"
              value={formData.manager.nameEn}
              onChange={(e) => handleManagerChange("nameEn", e.target.value)}
              className="input-field"
              placeholder={t(translations.managerNameEn)}
              dir="ltr"
            />
          </div>

          {/* Manager Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerEmail)}
            </label>
            <input
              type="email"
              value={formData.manager.email}
              onChange={(e) => handleManagerChange("email", e.target.value)}
              className="input-field"
              placeholder={t(translations.managerEmail)}
              dir="ltr"
            />
          </div>

          {/* Manager Phone */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.managerPhone)}
            </label>
            <input
              type="tel"
              value={formData.manager.phone}
              onChange={(e) => handleManagerChange("phone", e.target.value)}
              className="input-field"
              placeholder={t(translations.managerPhone)}
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Subscription Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
          {t(translations.subscriptionOptions)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
            <input
              type="checkbox"
              id="hetchin"
              checked={formData.subscriptionOptions.hetchin}
              onChange={() => handleSubscriptionOptionChange("hetchin")}
              className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
            />
            <label
              htmlFor="hetchin"
              className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
            >
              {t(translations.hetchin)}
            </label>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
            <input
              type="checkbox"
              id="delivery"
              checked={formData.subscriptionOptions.delivery}
              onChange={() => handleSubscriptionOptionChange("delivery")}
              className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
            />
            <label
              htmlFor="delivery"
              className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
            >
              {t(translations.delivery)}
            </label>
          </div>
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

export default ClientForm;
