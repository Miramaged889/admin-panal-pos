import { format } from "date-fns";
import { Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";

const SubscriptionStatus = ({ client, showDetails = false }) => {
  const { t } = useLanguage();

  const isExpired = new Date() > new Date(client.subscriptionEnd);
  const daysUntilExpiry = Math.ceil(
    (new Date(client.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  const getStatusConfig = () => {
    if (isExpired) {
      return {
        status: "expired",
        label: t(translations.subscriptionExpired),
        icon: XCircle,
        className:
          "bg-error-100 text-error-800 border-error-200 dark:bg-error-900/20 dark:text-error-200 dark:border-error-800",
      };
    }

    if (isExpiringSoon) {
      return {
        status: "expiring",
        label: t(translations.subscriptionExpiring),
        icon: AlertTriangle,
        className:
          "bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900/20 dark:text-warning-200 dark:border-warning-800",
      };
    }

    return {
      status: "active",
      label: t(translations.subscriptionActive),
      icon: CheckCircle,
      className:
        "bg-success-100 text-success-800 border-success-200 dark:bg-success-900/20 dark:text-success-200 dark:border-success-800",
    };
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  const formatDate = (date) => {
    try {
      return format(new Date(date), "dd/MM/yyyy");
    } catch {
      return date;
    }
  };

  const getDaysText = () => {
    if (isExpired) {
      const daysSinceExpiry = Math.abs(daysUntilExpiry);
      return t({
        en: `Expired ${daysSinceExpiry} ${
          daysSinceExpiry === 1 ? "day" : "days"
        } ago`,
        ar: `انتهت منذ ${daysSinceExpiry} ${
          daysSinceExpiry === 1 ? "يوم" : "أيام"
        }`,
      });
    }

    if (isExpiringSoon) {
      return t({
        en: `Expires in ${daysUntilExpiry} ${
          daysUntilExpiry === 1 ? "day" : "days"
        }`,
        ar: `ينتهي خلال ${daysUntilExpiry} ${
          daysUntilExpiry === 1 ? "يوم" : "أيام"
        }`,
      });
    }

    return t({
      en: `${daysUntilExpiry} ${
        daysUntilExpiry === 1 ? "day" : "days"
      } remaining`,
      ar: `متبقي ${daysUntilExpiry} ${daysUntilExpiry === 1 ? "يوم" : "أيام"}`,
    });
  };

  return (
    <div className="space-y-2">
      {/* Status Badge */}
      <div
        className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border
        ${statusConfig.className}
      `}
      >
        <Icon className="w-4 h-4" />
        {statusConfig.label}
      </div>

      {/* Details */}
      {showDetails && (
        <div className="space-y-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(client.subscriptionStart)} -{" "}
              {formatDate(client.subscriptionEnd)}
            </span>
          </div>
          <div className="text-xs">{getDaysText()}</div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
