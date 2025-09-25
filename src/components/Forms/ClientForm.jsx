import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectClientsLoading,
  selectClientsError,
  selectClientsSuccess,
  selectTenantUsersLoading,
  selectTenantUsersError,
  selectTenantUsersSuccess,
} from "../../store/selectors";
import {
  createTenant,
  updateTenant,
  createClient,
  createTenantUser,
  updateManager,
  clearClientsError,
  clearClientsSuccess,
  clearTenantUsersError,
  clearTenantUsersSuccess,
} from "../../store/actions";
import DatePicker from "../UI/DatePicker";
import { toast } from "../UI/Toast";

const ClientForm = ({
  client,
  onClose,
  isEditMode = false,
  onUpdate,
  initialStage = 1,
}) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  // Loading states
  const clientsLoading = useAppSelector(selectClientsLoading);
  const tenantUsersLoading = useAppSelector(selectTenantUsersLoading);
  const loading = clientsLoading || tenantUsersLoading;

  // Error states
  const clientsError = useAppSelector(selectClientsError);
  const tenantUsersError = useAppSelector(selectTenantUsersError);
  const error = clientsError || tenantUsersError;

  // Success states
  const clientsSuccess = useAppSelector(selectClientsSuccess);
  const tenantUsersSuccess = useAppSelector(selectTenantUsersSuccess);
  const success = clientsSuccess || tenantUsersSuccess;

  const [formData, setFormData] = useState({
    // Stage 1: Tenant/Subscription Information
    arabic_name: "",
    english_name: "",
    Commercial_Record: "",
    Activity_Type: "cafe", // cafe, restaurant, catering, other
    otherActivityType: "", // for when "other" is selected
    Start_Date: "",
    End_Date: "",
    no_users: "",
    no_branches: "",
    Subscription_Price: "",
    Currency: "SAR", // SAR, USD, EUR
    on_trial: false,
    is_active: true,
    modules_enabled: {
      kitchen: true,
      reports: true, // Always true, not shown in UI
      sellers: true, // Always true, not shown in UI
      Delivery: true,
    },
    subdomain: "",

    // Stage 2: Client Information
    client_arabic_name: "",
    client_english_name: "",
    client_email: "",
    client_phone: "",

    // Stage 3: Manager Information
    manager_username: "",
    manager_email: "",
    manager_password: "",
    manager_role: "manager", // Default role
  });

  const [errors, setErrors] = useState({});
  const [currentStage, setCurrentStage] = useState(initialStage); // 1, 2, or 3
  const [submittedData, setSubmittedData] = useState({
    tenant: null,
    client: null,
  });

  useEffect(() => {
    if (client) {
      console.log("🔍 Initializing form with client data:", client);
      console.log("🔍 Number of branches from client:", client.no_branches);
      setFormData({
        arabic_name: client.arabic_name || "",
        english_name: client.english_name || "",
        Commercial_Record: client.Commercial_Record || "",
        Activity_Type: client.Activity_Type || "cafe",
        otherActivityType: client.otherActivityType || "",
        Start_Date: client.Start_Date || "",
        End_Date: client.End_Date || "",
        no_users: client.no_users || "",
        no_branches: client.no_branches || "",
        Subscription_Price: client.Subscription_Price || "",
        Currency: client.Currency || "SAR",
        on_trial: client.on_trial || false,
        is_active: client.is_active !== undefined ? client.is_active : true,
        modules_enabled: {
          kitchen: client.modules_enabled?.kitchen ?? true,
          reports: true, // Always true, not shown in UI
          sellers: true, // Always true, not shown in UI
          Delivery: client.modules_enabled?.Delivery ?? true,
        },
        subdomain: client.subdomain || "",
        client_arabic_name: client.client_arabic_name || "",
        client_english_name: client.client_english_name || "",
        client_email: client.client_email || "",
        client_phone: client.client_phone || "",
        manager_username: client.manager_username || "",
        manager_email: client.manager_email || "",
        manager_password: client.manager_password || "",
        manager_role: client.manager_role || "manager",
      });
    }
  }, [client]);

  // Update currentStage when initialStage prop changes
  useEffect(() => {
    setCurrentStage(initialStage);
  }, [initialStage]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(t({ en: success, ar: success }));
      dispatch(clearClientsSuccess());
      dispatch(clearTenantUsersSuccess());

      // If we're on the final stage and everything is successful, close the form
      if (currentStage === 3 && submittedData.tenant && submittedData.client) {
        onClose();
      }
    }
  }, [success, dispatch, t, onClose, currentStage, submittedData]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || error;
      toast.error(t({ en: errorMessage, ar: errorMessage }));
      dispatch(clearClientsError());
      dispatch(clearTenantUsersError());
    }
  }, [error, dispatch, t]);

  const validateStage1 = () => {
    const newErrors = {};

    // Company validation
    if (!formData.arabic_name.trim()) {
      newErrors.arabic_name = t(translations.required);
    }

    if (!formData.english_name.trim()) {
      newErrors.english_name = t(translations.required);
    }

    if (
      formData.Activity_Type === "other" &&
      !formData.otherActivityType.trim()
    ) {
      newErrors.otherActivityType = t(translations.required);
    }

    // Subdomain validation
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = t(translations.required);
    }

    // Subscription validation
    if (!formData.Start_Date) {
      newErrors.Start_Date = t(translations.required);
    }

    if (!formData.End_Date) {
      newErrors.End_Date = t(translations.required);
    }

    if (
      !formData.Subscription_Price ||
      formData.Subscription_Price === "0.00"
    ) {
      newErrors.Subscription_Price = t(translations.required);
    }

    if (formData.Start_Date && formData.End_Date) {
      if (new Date(formData.Start_Date) >= new Date(formData.End_Date)) {
        newErrors.End_Date = t({
          en: "End date must be after start date",
          ar: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية",
        });
      }
    }

    if (formData.no_users && isNaN(formData.no_users)) {
      newErrors.no_users = t(translations.invalidNumber);
    }

    if (formData.no_branches && isNaN(formData.no_branches)) {
      newErrors.no_branches = t(translations.invalidNumber);
    }

    if (formData.Subscription_Price && isNaN(formData.Subscription_Price)) {
      newErrors.Subscription_Price = t(translations.invalidNumber);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStage2 = () => {
    const newErrors = {};

    // Client validation
    if (!formData.client_arabic_name.trim()) {
      newErrors.client_arabic_name = t(translations.required);
    }

    if (!formData.client_english_name.trim()) {
      newErrors.client_english_name = t(translations.required);
    }

    if (!formData.client_email.trim()) {
      newErrors.client_email = t(translations.required);
    } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
      newErrors.client_email = t(translations.invalidEmail);
    }

    if (!formData.client_phone.trim()) {
      newErrors.client_phone = t(translations.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStage3 = () => {
    const newErrors = {};

    // Manager validation
    if (!formData.manager_username.trim()) {
      newErrors.manager_username = t(translations.required);
    }

    if (!formData.manager_email.trim()) {
      newErrors.manager_email = t(translations.required);
    } else if (!/\S+@\S+\.\S+/.test(formData.manager_email)) {
      newErrors.manager_email = t(translations.invalidEmail);
    }

    if (!formData.manager_password.trim()) {
      newErrors.manager_password = t(translations.required);
    } else if (formData.manager_password.length < 6) {
      newErrors.manager_password = t({
        en: "Password must be at least 6 characters",
        ar: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStage = async () => {
    if (currentStage === 1) {
      if (validateStage1()) {
        // In edit mode, just move to next stage without API call
        if (isEditMode) {
          setCurrentStage(2);
          return;
        }
        // Submit tenant data to /ten/tenants/
        try {
          const tenantData = {
            id: 1, // API expects this field
            arabic_name: formData.arabic_name.trim(),
            english_name: formData.english_name.trim(),
            Commercial_Record: formData.Commercial_Record
              ? parseInt(formData.Commercial_Record)
              : 123,
            Activity_Type:
              formData.Activity_Type === "other"
                ? formData.otherActivityType.trim() || "other"
                : formData.Activity_Type,
            no_users: formData.no_users ? parseInt(formData.no_users) : 1,
            no_branches: formData.no_branches
              ? parseInt(formData.no_branches)
              : 1,
            Subscription_Price: formData.Subscription_Price || "767.23",
            Currency: formData.Currency,
            on_trial: formData.on_trial,
            is_active: formData.is_active,
            Start_Date: formData.Start_Date || "2025-08-01",
            End_Date: formData.End_Date || "2030-01-01",
            modules_enabled: {
              kitchen: formData.modules_enabled.kitchen,
              Delivery: formData.modules_enabled.Delivery,
            },
            subdomain: formData.subdomain.trim(),
            image: null, // API expects this field
          };

          console.log("🚀 About to create tenant with data:", tenantData);
          const result = await dispatch(createTenant(tenantData)).unwrap();
          setSubmittedData((prev) => ({ ...prev, tenant: result }));
          setCurrentStage(2);
        } catch (error) {
          console.error("❌ Failed to create tenant:", error);
          console.error("Full error details:", {
            message: error.message,
            response: error.response,
            request: error.request,
            config: error.config,
          });

          // Show user-friendly error message
          toast.error(
            error.message ||
              t({
                en: "Failed to create tenant. Please check your data and try again.",
                ar: "فشل في إنشاء المستأجر. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
              })
          );
        }
      }
    } else if (currentStage === 2) {
      if (validateStage2()) {
        // In edit mode, just move to next stage without API call
        if (isEditMode) {
          setCurrentStage(3);
          return;
        }
        // Submit client data to /ten/clients/
        try {
          const clientData = {
            arabic_name: formData.client_arabic_name.trim(),
            english_name: formData.client_english_name.trim(),
            email: formData.client_email.trim(),
            phone: formData.client_phone.trim(),
          };

          const result = await dispatch(
            createClient({
              clientData,
              tenantId: submittedData.tenant.id,
            })
          ).unwrap();
          setSubmittedData((prev) => ({ ...prev, client: result }));
          setCurrentStage(3);
        } catch (error) {
          console.error("❌ Failed to create client:", error);

          // Show user-friendly error message
          toast.error(
            error.message ||
              t({
                en: "Failed to create client. Please check your data and try again.",
                ar: "فشل في إنشاء العميل. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
              })
          );
        }
      }
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStage < 3) {
      await handleNextStage();
      return;
    }

    if (!validateStage3()) return;

    try {
      if (isEditMode) {
        // Always update tenant data in edit mode, regardless of current stage
        const tenantData = {
          id: client.id,
          arabic_name: formData.arabic_name.trim(),
          english_name: formData.english_name.trim(),
          Commercial_Record: formData.Commercial_Record
            ? parseInt(formData.Commercial_Record)
            : client.Commercial_Record || 123,
          Activity_Type:
            formData.Activity_Type === "other"
              ? formData.otherActivityType.trim() || "other"
              : formData.Activity_Type,
          no_users: formData.no_users
            ? parseInt(formData.no_users)
            : client.no_users || 1,
          no_branches: formData.no_branches
            ? parseInt(formData.no_branches)
            : client.no_branches || 1,
          Subscription_Price:
            formData.Subscription_Price ||
            client.Subscription_Price ||
            "767.23",
          Currency: formData.Currency || client.Currency || "SAR",
          on_trial:
            formData.on_trial !== undefined
              ? formData.on_trial
              : client.on_trial || false,
          is_active:
            formData.is_active !== undefined
              ? formData.is_active
              : client.is_active !== undefined
              ? client.is_active
              : true,
          Start_Date: formData.Start_Date || client.Start_Date || "2025-08-01",
          End_Date: formData.End_Date || client.End_Date || "2030-01-01",
          modules_enabled: {
            kitchen:
              formData.modules_enabled?.kitchen !== undefined
                ? formData.modules_enabled.kitchen
                : client.modules_enabled?.kitchen ?? true,
            Delivery:
              formData.modules_enabled?.Delivery !== undefined
                ? formData.modules_enabled.Delivery
                : client.modules_enabled?.Delivery ?? true,
          },
          subdomain: formData.subdomain.trim() || client.subdomain || "",
          image: null,
        };

        console.log("🚀 About to update tenant with data:", tenantData);
        console.log("📊 Original client data for reference:", client);
        console.log("📊 Form data no_branches:", formData.no_branches);
        console.log("📊 Tenant data no_branches:", tenantData.no_branches);
        await dispatch(updateTenant({ id: client.id, tenantData })).unwrap();

        // Update manager if there's manager data
        if (
          formData.manager_username &&
          formData.manager_email &&
          formData.manager_password
        ) {
          const managerData = {
            username: formData.manager_username.trim(),
            email: formData.manager_email.trim(),
            password: formData.manager_password,
            role: formData.manager_role,
          };

          console.log("🚀 About to update manager with data:", managerData);
          await dispatch(
            updateManager({
              subdomain: client.subdomain,
              id: client.manager_id || 1, // Assuming there's a manager_id field
              managerData,
            })
          ).unwrap();
        }

        toast.success(
          t({ en: "Client updated successfully", ar: "تم تحديث العميل بنجاح" })
        );
        if (onUpdate) onUpdate();
        onClose();
      } else {
        // Create new manager data to /api/saas/addtenantusers/
        const managerData = {
          username: formData.manager_username.trim(),
          email: formData.manager_email.trim(),
          password: formData.manager_password,
          role: formData.manager_role,
          schema:
            submittedData.tenant?.subdomain || String(submittedData.tenant?.id), // Use subdomain first, then convert ID to string
        };

        console.log("🚀 About to create manager with data:", managerData);
        console.log("📋 Tenant data available:", submittedData.tenant);
        await dispatch(createTenantUser(managerData)).unwrap();

        // Form is complete, success message will be shown and form will close
      }
    } catch (error) {
      console.error("❌ Failed to submit:", error);

      // Show user-friendly error message
      toast.error(
        error.message ||
          t({
            en: isEditMode
              ? "Failed to update client. Please check your data and try again."
              : "Failed to create manager. Please check your data and try again.",
            ar: isEditMode
              ? "فشل في تحديث العميل. يرجى التحقق من البيانات والمحاولة مرة أخرى."
              : "فشل في إنشاء المدير. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
          })
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Debug logging for no_branches field
    if (name === "no_branches") {
      console.log("🔍 Updating no_branches field:", value);
    }

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

  const handleModuleChange = (module) => {
    setFormData((prev) => ({
      ...prev,
      modules_enabled: {
        ...prev.modules_enabled,
        [module]: !prev.modules_enabled[module],
      },
    }));
  };

  return (
    <>
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
                {t({ en: "Tenant Setup", ar: "إعداد المستأجر" })}
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
                {t({ en: "Client Info", ar: "معلومات العميل" })}
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                currentStage >= 3 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStage >= 3
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "border-gray-300"
                }`}
              >
                3
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
                    {t({
                      en: "Company Name (Arabic)",
                      ar: "اسم الشركة (عربي)",
                    })}{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="arabic_name"
                    value={formData.arabic_name}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.arabic_name
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({
                      en: "Company Name (Arabic)",
                      ar: "اسم الشركة (عربي)",
                    })}
                    dir="rtl"
                  />
                  {errors.arabic_name && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.arabic_name}
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
                    name="english_name"
                    value={formData.english_name}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.english_name
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({
                      en: "Company Name (English)",
                      ar: "اسم الشركة (إنجليزي)",
                    })}
                    dir="ltr"
                  />
                  {errors.english_name && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.english_name}
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
                    name="Commercial_Record"
                    value={formData.Commercial_Record}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.Commercial_Record
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({
                      en: "Commercial Record",
                      ar: "السجل التجاري",
                    })}
                    dir="ltr"
                  />
                  {errors.Commercial_Record && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.Commercial_Record}
                    </p>
                  )}
                </div>

                {/* Company Activity Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Activity Type", ar: "نوع النشاط" })}
                  </label>
                  <select
                    name="Activity_Type"
                    value={formData.Activity_Type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="cafe">
                      {t({ en: "Cafe", ar: "مقهى" })}
                    </option>
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

                {/* Subdomain */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Subdomain", ar: "المجال الفرعي" })}{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.subdomain
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({
                      en: "Enter subdomain",
                      ar: "أدخل المجال الفرعي",
                    })}
                    dir="ltr"
                  />
                  {errors.subdomain && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.subdomain}
                    </p>
                  )}
                </div>

                {/* Other Activity Type Input */}
                {formData.Activity_Type === "other" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                      {t({
                        en: "Specify Activity Type",
                        ar: "تحديد نوع النشاط",
                      })}{" "}
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
                    name="no_users"
                    value={formData.no_users}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.no_users
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t(translations.numberOfUsers)}
                    min="0"
                  />
                  {errors.no_users && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.no_users}
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
                    name="no_branches"
                    value={formData.no_branches}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.no_branches
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t(translations.numberOfBranches)}
                    min="0"
                  />
                  {errors.no_branches && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.no_branches}
                    </p>
                  )}
                </div>

                {/* Subscription Price */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Subscription Price", ar: "سعر الاشتراك" })}{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Subscription_Price"
                    value={formData.Subscription_Price}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.Subscription_Price
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.Subscription_Price && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.Subscription_Price}
                    </p>
                  )}
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Currency", ar: "العملة" })}
                  </label>
                  <select
                    name="Currency"
                    value={formData.Currency}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="SAR">
                      {t({
                        en: "Saudi Riyal (SAR)",
                        ar: "الريال السعودي (SAR)",
                      })}
                    </option>
                    <option value="USD">
                      {t({
                        en: "US Dollar (USD)",
                        ar: "الدولار الأمريكي (USD)",
                      })}
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
                    id="on_trial"
                    checked={formData.on_trial}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        on_trial: !prev.on_trial,
                      }))
                    }
                    className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label
                    htmlFor="on_trial"
                    className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                  >
                    {t(translations.freeTrial)}
                  </label>
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                  >
                    {t({ en: "Active", ar: "نشط" })}
                  </label>
                </div>

                {/* Subscription Start Date */}
                <DatePicker
                  label={t(translations.subscriptionStart)}
                  value={formData.Start_Date}
                  onChange={(value) => handleDateChange("Start_Date", value)}
                  required={true}
                  error={errors.Start_Date}
                  max={formData.End_Date || undefined}
                />

                {/* Subscription End Date */}
                <DatePicker
                  label={t(translations.subscriptionEnd)}
                  value={formData.End_Date}
                  onChange={(value) => handleDateChange("End_Date", value)}
                  required={true}
                  error={errors.End_Date}
                  min={formData.Start_Date || undefined}
                />
              </div>
            </div>

            {/* Modules Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
                {t({ en: "Modules Configuration", ar: "إعدادات الوحدات" })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <input
                    type="checkbox"
                    id="kitchen"
                    checked={formData.modules_enabled.kitchen}
                    onChange={() => handleModuleChange("kitchen")}
                    className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label
                    htmlFor="kitchen"
                    className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                  >
                    {t({ en: "Kitchen", ar: "المطبخ" })}
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <input
                    type="checkbox"
                    id="Delivery"
                    checked={formData.modules_enabled.Delivery}
                    onChange={() => handleModuleChange("Delivery")}
                    className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label
                    htmlFor="Delivery"
                    className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                  >
                    {t(translations.delivery)}
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {currentStage === 2 && (
          <>
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
                {t({
                  en: "Client Information",
                  ar: "معلومات العميل",
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
                    name="client_arabic_name"
                    value={formData.client_arabic_name}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.client_arabic_name
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t(translations.clientNameAr)}
                    dir="rtl"
                  />
                  {errors.client_arabic_name && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.client_arabic_name}
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
                    name="client_english_name"
                    value={formData.client_english_name}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.client_english_name
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t(translations.clientNameEn)}
                    dir="ltr"
                  />
                  {errors.client_english_name && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.client_english_name}
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
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.client_email
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t(translations.email)}
                    dir="ltr"
                  />
                  {errors.client_email && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.client_email}
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
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.client_phone
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t(translations.phone)}
                    dir="ltr"
                  />
                  {errors.client_phone && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.client_phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {currentStage === 3 && (
          <>
            {/* Manager/Admin Access */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
                {t({ en: "Manager Access", ar: "وصول المدير" })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manager Username */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Username", ar: "اسم المستخدم" })}{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="manager_username"
                    value={formData.manager_username}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.manager_username
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({ en: "Username", ar: "اسم المستخدم" })}
                    dir="ltr"
                  />
                  {errors.manager_username && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.manager_username}
                    </p>
                  )}
                </div>

                {/* Manager Email */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Manager Email", ar: "بريد المدير" })}{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="manager_email"
                    value={formData.manager_email}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.manager_email
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({ en: "Manager Email", ar: "بريد المدير" })}
                    dir="ltr"
                  />
                  {errors.manager_email && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.manager_email}
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
                    name="manager_password"
                    value={formData.manager_password}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.manager_password
                        ? "border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                    placeholder={t({
                      en: "Manager Password",
                      ar: "كلمة مرور المدير",
                    })}
                    dir="ltr"
                  />
                  {errors.manager_password && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                      {errors.manager_password}
                    </p>
                  )}
                </div>

                {/* Manager Role */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Role", ar: "الدور" })}
                  </label>
                  <select
                    name="manager_role"
                    value={formData.manager_role}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="manager">
                      {t({ en: "Manager", ar: "مدير" })}
                    </option>
                    <option value="admin">
                      {t({ en: "Admin", ar: "مدير النظام" })}
                    </option>
                    <option value="user">
                      {t({ en: "User", ar: "مستخدم" })}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Form Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-border-light dark:border-border-dark">
          <div>
            {currentStage > 1 && (
              <button
                type="button"
                onClick={handlePreviousStage}
                className="btn-secondary"
                disabled={loading}
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
              disabled={loading}
            >
              {t(translations.cancel)}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t(translations.loading)}
                </div>
              ) : isEditMode ? (
                t({ en: "Save Changes", ar: "حفظ التغييرات" })
              ) : currentStage < 3 ? (
                t({ en: "Next", ar: "التالي" })
              ) : (
                t(translations.save)
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ClientForm;
