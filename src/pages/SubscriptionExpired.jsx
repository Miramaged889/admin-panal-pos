import { Link } from "react-router-dom";
import { AlertTriangle, Home, Mail, Phone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../constants/translations";

const SubscriptionExpired = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-error-50 to-warning-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-12 h-12 text-error-600 dark:text-error-400" />
        </div>

        {/* Content */}
        <div className="card p-8 mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            {t(translations.subscriptionExpired)}
          </h1>

          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-6">
            {t(translations.subscriptionExpiredMessage)}
          </p>

          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-error-800 dark:text-error-200 mb-3">
              {t({ en: "What you can do:", ar: "ما يمكنك فعله:" })}
            </h2>
            <ul
              className={`space-y-2 text-error-700 dark:text-error-300 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error-500 rounded-full flex-shrink-0" />
                {t({
                  en: "Contact our support team to renew your subscription",
                  ar: "تواصل مع فريق الدعم لتجديد اشتراكك",
                })}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error-500 rounded-full flex-shrink-0" />
                {t({
                  en: "Check your email for renewal instructions",
                  ar: "تحقق من بريدك الإلكتروني لتعليمات التجديد",
                })}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error-500 rounded-full flex-shrink-0" />
                {t({
                  en: "Backup your data before it expires completely",
                  ar: "احفظ نسخة احتياطية من بياناتك قبل انتهاء صلاحيتها تماماً",
                })}
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-4">
              {t({ en: "Contact Support", ar: "تواصل مع الدعم" })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="font-medium">
                    {t({ en: "Email Support", ar: "الدعم عبر البريد" })}
                  </p>
                  <p className="text-sm">support@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="font-medium">
                    {t({ en: "Phone Support", ar: "الدعم الهاتفي" })}
                  </p>
                  <p className="text-sm">+966 11 123 4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@example.com?subject=Subscription Renewal Request"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {t({ en: "Contact Support", ar: "تواصل مع الدعم" })}
            </a>

            <Link
              to="/dashboard"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {t({ en: "Back to Dashboard", ar: "العودة للوحة التحكم" })}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          {t({
            en: "This page is shown when your subscription has expired. Please contact support to restore access.",
            ar: "تظهر هذه الصفحة عند انتهاء صلاحية اشتراكك. يرجى التواصل مع الدعم لاستعادة الوصول.",
          })}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionExpired;
