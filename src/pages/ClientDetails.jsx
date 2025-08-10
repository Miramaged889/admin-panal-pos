import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  Edit,
  AlertTriangle,
  Package,
  Truck,
  Users,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../constants/translations";
import useStore from "../store/useStore";
import SubscriptionStatus from "../components/UI/SubscriptionStatus";
import { toast } from "../components/UI/Toast";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { getClient, isClientExpired } = useStore();

  const [showPassword, setShowPassword] = useState(false);

  const client = getClient(id);

  if (!client) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
          {t({ en: "Client not found", ar: "العميل غير موجود" })}
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
          {t({
            en: "The client you are looking for does not exist.",
            ar: "العميل الذي تبحث عنه غير موجود.",
          })}
        </p>
        <Link to="/clients" className="btn-primary">
          {t({ en: "Back to Clients", ar: "العودة للعملاء" })}
        </Link>
      </div>
    );
  }

  const isExpired = isClientExpired(client);

  const formatCurrency = (amount, currency) => {
    if (!amount) return "0.00";

    const currencyMap = {
      SAR: { locale: "ar-SA", symbol: "ر.س" },
      USD: { locale: "en-US", symbol: "$" },
      EUR: { locale: "de-DE", symbol: "€" },
    };

    const currencyInfo = currencyMap[currency] || currencyMap.SAR;

    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback formatting
      return `${currencyInfo.symbol}${parseFloat(amount).toFixed(2)}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {isRTL ? client.name : client.nameEn || client.name}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t(translations.clientDetails)}
          </p>
        </div>
      </div>

      {/* Company Information Card */}
      {client.companyName && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            {t({ en: "Company Information", ar: "معلومات الشركة" })}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t({ en: "Company Name (Arabic)", ar: "اسم الشركة (عربي)" })}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.companyName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t({
                    en: "Company Name (English)",
                    ar: "اسم الشركة (إنجليزي)",
                  })}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.companyNameEn}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t({ en: "Commercial Record", ar: "السجل التجاري" })}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.commercialRecord}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t({ en: "Activity Type", ar: "نوع النشاط" })}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.companyActivityType === "cafe" &&
                    t({ en: "Cafe", ar: "مقهى" })}
                  {client.companyActivityType === "restaurant" &&
                    t({ en: "Restaurant", ar: "مطعم" })}
                  {client.companyActivityType === "catering" &&
                    t({ en: "Catering", ar: "خدمات الطعام" })}
                  {client.companyActivityType === "other" && (
                    <span>
                      {t({ en: "Other", ar: "أخرى" })}:{" "}
                      {client.otherActivityType}
                    </span>
                  )}
                </p>
              </div>
              {/* Legacy Company License (for backward compatibility) */}
              {client.companyLicense && (
                <div>
                  <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Company License", ar: "ترخيص الشركة" })}
                  </label>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {client.companyLicense}
                  </p>
                </div>
              )}
              {/* Legacy Company Status (for backward compatibility) */}
              {client.companyStatus && (
                <div>
                  <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Company Status", ar: "حالة الشركة" })}
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        client.companyStatus === "active"
                          ? "bg-success-500"
                          : "bg-error-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        client.companyStatus === "active"
                          ? "text-success-600"
                          : "text-error-600"
                      }`}
                    >
                      {client.companyStatus === "active"
                        ? t({ en: "Active", ar: "نشط" })
                        : t({ en: "Inactive", ar: "غير نشط" })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Client Information Card */}
      <div className="card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              {t({
                en: "Main Client Information",
                ar: "معلومات العميل الرئيسي",
              })}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.clientNameAr)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.clientNameEn)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.nameEn}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.email)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.phone)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.phone}
                </p>
              </div>
              {client.numberOfUsers && (
                <div>
                  <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {t(translations.numberOfUsers)}
                  </label>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {client.numberOfUsers} {t(translations.users)}
                  </p>
                </div>
              )}
              {client.numberOfBranches && (
                <div>
                  <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Number of Branches", ar: "عدد الفروع" })}
                  </label>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {client.numberOfBranches}{" "}
                    {t({ en: "branches", ar: "فروع" })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              {t(translations.subscription)}
            </h2>
            <SubscriptionStatus client={client} showDetails />

            {/* Enhanced Subscription Details */}
            <div className="mt-4 space-y-3">
              {/* Free Trial Status */}
              {client.isFreeTrial && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-success-600 font-medium">
                    {t(translations.freeTrial)} (14{" "}
                    {t({ en: "days", ar: "أيام" })})
                  </span>
                </div>
              )}

              {/* Subscription Price */}
              {client.subscriptionPrice && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Price", ar: "السعر" })}:{" "}
                    {formatCurrency(client.subscriptionPrice, client.currency)}
                  </span>
                </div>
              )}

              {/* Legacy Trial Days (for backward compatibility) */}
              {client.trialDays && !client.isFreeTrial && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Trial Period", ar: "فترة التجربة" })}:{" "}
                    {client.trialDays} {t({ en: "days", ar: "أيام" })}
                  </span>
                </div>
              )}

              {/* Subscription Options */}
              <div>
                <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  {t(translations.subscriptionOptions)}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary-600" />
                    <span
                      className={`text-sm ${
                        client.subscriptionOptions?.ketchin
                          ? "text-success-600 font-medium"
                          : "text-text-muted-light dark:text-text-muted-dark"
                      }`}
                    >
                      {t(translations.ketchin)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary-600" />
                    <span
                      className={`text-sm ${
                        client.subscriptionOptions?.delivery
                          ? "text-success-600 font-medium"
                          : "text-text-muted-light dark:text-text-muted-dark"
                      }`}
                    >
                      {t(translations.delivery)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isExpired && (
              <div className="mt-4 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                <div className="flex items-center gap-2 text-error-800 dark:text-error-200">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">
                    {t({ en: "Access Restricted", ar: "الوصول مقيد" })}
                  </span>
                </div>
                <p className="text-sm text-error-700 dark:text-error-300 mt-1">
                  {t({
                    en: "This client's subscription has expired. Contact support to renew.",
                    ar: "انتهت صلاحية اشتراك هذا العميل. تواصل مع الدعم للتجديد.",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manager Access Card */}
      {client.managerEmail && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            {t({ en: "Manager Access", ar: "وصول المدير" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t({ en: "Manager Email", ar: "بريد المدير" })}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.managerEmail}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t({ en: "Manager Password", ar: "كلمة مرور المدير" })}
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {showPassword ? client.managerPassword : "••••••••"}
                  </p>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                    title={
                      showPassword
                        ? t({ en: "Hide", ar: "إخفاء" })
                        : t({ en: "Show", ar: "إظهار" })
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                    ) : (
                      <Eye className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Clients Card */}
      {client.additionalClients && client.additionalClients.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            {t({ en: "Additional Clients", ar: "عملاء إضافيون" })} (
            {client.additionalClients.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.additionalClients.map((additionalClient) => (
              <div
                key={additionalClient.id}
                className="p-4 border border-border-light dark:border-border-dark rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {isRTL
                        ? additionalClient.name
                        : additionalClient.nameEn || additionalClient.name}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {additionalClient.email}
                    </p>
                  </div>
                </div>
                {additionalClient.phone && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <Phone className="w-4 h-4" />
                    {additionalClient.phone}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy Manager Card (for backward compatibility) */}
      {client.manager?.name && !client.managerEmail && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            {t(translations.clientManager)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.managerNameAr)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.manager.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.managerNameEn)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.manager.nameEn}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.managerEmail)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.manager.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {t(translations.managerPhone)}
                </label>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {client.manager.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
