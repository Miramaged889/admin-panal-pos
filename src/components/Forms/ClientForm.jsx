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
    // Company Information
    companyName: "",
    companyNameEn: "",
    commercialRecord: "",
    companyActivityType: "cafe", // cafe, restaurant, catering, other
    otherActivityType: "", // for when "other" is selected

    // Client Information
    name: "",
    nameEn: "",
    email: "",
    phone: "",

    // Subscription Information
    subscriptionStart: "",
    subscriptionEnd: "",
    numberOfUsers: "",
    numberOfBranches: "", // New field for number of branches
    subscriptionPrice: "",
    currency: "SAR", // SAR, USD, EUR
    isFreeTrial: false, // New field for free trial

    // Subscription Options
    subscriptionOptions: {
      ketchin: true,
      delivery: true,
    },

    // Manager/Admin Access
    managerEmail: "",
    managerPassword: "",

    // Multiple Clients Support
    additionalClients: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    nameEn: "",
    email: "",
    phone: "",
  });
  const [currentStage, setCurrentStage] = useState(1); // 1 or 2

  useEffect(() => {
    if (client) {
      setFormData({
        companyName: client.companyName || "",
        companyNameEn: client.companyNameEn || "",
        commercialRecord: client.commercialRecord || "",
        companyActivityType: client.companyActivityType || "cafe",
        otherActivityType: client.otherActivityType || "",
        name: client.name || "",
        nameEn: client.nameEn || "",
        email: client.email || "",
        phone: client.phone || "",
        subscriptionStart: client.subscriptionStart || "",
        subscriptionEnd: client.subscriptionEnd || "",
        numberOfUsers: client.numberOfUsers || "",
        numberOfBranches: client.numberOfBranches || "", // Initialize new field
        subscriptionPrice: client.subscriptionPrice || "",
        currency: client.currency || "SAR",
        isFreeTrial: client.isFreeTrial || false,
        subscriptionOptions: client.subscriptionOptions || {
          ketchin: true,
          delivery: true,
        },
        managerEmail: client.managerEmail || "",
        managerPassword: client.managerPassword || "",
        additionalClients: client.additionalClients || [],
      });
    }
  }, [client]);

  const validateStage1 = () => {
    const newErrors = {};

    // Company validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = t(translations.required);
    }

    if (!formData.companyNameEn.trim()) {
      newErrors.companyNameEn = t(translations.required);
    }

    if (!formData.commercialRecord.trim()) {
      newErrors.commercialRecord = t(translations.required);
    }

    if (
      formData.companyActivityType === "other" &&
      !formData.otherActivityType.trim()
    ) {
      newErrors.otherActivityType = t(translations.required);
    }

    // Client validation
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

    // Subscription validation
    if (!formData.isFreeTrial) {
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
    }

    if (formData.numberOfUsers && isNaN(formData.numberOfUsers)) {
      newErrors.numberOfUsers = t(translations.invalidNumber);
    }

    if (formData.numberOfBranches && isNaN(formData.numberOfBranches)) {
      newErrors.numberOfBranches = t(translations.invalidNumber);
    }

    if (formData.subscriptionPrice && isNaN(formData.subscriptionPrice)) {
      newErrors.subscriptionPrice = t(translations.invalidNumber);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStage2 = () => {
    const newErrors = {};

    // Manager validation
    if (!formData.managerEmail.trim()) {
      newErrors.managerEmail = t(translations.required);
    } else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) {
      newErrors.managerEmail = t(translations.invalidEmail);
    }

    if (!formData.managerPassword.trim()) {
      newErrors.managerPassword = t(translations.required);
    } else if (formData.managerPassword.length < 6) {
      newErrors.managerPassword = t({
        en: "Password must be at least 6 characters",
        ar: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStage = () => {
    if (validateStage1()) {
      setCurrentStage(2);
    }
  };

  const handlePreviousStage = () => {
    setCurrentStage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStage === 1) {
      if (validateStage1()) {
        handleNextStage();
      }
      return;
    }

    if (!validateStage2()) return;

    setIsLoading(true);

    try {
      let clientData = {
        ...formData,
        status:
          new Date() > new Date(formData.subscriptionEnd)
            ? "expired"
            : "active",
      };

      // Handle free trial logic
      if (formData.isFreeTrial) {
        const today = new Date();
        const trialEndDate = new Date();
        trialEndDate.setDate(today.getDate() + 14); // Fixed 14 days trial

        clientData = {
          ...clientData,
          subscriptionStart: today.toISOString().split("T")[0],
          subscriptionEnd: trialEndDate.toISOString().split("T")[0],
          subscriptionPrice: "0.00",
        };
      }

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

  const handleAddClient = () => {
    if (newClient.name && newClient.nameEn && newClient.email) {
      setFormData((prev) => ({
        ...prev,
        additionalClients: [
          ...prev.additionalClients,
          { ...newClient, id: Date.now() },
        ],
      }));
      setNewClient({ name: "", nameEn: "", email: "", phone: "" });
      setShowAddClient(false);
    }
  };

  const handleRemoveClient = (clientId) => {
    setFormData((prev) => ({
      ...prev,
      additionalClients: prev.additionalClients.filter(
        (client) => client.id !== clientId
      ),
    }));
  };

  const handleNewClientChange = (field, value) => {
    setNewClient((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center ${
              currentStage >= 1 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStage >= 1
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "border-gray-300"
              }`}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium">
              {t({ en: "Basic Information", ar: "المعلومات الأساسية" })}
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div
            className={`flex items-center ${
              currentStage >= 2 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStage >= 2
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "border-gray-300"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium">
              {t({ en: "Manager Access", ar: "وصول المدير" })}
            </span>
          </div>
        </div>
      </div>

      {currentStage === 1 && (
        <>
          {/* Company Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
              {t({ en: "Company Information", ar: "معلومات الشركة" })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Arabic Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Company Name (Arabic)", ar: "اسم الشركة (عربي)" })}{" "}
                  <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.companyName
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t({
                    en: "Company Name (Arabic)",
                    ar: "اسم الشركة (عربي)",
                  })}
                  dir="rtl"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Company English Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({
                    en: "Company Name (English)",
                    ar: "اسم الشركة (إنجليزي)",
                  })}{" "}
                  <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyNameEn"
                  value={formData.companyNameEn}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.companyNameEn
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t({
                    en: "Company Name (English)",
                    ar: "اسم الشركة (إنجليزي)",
                  })}
                  dir="ltr"
                />
                {errors.companyNameEn && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.companyNameEn}
                  </p>
                )}
              </div>

              {/* Commercial Record */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Commercial Record", ar: "السجل التجاري" })}{" "}
                  <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  name="commercialRecord"
                  value={formData.commercialRecord}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.commercialRecord
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t({
                    en: "Commercial Record",
                    ar: "السجل التجاري",
                  })}
                  dir="ltr"
                />
                {errors.commercialRecord && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.commercialRecord}
                  </p>
                )}
              </div>

              {/* Company Activity Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Activity Type", ar: "نوع النشاط" })}
                </label>
                <select
                  name="companyActivityType"
                  value={formData.companyActivityType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="cafe">{t({ en: "Cafe", ar: "مقهى" })}</option>
                  <option value="restaurant">
                    {t({ en: "Restaurant", ar: "مطعم" })}
                  </option>
                  <option value="catering">
                    {t({ en: "Catering", ar: "خدمات الطعام" })}
                  </option>
                  <option value="other">
                    {t({ en: "Other", ar: "أخرى" })}
                  </option>
                </select>
              </div>

              {/* Other Activity Type Input */}
              {formData.companyActivityType === "other" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Specify Activity Type", ar: "تحديد نوع النشاط" })}{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="otherActivityType"
                    value={formData.otherActivityType}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.otherActivityType
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({
                      en: "Enter activity type",
                      ar: "أدخل نوع النشاط",
                    })}
                    dir="ltr"
                  />
                  {errors.otherActivityType && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.otherActivityType}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subscription Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
              {t({ en: "Subscription Information", ar: "معلومات الاشتراك" })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Number of Branches */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t(translations.numberOfBranches)}
                </label>
                <input
                  type="number"
                  name="numberOfBranches"
                  value={formData.numberOfBranches}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.numberOfBranches
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t(translations.numberOfBranches)}
                  min="0"
                />
                {errors.numberOfBranches && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.numberOfBranches}
                  </p>
                )}
              </div>

              {/* Subscription Price */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Subscription Price", ar: "سعر الاشتراك" })}
                </label>
                <input
                  type="number"
                  name="subscriptionPrice"
                  value={
                    formData.isFreeTrial ? "0.00" : formData.subscriptionPrice
                  }
                  onChange={handleChange}
                  disabled={formData.isFreeTrial}
                  className={`input-field ${
                    errors.subscriptionPrice
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  } ${
                    formData.isFreeTrial ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.subscriptionPrice && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.subscriptionPrice}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Currency", ar: "العملة" })}
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="SAR">
                    {t({ en: "Saudi Riyal (SAR)", ar: "الريال السعودي (SAR)" })}
                  </option>
                  <option value="USD">
                    {t({ en: "US Dollar (USD)", ar: "الدولار الأمريكي (USD)" })}
                  </option>
                  <option value="EUR">
                    {t({ en: "Euro (EUR)", ar: "اليورو (EUR)" })}
                  </option>
                </select>
              </div>

              {/* Free Trial Option */}
              <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
                <input
                  type="checkbox"
                  id="isFreeTrial"
                  checked={formData.isFreeTrial}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isFreeTrial: !prev.isFreeTrial,
                    }))
                  }
                  className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
                />
                <label
                  htmlFor="isFreeTrial"
                  className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                >
                  {t(translations.freeTrial)} (14{" "}
                  {t({ en: "days", ar: "أيام" })})
                </label>
              </div>

              {/* Subscription Start Date */}
              <DatePicker
                label={t(translations.subscriptionStart)}
                value={formData.subscriptionStart}
                onChange={(value) =>
                  handleDateChange("subscriptionStart", value)
                }
                required={!formData.isFreeTrial}
                error={errors.subscriptionStart}
                max={formData.subscriptionEnd || undefined}
              />

              {/* Subscription End Date */}
              <DatePicker
                label={t(translations.subscriptionEnd)}
                value={formData.subscriptionEnd}
                onChange={(value) => handleDateChange("subscriptionEnd", value)}
                required={!formData.isFreeTrial}
                error={errors.subscriptionEnd}
                min={formData.subscriptionStart || undefined}
              />
            </div>
          </div>

          {/* Subscription Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
              {t(translations.subscriptionOptions)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
                <input
                  type="checkbox"
                  id="ketchin"
                  checked={formData.subscriptionOptions.ketchin}
                  onChange={() => handleSubscriptionOptionChange("ketchin")}
                  className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
                />
                <label
                  htmlFor="ketchin"
                  className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                >
                  {t(translations.ketchin)}
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

          {/* Main Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
              {t({
                en: "Main Client Information",
                ar: "معلومات العميل الرئيسي",
              })}
            </h3>
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
                  {t(translations.email)}{" "}
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
                  {t(translations.phone)}{" "}
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
                  placeholder={t(translations.phone)}
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Clients */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border-light dark:border-border-dark pb-2">
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
                {t({ en: "Additional Clients", ar: "عملاء إضافيون" })}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddClient(!showAddClient)}
                className="btn-secondary text-sm"
              >
                {showAddClient
                  ? t({ en: "Cancel", ar: "إلغاء" })
                  : t({ en: "Add Client", ar: "إضافة عميل" })}
              </button>
            </div>

            {/* Add New Client Form */}
            {showAddClient && (
              <div className="p-4 border border-border-light dark:border-border-dark rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t({
                      en: "Client Name (Arabic)",
                      ar: "اسم العميل (عربي)",
                    })}
                    value={newClient.name}
                    onChange={(e) =>
                      handleNewClientChange("name", e.target.value)
                    }
                    className="input-field"
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder={t({
                      en: "Client Name (English)",
                      ar: "اسم العميل (إنجليزي)",
                    })}
                    value={newClient.nameEn}
                    onChange={(e) =>
                      handleNewClientChange("nameEn", e.target.value)
                    }
                    className="input-field"
                    dir="ltr"
                  />
                  <input
                    type="email"
                    placeholder={t({ en: "Email", ar: "البريد الإلكتروني" })}
                    value={newClient.email}
                    onChange={(e) =>
                      handleNewClientChange("email", e.target.value)
                    }
                    className="input-field"
                    dir="ltr"
                  />
                  <input
                    type="tel"
                    placeholder={t({ en: "Phone", ar: "الهاتف" })}
                    value={newClient.phone}
                    onChange={(e) =>
                      handleNewClientChange("phone", e.target.value)
                    }
                    className="input-field"
                    dir="ltr"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddClient}
                  className="btn-primary text-sm"
                >
                  {t({ en: "Add Client", ar: "إضافة العميل" })}
                </button>
              </div>
            )}

            {/* List of Additional Clients */}
            {formData.additionalClients.length > 0 && (
              <div className="space-y-2">
                {formData.additionalClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex justify-between items-center p-3 border border-border-light dark:border-border-dark rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {client.name} / {client.nameEn}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {client.email} - {client.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveClient(client.id)}
                      className="text-error-500 hover:text-error-600 text-sm"
                    >
                      {t({ en: "Remove", ar: "إزالة" })}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {currentStage === 2 && (
        <>
          {/* Manager/Admin Access */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
              {t({ en: "Manager Access", ar: "وصول المدير" })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manager Email */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Manager Email", ar: "بريد المدير" })}{" "}
                  <span className="text-error-500">*</span>
                </label>
                <input
                  type="email"
                  name="managerEmail"
                  value={formData.managerEmail}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.managerEmail
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t({ en: "Manager Email", ar: "بريد المدير" })}
                  dir="ltr"
                />
                {errors.managerEmail && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.managerEmail}
                  </p>
                )}
              </div>

              {/* Manager Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {t({ en: "Manager Password", ar: "كلمة مرور المدير" })}{" "}
                  <span className="text-error-500">*</span>
                </label>
                <input
                  type="password"
                  name="managerPassword"
                  value={formData.managerPassword}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.managerPassword
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t({
                    en: "Manager Password",
                    ar: "كلمة مرور المدير",
                  })}
                  dir="ltr"
                />
                {errors.managerPassword && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.managerPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Form Actions */}
      <div className="flex justify-between gap-3 pt-4 border-t border-border-light dark:border-border-dark">
        <div>
          {currentStage === 2 && (
            <button
              type="button"
              onClick={handlePreviousStage}
              className="btn-secondary"
              disabled={isLoading}
            >
              {t({ en: "Previous", ar: "السابق" })}
            </button>
          )}
        </div>
        <div className="flex gap-3">
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
            ) : currentStage === 1 ? (
              t({ en: "Next", ar: "التالي" })
            ) : (
              t(translations.save)
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;
