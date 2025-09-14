import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { translations } from "../constants/translations";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../store/selectors";
import { loginSaaSAdmin, clearAuthError } from "../store/actions";
import { toast } from "../components/UI/Toast";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, toggleLanguage, isRTL } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || error;
      toast.error(t({ en: errorMessage, ar: errorMessage }));
      dispatch(clearAuthError());
    }
  }, [error, dispatch, t]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t(translations.required);
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t(translations.invalidEmail);
    }

    if (!formData.password) {
      newErrors.password = t(translations.required);
    } else if (formData.password.length < 6) {
      newErrors.password = t(translations.passwordTooShort);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(loginSaaSAdmin(formData)).unwrap();
      toast.success(
        t({ en: "Login successful!", ar: "تم تسجيل الدخول بنجاح!" })
      );
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Controls */}
      <div className={`fixed top-4 ${isRTL ? "left-4" : "right-4"} flex gap-2`}>
        <button
          onClick={toggleTheme}
          className="p-3 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm hover:shadow-md transition-all"
          title={t(isDark ? translations.lightMode : translations.darkMode)}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={toggleLanguage}
          className="p-3 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm hover:shadow-md transition-all"
          title={t(translations.language)}
        >
          <Globe className="w-5 h-5" />
        </button>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t(translations.welcomeBack)}
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              {t(translations.enterCredentials)}
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                {t(translations.email)}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    isRTL ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <Mail className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${isRTL ? "pr-10" : "pl-10"} ${
                    errors.email ? "border-error-500 focus:ring-error-500" : ""
                  }`}
                  placeholder={t(translations.email)}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                {t(translations.password)}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    isRTL ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <Lock className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${
                    isRTL ? "pr-10 pl-10" : "pl-10 pr-10"
                  } ${
                    errors.password
                      ? "border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  placeholder={t(translations.password)}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${
                    isRTL ? "left-0 pl-3" : "right-0 pr-3"
                  } flex items-center`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t(translations.loading)}
                </div>
              ) : (
                t(translations.signIn)
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
