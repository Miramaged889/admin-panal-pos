import { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  Database,
  User,
  Palette,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { translations } from "../constants/translations";
import useStore from "../store/useStore";
import { toast } from "../components/UI/Toast";

const Settings = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useStore();

  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: user?.email || "",
    phone: user?.phone || "",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false,
    },
  });

  const tabs = [
    {
      id: "general",
      label: t({ en: "General", ar: "عام" }),
      icon: SettingsIcon,
    },
    {
      id: "appearance",
      label: t({ en: "Appearance", ar: "المظهر" }),
      icon: Palette,
    },
    {
      id: "notifications",
      label: t({ en: "Notifications", ar: "الإشعارات" }),
      icon: Bell,
    },
    {
      id: "security",
      label: t({ en: "Security", ar: "الأمان" }),
      icon: Shield,
    },
    {
      id: "data",
      label: t({ en: "Data & Backup", ar: "البيانات والنسخ الاحتياطي" }),
      icon: Database,
    },
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handlePrivacyChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type],
      },
    }));
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    toast.success(
      t({ en: "Settings saved successfully!", ar: "تم حفظ الإعدادات بنجاح!" })
    );
  };

  const handleExportData = () => {
    // Mock export functionality
    toast.success(
      t({ en: "Data exported successfully!", ar: "تم تصدير البيانات بنجاح!" })
    );
  };

  const handleImportData = () => {
    // Mock import functionality
    toast.success(
      t({ en: "Data imported successfully!", ar: "تم استيراد البيانات بنجاح!" })
    );
  };

  const handleClearData = () => {
    if (
      confirm(
        t({
          en: "Are you sure you want to clear all data? This action cannot be undone.",
          ar: "هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.",
        })
      )
    ) {
      toast.success(
        t({ en: "Data cleared successfully!", ar: "تم مسح البيانات بنجاح!" })
      );
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Account Information", ar: "معلومات الحساب" })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t(translations.email)}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="input-field"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t(translations.phone)}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="input-field"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Language & Region", ar: "اللغة والمنطقة" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {t(translations.language)}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {language === "en"
                          ? t(translations.english)
                          : t(translations.arabic)}
                      </p>
                    </div>
                  </div>
                  <button onClick={toggleLanguage} className="btn-secondary">
                    {t({ en: "Change", ar: "تغيير" })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Theme Settings", ar: "إعدادات المظهر" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <div className="flex items-center gap-3">
                    {isDark ? (
                      <Moon className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary-600" />
                    )}
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {t({ en: "Dark Mode", ar: "الوضع المظلم" })}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {isDark
                          ? t({ en: "Enabled", ar: "مفعل" })
                          : t({ en: "Disabled", ar: "معطل" })}
                      </p>
                    </div>
                  </div>
                  <button onClick={toggleTheme} className="btn-secondary">
                    {t({ en: "Toggle", ar: "تبديل" })}
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Display Options", ar: "خيارات العرض" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    {t({ en: "Show animations", ar: "إظهار الرسوم المتحركة" })}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    {t({ en: "Compact sidebar", ar: "شريط جانبي مضغوط" })}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Notification Preferences", ar: "تفضيلات الإشعارات" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      {t({
                        en: "Email notifications",
                        ar: "إشعارات البريد الإلكتروني",
                      })}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={() => handleNotificationChange("email")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary-600" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      {t({ en: "Push notifications", ar: "الإشعارات الفورية" })}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.push}
                      onChange={() => handleNotificationChange("push")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      {t({
                        en: "SMS notifications",
                        ar: "إشعارات الرسائل النصية",
                      })}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.sms}
                      onChange={() => handleNotificationChange("sms")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Change Password", ar: "تغيير كلمة المرور" })}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "Current Password", ar: "كلمة المرور الحالية" })}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field pr-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({ en: "New Password", ar: "كلمة المرور الجديدة" })}
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    {t({
                      en: "Confirm New Password",
                      ar: "تأكيد كلمة المرور الجديدة",
                    })}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input-field pr-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <button className="btn-primary">
                  {t({ en: "Update Password", ar: "تحديث كلمة المرور" })}
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Privacy Settings", ar: "إعدادات الخصوصية" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    {t({
                      en: "Allow data sharing",
                      ar: "السماح بمشاركة البيانات",
                    })}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacy.dataSharing}
                      onChange={() => handlePrivacyChange("dataSharing")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    {t({ en: "Analytics tracking", ar: "تتبع التحليلات" })}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacy.analytics}
                      onChange={() => handlePrivacyChange("analytics")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "Data Management", ar: "إدارة البيانات" })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t({ en: "Export Data", ar: "تصدير البيانات" })}
                </button>
                <button
                  onClick={handleImportData}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {t({ en: "Import Data", ar: "استيراد البيانات" })}
                </button>
                <button
                  onClick={handleClearData}
                  className="btn-danger flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t({ en: "Clear All Data", ar: "مسح جميع البيانات" })}
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {t({ en: "Reset Settings", ar: "إعادة تعيين الإعدادات" })}
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                {t({ en: "System Information", ar: "معلومات النظام" })}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Version", ar: "الإصدار" })}
                  </span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    1.0.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Last Updated", ar: "آخر تحديث" })}
                  </span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">
                    {t({ en: "Storage Used", ar: "المساحة المستخدمة" })}
                  </span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">
                    2.4 MB
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t(translations.settings)}
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
          {t({
            en: "Manage your account settings and preferences",
            ar: "إدارة إعدادات حسابك وتفضيلاتك",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <TabContent />

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t(translations.save)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
