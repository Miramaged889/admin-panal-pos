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
  selectCurrenciesList,
} from "../../store/selectors";
import {
  createTenant,
  updateTenant,
  createClient,
  updateClient,
  clearClientsError,
  clearClientsSuccess,
  clearTenantUsersError,
  clearTenantUsersSuccess,
  fetchCurrencies,
} from "../../store/actions";
import {
  createManager,
  updateManager as updateManagerSlice,
} from "../../store/slices/managersSlice";
import DatePicker from "../UI/DatePicker";
import { toast } from "../UI/Toast";
import { Shield } from "lucide-react";

const formatDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultStartDate = () => formatDate(new Date());

const getDefaultEndDate = () => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  return formatDate(endDate);
};

// Helper function to normalize currency value (handle both string and object)
const normalizeCurrency = (currency) => {
  if (!currency) return "SAR";
  if (typeof currency === "string") return currency;
  if (typeof currency === "object" && currency.code) return currency.code;
  return "SAR";
};

// Helper function to get currency_id from currency code
const getCurrencyId = (currencyCode, currencies) => {
  if (!currencyCode || !currencies || currencies.length === 0) return null;
  const currency = currencies.find(
    (c) => c.code === currencyCode && c.is_active
  );
  return currency ? currency.id : null;
};

// Helper function to get currency object from currency code
const getCurrencyObject = (currencyCode, currencies) => {
  if (!currencyCode || !currencies || currencies.length === 0) return null;
  const currency = currencies.find(
    (c) => c.code === currencyCode && c.is_active
  );
  return currency
    ? {
        id: currency.id,
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        is_active: currency.is_active,
      }
    : null;
};

