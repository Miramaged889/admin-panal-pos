import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import { useAppDispatch } from "../../store/hooks";
import { logoutSaaSAdmin } from "../../store/actions";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, isRTL, t } = useLanguage();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t(translations.dashboard),
      path: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      icon: Users,
      label: t(translations.clients),
      path: "/clients",
      active:
        location.pathname === "/clients" ||
        location.pathname.startsWith("/clients/"),
    },
    {
      icon: MessageSquare,
      label: t({ en: "Contact Us", ar: "اتصل بنا" }),
      path: "/contact",
      active: location.pathname === "/contact",
    },
    {
      icon: Settings,
      label: t(translations.settings),
      path: "/settings",
      active: location.pathname === "/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutSaaSAdmin()).unwrap();
      navigate("/login");
    } catch (error) {
      // If logout fails, still redirect to login
      navigate("/login");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full dark:bg-background-dark border-l border-border-light dark:border-border-dark">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
          {!isCollapsed && (
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                {t({
                  en: "Admin Panel",
                  ar: "\u0644\u0648\u062d\u0629 \u0627\u0644\u0625\u062f\u0627\u0631\u0629",
                })}
              </h1>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t({
                  en: "SaaS Management",
                  ar: "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0646\u0638\u0627\u0645",
                })}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex  rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
        >
          {isCollapsed ? (
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`sidebar-item ${
                item.active
                  ? `sidebar-item-active ${
                      isRTL
                        ? "border-l-4 border-l-primary-600"
                        : "border-r-4 border-r-primary-600"
                    }`
                  : ""
              } ${isRTL ? "flex-row" : ""}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Controls */}
      <div className="p-4 border-t border-border-light dark:border-border-dark space-y-2">
        <button
          onClick={toggleTheme}
          className={`w-full sidebar-item ${isRTL ? "flex-row" : ""}`}
          title={t(isDark ? translations.lightMode : translations.darkMode)}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && (
            <span className="font-medium">
              {t(isDark ? translations.lightMode : translations.darkMode)}
            </span>
          )}
        </button>

        <button
          onClick={toggleLanguage}
          className={`w-full sidebar-item ${isRTL ? "flex-row" : ""}`}
          title={t(translations.language)}
        >
          <Globe className="w-5 h-5" />
          {!isCollapsed && (
            <span className="font-medium">
              {language === "en"
                ? t(translations.arabic)
                : t(translations.english)}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full sidebar-item text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && (
            <span className="font-medium">{t(translations.logout)}</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`relative w-80 max-w-[80vw] bg-card-light dark:bg-card-dark ${
              isRTL ? "mr-0" : "ml-0"
            }`}
          >
            <div className="h-full">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
