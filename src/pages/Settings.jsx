import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { translations } from "../constants/translations";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/selectors";

const Settings = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const user = useAppSelector(selectUser);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
  });

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const settingsSections = [
    {
      title: t({ en: "Profile Settings", ar: "إعدادات الملف الشخصي" }),
      icon: User,
      items: [
        {
          label: t({ en: "Name", ar: "الاسم" }),
          value: user?.name || t({ en: "Not set", ar: "غير محدد" }),
          type: "text",
        },
        {
          label: t({ en: "Email", ar: "البريد الإلكتروني" }),
          value: user?.email || t({ en: "Not set", ar: "غير محدد" }),
          type: "email",
        },
        {
          label: t({ en: "Role", ar: "الدور" }),
          value: user?.role || t({ en: "Admin", ar: "مدير" }),
          type: "text",
        },
      ],
    },
    {
      title: t({ en: "Notifications", ar: "الإشعارات" }),
      icon: Bell,
      items: [
        {
          label: t({ en: "Email Notifications", ar: "إشعارات البريد" }),
          type: "toggle",
          value: notifications.email,
          onChange: () => handleNotificationChange("email"),
        },
        {
          label: t({ en: "Push Notifications", ar: "الإشعارات الفورية" }),
          type: "toggle",
          value: notifications.push,
          onChange: () => handleNotificationChange("push"),
        },
        {
          label: t({ en: "SMS Notifications", ar: "إشعارات الرسائل" }),
          type: "toggle",
          value: notifications.sms,
          onChange: () => handleNotificationChange("sms"),
        },
      ],
    },
    {
      title: t({ en: "Security", ar: "الأمان" }),
      icon: Shield,
      items: [
        {
          label: t({
            en: "Two-Factor Authentication",
            ar: "المصادقة الثنائية",
          }),
          type: "toggle",
          value: security.twoFactor,
          onChange: () =>
            handleSecurityChange("twoFactor", !security.twoFactor),
        },
        {
          label: t({
            en: "Session Timeout (minutes)",
            ar: "مهلة الجلسة (دقائق)",
          }),
          type: "select",
          value: security.sessionTimeout,
          options: [
            { value: 15, label: "15" },
            { value: 30, label: "30" },
            { value: 60, label: "60" },
            { value: 120, label: "120" },
          ],
          onChange: (value) => handleSecurityChange("sessionTimeout", value),
        },
        {
          label: t({
            en: "Password Expiry (days)",
            ar: "انتهاء كلمة المرور (أيام)",
          }),
          type: "select",
          value: security.passwordExpiry,
          options: [
            { value: 30, label: "30" },
            { value: 60, label: "60" },
            { value: 90, label: "90" },
            { value: 180, label: "180" },
          ],
          onChange: (value) => handleSecurityChange("passwordExpiry", value),
        },
      ],
    },
    {
      title: t({ en: "Appearance", ar: "المظهر" }),
      icon: Palette,
      items: [
        {
          label: t({ en: "Theme", ar: "المظهر" }),
          type: "theme-toggle",
          value: isDark,
          onChange: toggleTheme,
        },
        {
          label: t({ en: "Language", ar: "اللغة" }),
          type: "language-toggle",
          value: language,
          onChange: toggleLanguage,
        },
      ],
    },
  ];

  const SettingItem = ({ item }) => {
    switch (item.type) {
      case "toggle":
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {item.label}
            </span>
            <button
              onClick={item.onChange}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.value ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        );

      case "select":
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {item.label}
            </span>
            <select
              value={item.value}
              onChange={(e) => item.onChange(parseInt(e.target.value))}
              className="input-field w-24 text-sm"
            >
              {item.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "theme-toggle":
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {item.label}
            </span>
            <button
              onClick={item.onChange}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              {item.value ? (
                <Moon className="w-5 h-5 text-purple-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {item.value
                  ? t(translations.darkMode)
                  : t(translations.lightMode)}
              </span>
            </button>
          </div>
        );

      case "language-toggle":
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {item.label}
            </span>
            <button
              onClick={item.onChange}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">
                {item.value === "en" ? "English" : "العربية"}
              </span>
            </button>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {item.label}
            </span>
            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {item.value}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t(translations.settings)}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t({
              en: "Manage your account settings and preferences",
              ar: "إدارة إعدادات حسابك وتفضيلاتك",
            })}
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div key={sectionIndex} className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="py-3 border-b border-border-light dark:border-border-dark last:border-b-0"
                  >
                    <SettingItem item={item} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          {t(translations.save)}
        </button>
      </div>
    </div>
  );
};

export default Settings;