const ClientForm = ({
  client,
  onClose,
  isEditMode = false,
  onUpdate,
  initialStage = 1,
  selectedClientRecord = null,
}) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  // Loading states
  const clientsLoading = useAppSelector(selectClientsLoading);
  const tenantUsersLoading = useAppSelector(selectTenantUsersLoading);
  const loading = clientsLoading || tenantUsersLoading;

  // Currencies
  const currencies = useAppSelector(selectCurrenciesList);

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
    image: null,

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

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoStatus, setLogoStatus] = useState("unchanged");

  const [errors, setErrors] = useState({});
  const [currentStage, setCurrentStage] = useState(initialStage); // 1, 2, or 3
  const [submittedData, setSubmittedData] = useState({
    tenant: null,
    client: null,
  });

  useEffect(() => {
    if (client) {
      // Handle currency: if currency_id exists, find the code; otherwise use Currency
      let currencyCode = normalizeCurrency(client.Currency);
      if (client.currency_id && currencies.length > 0) {
        const currency = currencies.find((c) => c.id === client.currency_id);
        if (currency) {
          currencyCode = currency.code;
        }
      }

      setFormData({
        arabic_name: client.arabic_name || "",
        english_name: client.english_name || "",
        Commercial_Record: client.Commercial_Record || "",
        Activity_Type: client.Activity_Type || "cafe",
        otherActivityType: client.otherActivityType || "",
        Start_Date: client.Start_Date || getDefaultStartDate(),
        End_Date: client.End_Date || getDefaultEndDate(),
        no_users: client.no_users || "",
        no_branches: client.no_branches || "",
        Subscription_Price: client.Subscription_Price || "",
        Currency: currencyCode,
        on_trial: client.on_trial || false,
        is_active: client.is_active !== undefined ? client.is_active : true,
        modules_enabled: {
          kitchen: client.modules_enabled?.kitchen ?? true,
          reports: true, // Always true, not shown in UI
          sellers: true, // Always true, not shown in UI
          Delivery: client.modules_enabled?.Delivery ?? true,
        },
        subdomain: client.subdomain || "",
        image: null,
        client_arabic_name: client.client_arabic_name || "",
        client_english_name: client.client_english_name || "",
        client_email: client.client_email || "",
        client_phone: client.client_phone || "",
        manager_username: client.manager_username || "",
        manager_email: client.manager_email || "",
        manager_password: client.manager_password || "",
        manager_role: client.manager_role || "manager",
      });
      setLogoPreview(client.image || null);
      setLogoStatus("unchanged");
    } else {
      setLogoPreview(null);
      setLogoStatus("unchanged");
    }
  }, [client, currencies]);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  // Update currentStage when initialStage prop changes
  useEffect(() => {
    setCurrentStage(initialStage);
  }, [initialStage]);

  // Fetch currencies on component mount
  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

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
    } else {
      const subdomain = formData.subdomain.trim();
      // Check if subdomain is lowercase
      if (subdomain !== subdomain.toLowerCase()) {
        newErrors.subdomain = t({
          en: "Subdomain must be lowercase",
          ar: "المجال الفرعي يجب أن يكون بأحرف صغيرة",
        });
      }
      // Check if subdomain starts with a letter
      else if (!/^[a-z]/.test(subdomain)) {
        newErrors.subdomain = t({
          en: "Subdomain must start with a letter",
          ar: "المجال الفرعي يجب أن يبدأ بحرف",
        });
      }
      // Check if subdomain contains only letters, numbers, and hyphens
      else if (!/^[a-z0-9-]+$/.test(subdomain)) {
        newErrors.subdomain = t({
          en: "Subdomain can only contain letters, numbers, and hyphens",
          ar: "المجال الفرعي يمكن أن يحتوي على أحرف وأرقام وشرطات فقط",
        });
      }
      // Check if subdomain doesn't start or end with hyphen
      else if (subdomain.startsWith("-") || subdomain.endsWith("-")) {
        newErrors.subdomain = t({
          en: "Subdomain cannot start or end with a hyphen",
          ar: "المجال الفرعي لا يمكن أن يبدأ أو ينتهي بشرطة",
        });
      }
    }

    // Subscription validation
    if (!formData.Start_Date) {
      newErrors.Start_Date = t(translations.required);
    }

    if (!formData.End_Date) {
      newErrors.End_Date = t(translations.required);
    }

    const priceValue = formData.Subscription_Price?.toString().trim();

    if (!formData.on_trial) {
      if (!priceValue || priceValue === "0.00") {
        newErrors.Subscription_Price = t(translations.required);
      } else if (Number.isNaN(Number(priceValue))) {
        newErrors.Subscription_Price = t(translations.invalidNumber);
      } else if (Number(priceValue) <= 0) {
        newErrors.Subscription_Price = t({
          en: "Subscription price must be greater than zero",
          ar: "سعر الاشتراك يجب أن يكون أكبر من صفر",
        });
      }
    } else if (priceValue) {
      if (Number.isNaN(Number(priceValue))) {
        newErrors.Subscription_Price = t(translations.invalidNumber);
      }
    }

    if (formData.Start_Date && formData.End_Date) {
      if (new Date(formData.Start_Date) >= new Date(formData.End_Date)) {
        newErrors.End_Date = t({
          en: "End date must be after start date",
          ar: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية",
        });
      }
    }

    if (!formData.no_users || formData.no_users === "") {
      newErrors.no_users = t(translations.required);
    } else if (isNaN(formData.no_users) || parseInt(formData.no_users) < 1) {
      newErrors.no_users = t({
        en: "Number of users must be at least 1",
        ar: "عدد المستخدمين يجب أن يكون 1 على الأقل",
      });
    }

    if (!formData.no_branches || formData.no_branches === "") {
      newErrors.no_branches = t(translations.required);
    } else if (
      isNaN(formData.no_branches) ||
      parseInt(formData.no_branches) < 1
    ) {
      newErrors.no_branches = t({
        en: "Number of branches must be at least 1",
        ar: "عدد الفروع يجب أن يكون 1 على الأقل",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStage2 = () => {
    const newErrors = {};

    // Client validation - all fields are now optional
    // Only validate email format if email is provided
    if (
      formData.client_email.trim() &&
      !/\S+@\S+\.\S+/.test(formData.client_email)
    ) {
      newErrors.client_email = t(translations.invalidEmail);
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
        // In edit mode, update tenant data and move to next stage
        if (isEditMode) {
          try {
            const imageValue = resolveImageValue(true);
            const currencyCode = normalizeCurrency(
              formData.Currency || client.Currency
            );
            const currencyId = getCurrencyId(currencyCode, currencies);

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
              ...(currencyId ? { currency_id: currencyId } : {}),
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
              Start_Date:
                formData.Start_Date ||
                client.Start_Date ||
                getDefaultStartDate(),
              End_Date:
                formData.End_Date || client.End_Date || getDefaultEndDate(),
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
              ...(imageValue !== undefined ? { image: imageValue } : {}),
            };

            const tenantPayload = prepareTenantPayload(tenantData);

            await dispatch(
              updateTenant({ id: client.id, tenantData: tenantPayload })
            ).unwrap();

            // Show success message
            toast.success(
              t({
                en: "Tenant updated successfully!",
                ar: "تم تحديث المستأجر بنجاح!",
              })
            );

            // Close the form after successful update (with small delay to show success message)
            setTimeout(() => {
              onClose();
            }, 1000);
          } catch (error) {
            // Handle specific tenant update errors
            let errorMessage = error.message;
            if (error.data?.subdomain) {
              const subdomainError = error.data.subdomain[0];
              if (subdomainError.includes("already exists")) {
                errorMessage = t({
                  en: "This subdomain is already taken. Please choose a different one.",
                  ar: "هذا المجال الفرعي مستخدم بالفعل. يرجى اختيار مجال آخر.",
                });
              } else if (subdomainError.includes("lowercase")) {
                errorMessage = t({
                  en: "Subdomain must be lowercase, start with a letter, and contain only letters, numbers, and hyphens.",
                  ar: "المجال الفرعي يجب أن يكون بأحرف صغيرة، يبدأ بحرف، ويحتوي على أحرف وأرقام وشرطات فقط.",
                });
              } else {
                errorMessage = t({
                  en: `Subdomain error: ${subdomainError}`,
                  ar: `خطأ في المجال الفرعي: ${subdomainError}`,
                });
              }
            }

            toast.error(
              errorMessage ||
                t({
                  en: "Failed to update tenant. Please check your data and try again.",
                  ar: "فشل في تحديث المستأجر. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
                })
            );
            return; // Stop execution if tenant update fails
          }
        }

        // Only create new tenant if NOT in edit mode
        if (!isEditMode) {
          // Submit tenant data to /ten/tenants/ (CREATE mode only)
          try {
            const imageValue = resolveImageValue(false);
            const currencyCode = normalizeCurrency(formData.Currency);
            const currencyObj = getCurrencyObject(currencyCode, currencies);

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
              ...(currencyObj ? { Currency: currencyObj } : {}),
              on_trial: formData.on_trial,
              is_active: formData.is_active,
              Start_Date: formData.Start_Date || getDefaultStartDate(),
              End_Date: formData.End_Date || getDefaultEndDate(),
              modules_enabled: {
                kitchen: formData.modules_enabled.kitchen,
                Delivery: formData.modules_enabled.Delivery,
              },
              subdomain: formData.subdomain.trim(),
              ...(imageValue !== undefined ? { image: imageValue } : {}),
            };

            const tenantPayload = prepareTenantPayload(tenantData);

            const result = await dispatch(createTenant(tenantPayload)).unwrap();
            setSubmittedData((prev) => ({ ...prev, tenant: result }));
            setCurrentStage(2);
          } catch (error) {
            // Handle specific error types
            let errorMessage = error.message;

            // Handle cancelled requests
            if (
              error.name === "CanceledError" ||
              error.code === "ERR_CANCELED"
            ) {
              // Check if the request might have succeeded despite being cancelled
              errorMessage = t({
                en: "Request was cancelled. Please check if the tenant was created and try again if needed.",
                ar: "تم إلغاء الطلب. يرجى التحقق من إنشاء المستأجر والمحاولة مرة أخرى إذا لزم الأمر.",
              });
            }
            // Handle timeout errors
            else if (error.code === "ECONNABORTED") {
              errorMessage = t({
                en: "Request timed out. Please check your connection and try again.",
                ar: "انتهت مهلة الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
              });
            }
            // Handle network errors
            else if (!error.response && !error.request) {
              errorMessage = t({
                en: "Network error. Please check your connection and try again.",
                ar: "خطأ في الشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
              });
            }
            // Handle specific subdomain errors
            else if (error.data?.subdomain) {
              const subdomainError = error.data.subdomain[0];
              if (subdomainError.includes("already exists")) {
                errorMessage = t({
                  en: "This subdomain is already taken. Please choose a different one.",
                  ar: "هذا المجال الفرعي مستخدم بالفعل. يرجى اختيار مجال آخر.",
                });
              } else if (subdomainError.includes("lowercase")) {
                errorMessage = t({
                  en: "Subdomain must be lowercase, start with a letter, and contain only letters, numbers, and hyphens.",
                  ar: "المجال الفرعي يجب أن يكون بأحرف صغيرة، يبدأ بحرف، ويحتوي على أحرف وأرقام وشرطات فقط.",
                });
              } else {
                errorMessage = t({
                  en: `Subdomain error: ${subdomainError}`,
                  ar: `خطأ في المجال الفرعي: ${subdomainError}`,
                });
              }
            }

            // Show user-friendly error message
            toast.error(
              errorMessage ||
                t({
                  en: "Failed to create tenant. Please check your data and try again.",
                  ar: "فشل في إنشاء المستأجر. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
                })
            );
          }
        }
      }
    } else if (currentStage === 2) {
      if (validateStage2()) {
        // If editing a client record directly (not full tenant edit mode)
        if (selectedClientRecord) {
          // Update existing client record
          try {
            const clientData = {
              tenant: client.id,
              arabic_name: formData.client_arabic_name.trim(),
              english_name: formData.client_english_name.trim(),
              email: formData.client_email.trim(),
              phone: parseInt(formData.client_phone.trim()) || 0,
            };

            await dispatch(
              updateClient({
                id: selectedClientRecord.id,
                clientData,
                tenantId: client.id,
              })
            ).unwrap();

            // Show success message
            toast.success(
              t({
                en: "Client updated successfully!",
                ar: "تم تحديث العميل بنجاح!",
              })
            );

            // Close the form after successful update
            if (onUpdate) onUpdate();
            onClose();
          } catch (error) {
            // Handle specific client update errors
            let errorMessage = error.message;
            if (error.data?.email) {
              const emailError = error.data.email[0];
              if (emailError.includes("already exists")) {
                errorMessage = t({
                  en: "This email is already registered. Please use a different email.",
                  ar: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
                });
              }
            } else if (error.data?.phone) {
              const phoneError = error.data.phone[0];
              if (phoneError.includes("already exists")) {
                errorMessage = t({
                  en: "This phone number is already registered. Please use a different phone number.",
                  ar: "رقم الهاتف هذا مسجل بالفعل. يرجى استخدام رقم آخر.",
                });
              }
            }

            // Show user-friendly error message
            toast.error(
              errorMessage ||
                t({
                  en: "Failed to update client. Please check your data and try again.",
                  ar: "فشل في تحديث العميل. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
                })
            );
          }
          return;
        }

        // If creating a new client record (no selectedClientRecord)
        if (!selectedClientRecord && initialStage === 2) {
          // Create new client record for existing tenant
          try {
            const clientData = {
              tenant: client.id, // Use the current tenant ID
              arabic_name: formData.client_arabic_name.trim(),
              english_name: formData.client_english_name.trim(),
              email: formData.client_email.trim(),
              phone: parseInt(formData.client_phone.trim()) || 0,
              schema: client.subdomain,
            };

            await dispatch(createClient(clientData)).unwrap();

            // Show success message
            toast.success(
              t({
                en: "Client created successfully!",
                ar: "تم إنشاء العميل بنجاح!",
              })
            );

            // Close the form after successful creation
            if (onUpdate) onUpdate();
            onClose();
          } catch (error) {
            // Handle specific client creation errors
            let errorMessage = error.message;
            if (error.data?.email) {
              const emailError = error.data.email[0];
              if (emailError.includes("already exists")) {
                errorMessage = t({
                  en: "This email is already registered. Please use a different email.",
                  ar: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
                });
              }
            } else if (error.data?.phone) {
              const phoneError = error.data.phone[0];
              if (phoneError.includes("already exists")) {
                errorMessage = t({
                  en: "This phone number is already registered. Please use a different phone number.",
                  ar: "رقم الهاتف هذا مسجل بالفعل. يرجى استخدام رقم آخر.",
                });
              }
            }

            // Show user-friendly error message
            toast.error(
              errorMessage ||
                t({
                  en: "Failed to create client. Please check your data and try again.",
                  ar: "فشل في إنشاء العميل. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
                })
            );
          }
          return;
        }

        // In edit mode for tenant, just move to next stage without API call
        if (isEditMode) {
          setCurrentStage(3);
          return;
        }

        // Submit client data to /ten/addclients/ using new schema (full tenant creation flow)
        // Only create client if at least one field is filled
        const hasClientData =
          formData.client_arabic_name.trim() ||
          formData.client_english_name.trim() ||
          formData.client_email.trim() ||
          formData.client_phone.trim();

        if (hasClientData) {
          try {
            const clientData = {
              tenant: submittedData.tenant.id, // Include tenant ID in the data object
              arabic_name: formData.client_arabic_name.trim(),
              english_name: formData.client_english_name.trim(),
              email: formData.client_email.trim(),
              phone: parseInt(formData.client_phone.trim()) || 0, // Convert to number as per schema
              schema:
                submittedData.tenant.subdomain || formData.subdomain.trim(),
            };

            const result = await dispatch(createClient(clientData)).unwrap();

            // Show success message
            toast.success(
              t({
                en: "Client created successfully!",
                ar: "تم إنشاء العميل بنجاح!",
              })
            );

            setSubmittedData((prev) => ({ ...prev, client: result }));
          } catch (error) {
            // Handle specific client creation errors
            let errorMessage = error.message;
            if (error.data?.email) {
              const emailError = error.data.email[0];
              if (emailError.includes("already exists")) {
                errorMessage = t({
                  en: "This email is already registered. Please use a different email.",
                  ar: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
                });
              }
            } else if (error.data?.phone) {
              const phoneError = error.data.phone[0];
              if (phoneError.includes("already exists")) {
                errorMessage = t({
                  en: "This phone number is already registered. Please use a different phone number.",
                  ar: "رقم الهاتف هذا مسجل بالفعل. يرجى استخدام رقم آخر.",
                });
              }
            }

            // Show user-friendly error message
            toast.error(
              errorMessage ||
                t({
                  en: "Failed to create client. Please check your data and try again.",
                  ar: "فشل في إنشاء العميل. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
                })
            );
          }
        } else {
          // No client data provided, show info message and proceed to next stage
          toast.info(
            t({
              en: "Skipping client creation. You can add client information later.",
              ar: "تخطي إنشاء العميل. يمكنك إضافة معلومات العميل لاحقاً.",
            })
          );
        }

        // Always move to Stage 3 regardless of whether client was created
        setCurrentStage(3);
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
        const imageValue = resolveImageValue(true);
        const currencyCode = normalizeCurrency(
          formData.Currency || client.Currency
        );
        const currencyId = getCurrencyId(currencyCode, currencies);

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
          ...(currencyId ? { currency_id: currencyId } : {}),
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
          Start_Date:
            formData.Start_Date || client.Start_Date || getDefaultStartDate(),
          End_Date: formData.End_Date || client.End_Date || getDefaultEndDate(),
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
          ...(imageValue !== undefined ? { image: imageValue } : {}),
        };

        const tenantPayload = prepareTenantPayload(tenantData);

        await dispatch(
          updateTenant({ id: client.id, tenantData: tenantPayload })
        ).unwrap();

        // Handle manager creation/update if there's manager data
        if (
          formData.manager_username &&
          formData.manager_email &&
          formData.manager_password
        ) {
          const managerData = {
            username: formData.manager_username.trim(),
            email: formData.manager_email.trim(),
            password: formData.manager_password,
            role:
              formData.manager_role.charAt(0).toUpperCase() +
              formData.manager_role.slice(1), // Capitalize first letter
            schema: client.subdomain || "",
          };

          // Check if manager exists (has manager_id or manager_username/email)
          const managerExists =
            (client.manager_id && client.manager_id > 0) ||
            (client.manager_username && client.manager_email);

          try {
            if (managerExists) {
              // Update existing manager
              await dispatch(
                updateManagerSlice({
                  subdomain: client.subdomain,
                  id: client.manager_id,
                  managerData: {
                    username: managerData.username,
                    email: managerData.email,
                    password: managerData.password,
                    role: managerData.role,
                  },
                })
              ).unwrap();
            } else {
              // Create new manager
              await dispatch(createManager({ managerData })).unwrap();
            }
          } catch (managerError) {
            // Handle specific manager errors
            let errorMessage = managerError.message;
            if (managerError.data?.username) {
              const usernameError = managerError.data.username[0];
              if (usernameError.includes("already exists")) {
                errorMessage = t({
                  en: "This username is already taken. Please choose a different one.",
                  ar: "اسم المستخدم هذا مستخدم بالفعل. يرجى اختيار اسم آخر.",
                });
              }
            } else if (managerError.data?.email) {
              const emailError = managerError.data.email[0];
              if (emailError.includes("already exists")) {
                errorMessage = t({
                  en: "This email is already registered. Please use a different email.",
                  ar: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
                });
              }
            }

            const actionText = managerExists ? "update" : "create";
            toast.error(
              errorMessage ||
                t({
                  en: `Failed to ${actionText} manager. Please check your data and try again.`,
                  ar: `فشل في ${
                    managerExists ? "تحديث" : "إنشاء"
                  } المدير. يرجى التحقق من البيانات والمحاولة مرة أخرى.`,
                })
            );
            return; // Stop execution if manager operation fails
          }
        }

        toast.success(
          t({ en: "Client updated successfully", ar: "تم تحديث العميل بنجاح" })
        );
        if (onUpdate) onUpdate();
        onClose();
      } else {
        // Ensure tenant exists before creating manager
        if (!submittedData.tenant || !submittedData.tenant.subdomain) {
          toast.error(
            t({
              en: "Tenant must be created first before adding a manager.",
              ar: "يجب إنشاء المستأجر أولاً قبل إضافة مدير.",
            })
          );
          return;
        }

        // Create new manager using managersSlice
        const managerData = {
          username: formData.manager_username.trim(),
          email: formData.manager_email.trim(),
          password: formData.manager_password,
          role:
            formData.manager_role.charAt(0).toUpperCase() +
            formData.manager_role.slice(1), // Capitalize first letter
          schema: submittedData.tenant.subdomain,
        };

        try {
          await dispatch(createManager({ managerData })).unwrap();

          // Show success message
          toast.success(
            t({
              en: "Manager created successfully!",
              ar: "تم إنشاء المدير بنجاح!",
            })
          );

          // Close the form after successful manager creation
          setTimeout(() => {
            onClose();
          }, 1000);
        } catch (managerError) {
          // Handle specific manager creation errors
          let errorMessage = managerError.message;
          if (managerError.data?.username) {
            const usernameError = managerError.data.username[0];
            if (usernameError.includes("already exists")) {
              errorMessage = t({
                en: "This username is already taken. Please choose a different one.",
                ar: "اسم المستخدم هذا مستخدم بالفعل. يرجى اختيار اسم آخر.",
              });
            }
          } else if (managerError.data?.email) {
            const emailError = managerError.data.email[0];
            if (emailError.includes("already exists")) {
              errorMessage = t({
                en: "This email is already registered. Please use a different email.",
                ar: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
              });
            }
          }

          toast.error(
            errorMessage ||
              t({
                en: "Failed to create manager. Please check your data and try again.",
                ar: "فشل في إنشاء المدير. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
              })
          );
          return; // Stop execution if manager creation fails
        }

        // Form is complete, success message will be shown and form will close
      }
    } catch (error) {
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

    // Auto-format subdomain input
    let processedValue = value;
    if (name === "subdomain") {
      // Convert to lowercase and remove invalid characters
      processedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
        .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
        .substring(0, 50); // Limit length
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

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

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        t({
          en: "File is too large. Maximum size is 5MB.",
          ar: "الملف كبير جداً. الحد الأقصى 5 ميجابايت.",
        })
      );
      event.target.value = "";
      return;
    }

    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: file }));
    setLogoPreview(previewUrl);
    setLogoStatus("updated");
    event.target.value = "";
  };

  const handleLogoRemove = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    setLogoStatus("removed");
  };

  const resolveImageValue = (isEditing) => {
    if (logoStatus === "updated") {
      return formData.image;
    }
    if (logoStatus === "removed") {
      return null;
    }
    return isEditing ? undefined : null;
  };

  const prepareTenantPayload = (data) => {
    const payload = { ...data };
    const hasFile = payload.image instanceof File;

    if (hasFile) {
      const formPayload = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined) {
          return;
        }
        if (value instanceof File) {
          formPayload.append(key, value);
        } else if (value === null) {
          if (key !== "image") {
            formPayload.append(key, "");
          }
        } else if (typeof value === "object") {
          formPayload.append(key, JSON.stringify(value));
        } else {
          formPayload.append(key, value);
        }
      });
      return formPayload;
    }

    if (payload.image === undefined) {
      delete payload.image;
    }

    return payload;
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
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
              <span className="mx-2 text-sm font-medium">
                {isEditMode
                  ? t({ en: "Update Tenant", ar: "تحديث المستأجر" })
                  : t({ en: "Tenant Setup", ar: "إعداد المستأجر" })}
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
              <span className="mx-2 text-sm font-medium">
                {isEditMode
                  ? t({ en: "Client Info", ar: "معلومات العميل" })
                  : t({ en: "Create Client", ar: "إنشاء العميل" })}
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
              <span className="mx-2 text-sm font-medium">
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
                      en: "Enter subdomain (e.g., mycompany)",
                      ar: "أدخل المجال الفرعي (مثل: mycompany)",
                    })}
                    dir="ltr"
                  />
                  <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {t({
                      en: "Must be lowercase, start with a letter, and contain only letters, numbers, and hyphens. Invalid characters will be automatically removed.",
                      ar: "يجب أن يكون بأحرف صغيرة، يبدأ بحرف، ويحتوي على أحرف وأرقام وشرطات فقط. سيتم إزالة الأحرف غير الصحيحة تلقائياً.",
                    })}
                  </p>
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

                {/* Company Logo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Company Logo", ar: "شعار الشركة" })}
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt={t({ en: "Company logo", ar: "شعار الشركة" })}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center px-2">
                          {t({ en: "No logo", ar: "لا يوجد شعار" })}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          htmlFor="company_logo"
                          className="btn-secondary cursor-pointer"
                        >
                          {logoPreview
                            ? t({ en: "Change Logo", ar: "تغيير الشعار" })
                            : t({ en: "Upload Logo", ar: "رفع الشعار" })}
                        </label>
                        <input
                          id="company_logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        {logoPreview && (
                          <button
                            type="button"
                            onClick={handleLogoRemove}
                            className="btn-secondary"
                          >
                            {t({ en: "Remove", ar: "إزالة" })}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {t({
                          en: "Supported formats: JPG, PNG, SVG. Max 5MB.",
                          ar: "الصيغ المدعومة: JPG و PNG و SVG. الحد الأقصى 5 ميجابايت.",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
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
                    {t(translations.numberOfUsers)}{" "}
                    <span className="text-error-500">*</span>
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
                    min="1"
                    required
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
                    {t(translations.numberOfBranches)}{" "}
                    <span className="text-error-500">*</span>
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
                    min="1"
                    required
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
                    {!formData.on_trial && (
                      <span className="text-error-500">*</span>
                    )}
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
                    min={formData.on_trial ? "0" : "0.01"}
                    step="0.01"
                  />
                  {formData.on_trial && (
                    <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {t({
                        en: "Price is optional during free trial.",
                        ar: "السعر اختياري أثناء الفترة التجريبية.",
                      })}
                    </p>
                  )}
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
                    value={normalizeCurrency(formData.Currency)}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {currencies.length > 0 ? (
                      <>
                        {/* Show current value if it's not in active currencies */}
                        {(() => {
                          const normalizedCurrency = normalizeCurrency(
                            formData.Currency
                          );
                          return (
                            normalizedCurrency &&
                            !currencies.some(
                              (c) =>
                                c.code === normalizedCurrency && c.is_active
                            ) && (
                              <option value={normalizedCurrency}>
                                {normalizedCurrency}
                              </option>
                            )
                          );
                        })()}
                        {/* Show active currencies */}
                        {currencies
                          .filter((currency) => currency.is_active)
                          .map((currency) => (
                            <option key={currency.id} value={currency.code}>
                              {currency.name} ({currency.code})
                            </option>
                          ))}
                      </>
                    ) : (
                      <option value={normalizeCurrency(formData.Currency)}>
                        {normalizeCurrency(formData.Currency)}
                      </option>
                    )}
                  </select>
                </div>

                {/* Free Trial Option */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <input
                    type="checkbox"
                    id="on_trial"
                    checked={formData.on_trial}
                    onChange={() => {
                      setFormData((prev) => {
                        const nextOnTrial = !prev.on_trial;
                        const updatedForm = {
                          ...prev,
                          on_trial: nextOnTrial,
                        };

                        if (nextOnTrial) {
                          updatedForm.Start_Date = getDefaultStartDate();
                          updatedForm.End_Date = getDefaultEndDate();
                          updatedForm.Subscription_Price = "";
                        }

                        return updatedForm;
                      });

                      if (errors.Subscription_Price) {
                        setErrors((prev) => ({
                          ...prev,
                          Subscription_Price: "",
                        }));
                      }
                    }}
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
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border border-border-light dark:border-border-dark rounded-lg">
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
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border border-border-light dark:border-border-dark rounded-lg">
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

                <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border border-border-light dark:border-border-dark rounded-lg">
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
                  {t({
                    en: "Client Information",
                    ar: "معلومات العميل",
                  })}
                </h3>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t({ en: "Optional", ar: "اختياري" })}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Name */}
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t(translations.clientNameAr)}
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
                    {t(translations.clientNameEn)}
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
                    {t(translations.email)}
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
                    {t(translations.phone)}
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
                  {t({ en: "Manager Access", ar: "وصول المدير" })}
                </h3>
                {isEditMode && (
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {(client.manager_id && client.manager_id > 0) ||
                    (client.manager_username && client.manager_email) ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {t({ en: "Update Manager", ar: "تحديث المدير" })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {t({ en: "Create Manager", ar: "إنشاء مدير" })}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Show subdomain info for manager creation */}
              {isEditMode && client.subdomain && (
                <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
                      {t({ en: "Subdomain", ar: "المجال الفرعي" })}:
                    </span>
                    <code className="text-sm font-mono text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-800 px-2 py-1 rounded">
                      {client.subdomain}
                    </code>
                  </div>
                </div>
              )}
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
            {currentStage === 2 && !isEditMode && (
              <button
                type="button"
                onClick={() => {
                  toast.info(
                    t({
                      en: "Skipping client creation. You can add client information later.",
                      ar: "تخطي إنشاء العميل. يمكنك إضافة معلومات العميل لاحقاً.",
                    })
                  );
                  setCurrentStage(3);
                }}
                className="btn-secondary"
                disabled={loading}
              >
                {t({ en: "Skip", ar: "تخطي" })}
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode && currentStage === 1
                    ? t({
                        en: "Updating Tenant...",
                        ar: "جاري تحديث المستأجر...",
                      })
                    : selectedClientRecord && currentStage === 2
                    ? t({
                        en: "Updating Client...",
                        ar: "جاري تحديث العميل...",
                      })
                    : t(translations.loading)}
                </div>
              ) : initialStage === 2 ? (
                selectedClientRecord ? (
                  t({ en: "Update Client", ar: "تحديث العميل" })
                ) : (
                  t({ en: "Create Client", ar: "إنشاء العميل" })
                )
              ) : isEditMode ? (
                currentStage === 1 ? (
                  t({ en: "Update Tenant", ar: "تحديث المستأجر" })
                ) : (
                  t({ en: "Save Changes", ar: "حفظ التغييرات" })
                )
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
