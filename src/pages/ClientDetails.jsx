import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectTenantsList,
  selectTenantsLoading,
  selectManagersList,
  selectManagersLoading,
  selectClientsList,
  selectClientsLoading,
} from "../store/selectors";
import {
  fetchTenants,
  deleteClient,
  fetchManagers,
  fetchClients,
} from "../store/actions";
import SubscriptionStatus from "../components/UI/SubscriptionStatus";
import Modal from "../components/UI/Modal";
import ClientForm from "../components/Forms/ClientForm";
import { toast } from "../components/UI/Toast";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const tenants = useAppSelector(selectTenantsList);
  const loading = useAppSelector(selectTenantsLoading);
  const managers = useAppSelector(selectManagersList);
  const managersLoading = useAppSelector(selectManagersLoading);
  const clients = useAppSelector(selectClientsList);
  const clientsLoading = useAppSelector(selectClientsLoading);
  const client = tenants.find((tenant) => tenant.id === parseInt(id));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editMode, setEditMode] = useState("tenant"); // 'tenant', 'manager', or 'client'
  const [selectedClientRecord, setSelectedClientRecord] = useState(null);

  useEffect(() => {
    if (!tenants.length) {
      dispatch(fetchTenants());
    }
  }, [dispatch, tenants.length]);

  // Fetch managers and clients when client data is available
  useEffect(() => {
    if (client?.subdomain) {
      dispatch(fetchManagers(client.subdomain));
      dispatch(fetchClients({ tenantId: client.id }));
    }
  }, [dispatch, client?.subdomain, client?.id]);

  // Refresh data after updates
  const refreshData = () => {
    if (client?.subdomain) {
      dispatch(fetchManagers(client.subdomain));
      dispatch(fetchClients({ tenantId: client.id }));
    }
    dispatch(fetchTenants());
  };

  // Handle opening edit modal for tenant
  const handleEditTenant = () => {
    setEditMode("tenant");
    setIsEditModalOpen(true);
  };

  // Handle opening edit modal for manager
  const handleEditManager = () => {
    setEditMode("manager");
    setSelectedClientRecord(null);
    setIsEditModalOpen(true);
  };

  // Handle opening edit modal for existing client record
  const handleEditClientRecord = (clientRecord) => {
    setEditMode("client");
    setSelectedClientRecord(clientRecord);
    setIsEditModalOpen(true);
  };

  // Handle opening form to create new client record
  const handleCreateClientRecord = () => {
    setEditMode("client");
    setSelectedClientRecord(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      // Pass tenant context required by the new client API
      await dispatch(
        deleteClient({
          id: client.id,
          tenantId: client.id,
        })
      ).unwrap();
      toast.success(
        t({ en: "Client deleted successfully", ar: "تم حذف العميل بنجاح" })
      );
      navigate("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error(
        t({
          en: "Failed to delete client",
          ar: "فشل في حذف العميل",
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

  const isExpired = new Date() > new Date(client.End_Date);

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
            {isRTL
              ? client.arabic_name
              : client.english_name || client.arabic_name}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t(translations.clientDetails)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleEditTenant}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t(translations.editClient)}
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn-danger flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            {t(translations.deleteClient)}
          </button>
        </div>
      </div>

      {/* Company Information Card */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          {t({ en: "Company Information", ar: "معلومات الشركة" })}
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden">
            {client.image ? (
              <img
                src={client.image}
                alt={t({ en: "Company logo", ar: "شعار الشركة" })}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building className="w-10 h-10 text-text-muted-light dark:text-text-muted-dark" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {t({ en: "Company Logo", ar: "شعار الشركة" })}
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {client.image
                ? t({
                    en: "Brand assets are up to date",
                    ar: "مواد العلامة التجارية محدثة",
                  })
                : t({
                    en: "No logo uploaded yet",
                    ar: "لم يتم رفع شعار بعد",
                  })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t({ en: "Company Name (Arabic)", ar: "اسم الشركة (عربي)" })}
              </label>
              <p className="text-text-primary-light dark:text-text-primary-dark">
                {client.arabic_name}
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
                {client.english_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t({ en: "Commercial Record", ar: "السجل التجاري" })}
              </label>
              <p className="text-text-primary-light dark:text-text-primary-dark">
                {client.Commercial_Record}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t({ en: "Activity Type", ar: "نوع النشاط" })}
              </label>
              <p className="text-text-primary-light dark:text-text-primary-dark">
                {client.Activity_Type}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t({ en: "Subdomain", ar: "المجال الفرعي" })}
              </label>
              <p className="text-text-primary-light dark:text-text-primary-dark">
                {client.subdomain}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t({ en: "Status", ar: "الحالة" })}
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    client.is_active ? "bg-success-500" : "bg-error-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    client.is_active ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {client.is_active
                    ? t({ en: "Active", ar: "نشط" })
                    : t({ en: "Inactive", ar: "غير نشط" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Records Card */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          {t({ en: "Client Records", ar: "سجلات العملاء" })}
        </h2>

        {clientsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length > 0 ? (
          <div className="space-y-6">
            {clients.map((clientRecord, index) => (
              <div
                key={clientRecord.id}
                className="border border-border-light dark:border-border-dark rounded-lg p-4"
              >
                {clients.length > 1 && (
                  <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">
                    {t({ en: `Client ${index + 1}`, ar: `عميل ${index + 1}` })}
                  </h3>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Arabic Name", ar: "الاسم العربي" })}
                      </label>
                      <p className="text-text-primary-light dark:text-text-primary-dark">
                        {clientRecord.arabic_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "English Name", ar: "الاسم الإنجليزي" })}
                      </label>
                      <p className="text-text-primary-light dark:text-text-primary-dark">
                        {clientRecord.english_name}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Email", ar: "البريد الإلكتروني" })}
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary-600" />
                        <p className="text-text-primary-light dark:text-text-primary-dark">
                          {clientRecord.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Phone", ar: "الهاتف" })}
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary-600" />
                        <p className="text-text-primary-light dark:text-text-primary-dark">
                          {clientRecord.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Actions */}
                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Client Actions", ar: "إجراءات العميل" })}
                      </h3>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {t({
                          en: "Manage client information and access",
                          ar: "إدارة معلومات العميل والوصول",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClientRecord(clientRecord)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        {t({ en: "Edit Client", ar: "تعديل العميل" })}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t({ en: "No Clients Found", ar: "لم يتم العثور على عملاء" })}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              {t({
                en: "This tenant doesn't have any clients registered yet.",
                ar: "هذا المستأجر ليس لديه عملاء مسجلين بعد.",
              })}
            </p>
            <button
              onClick={handleCreateClientRecord}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <User className="w-4 h-4" />
              {t({ en: "Add Client", ar: "إضافة عميل" })}
            </button>
          </div>
        )}
      </div>

      {/* Subscription Information Card */}
      <div className="card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              {t({
                en: "Business Configuration",
                ar: "إعدادات الأعمال",
              })}
            </h2>
            <div className="space-y-3">
              {client.no_users && (
                <div>
                  <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {t(translations.numberOfUsers)}
                  </label>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {client.no_users} {t(translations.users)}
                  </p>
                </div>
              )}
              {client.no_branches && (
                <div>
                  <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Number of Branches", ar: "عدد الفروع" })}
                  </label>
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {client.no_branches} {t({ en: "branches", ar: "فروع" })}
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
              {client.on_trial && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-success-600 font-medium">
                    {t(translations.freeTrial)} (14{" "}
                    {t({ en: "days", ar: "أيام" })})
                  </span>
                </div>
              )}

              {/* Subscription Price */}
              {client.Subscription_Price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Price", ar: "السعر" })}:{" "}
                    {formatCurrency(client.Subscription_Price, client.Currency)}
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
                        client.modules_enabled?.kitchen
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
                        client.modules_enabled?.Delivery
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

      {/* Manager Information Card */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          {t({ en: "Manager Information", ar: "معلومات المدير" })}
        </h2>

        {managersLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : managers.length > 0 ? (
          <div className="space-y-6">
            {managers.map((manager, index) => (
              <div
                key={manager.id}
                className="border border-border-light dark:border-border-dark rounded-lg p-4"
              >
                {managers.length > 1 && (
                  <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">
                    {t({ en: `Manager ${index + 1}`, ar: `مدير ${index + 1}` })}
                  </h3>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Username", ar: "اسم المستخدم" })}
                      </label>
                      <p className="text-text-primary-light dark:text-text-primary-dark">
                        {manager.username}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Email", ar: "البريد الإلكتروني" })}
                      </label>
                      <p className="text-text-primary-light dark:text-text-primary-dark">
                        {manager.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Password", ar: "كلمة المرور" })}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Role", ar: "الدور" })}
                      </label>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-600" />
                        <span className="text-text-primary-light dark:text-text-primary-dark">
                          {manager.role}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Status", ar: "الحالة" })}
                      </label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            manager.is_active
                              ? "bg-success-500"
                              : "bg-error-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            manager.is_active
                              ? "text-success-600"
                              : "text-error-600"
                          }`}
                        >
                          {manager.is_active
                            ? t({ en: "Active", ar: "نشط" })
                            : t({ en: "Inactive", ar: "غير نشط" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manager Actions */}
                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {t({ en: "Manager Actions", ar: "إجراءات المدير" })}
                      </h3>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {t({
                          en: "Manage manager access and permissions",
                          ar: "إدارة وصول المدير والأذونات",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditManager}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        {t({ en: "Edit Manager", ar: "تعديل المدير" })}
                      </button>
                      <button className="btn-outline flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {t({ en: "View Details", ar: "عرض التفاصيل" })}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t({ en: "No Managers Found", ar: "لم يتم العثور على مديرين" })}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              {t({
                en: "This client doesn't have any managers assigned yet.",
                ar: "هذا العميل لا يحتوي على مديرين بعد.",
              })}
            </p>
            <button
              onClick={handleEditManager}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <User className="w-4 h-4" />
              {t({ en: "Add Manager", ar: "إضافة مدير" })}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClientRecord(null);
        }}
        title={
          editMode === "manager"
            ? t({ en: "Edit Manager", ar: "تعديل المدير" })
            : editMode === "client"
            ? selectedClientRecord
              ? t({ en: "Edit Client", ar: "تعديل العميل" })
              : t({ en: "Add Client", ar: "إضافة عميل" })
            : t(translations.editClient)
        }
        size="lg"
      >
        <ClientForm
          client={{
            ...client,
            // Add manager data to client object for editing
            manager_username:
              managers[0]?.username || client.manager_username || "",
            manager_email: managers[0]?.email || client.manager_email || "",
            manager_password:
              managers[0]?.password || client.manager_password || "",
            manager_role: managers[0]?.role || client.manager_role || "manager",
            manager_id: managers[0]?.id || null,
            // Ensure subdomain is always available
            subdomain: client.subdomain,
            // Add selected client record data for editing
            ...(selectedClientRecord && {
              client_arabic_name: selectedClientRecord.arabic_name || "",
              client_english_name: selectedClientRecord.english_name || "",
              client_email: selectedClientRecord.email || "",
              client_phone: selectedClientRecord.phone?.toString() || "",
              client_id: selectedClientRecord.id,
            }),
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClientRecord(null);
          }}
          isEditMode={editMode !== "client" || !!selectedClientRecord}
          onUpdate={refreshData}
          initialStage={
            editMode === "manager" ? 3 : editMode === "client" ? 2 : 1
          }
          selectedClientRecord={selectedClientRecord}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t(translations.deleteClient)}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t(translations.deleteClientConfirm)}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary"
            >
              {t(translations.cancel)}
            </button>
            <button onClick={handleDelete} className="btn-danger">
              {t(translations.delete)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientDetails;
