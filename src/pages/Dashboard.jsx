import {
  Users,
  Building,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../constants/translations";
import useStore from "../store/useStore";
import SubscriptionStatus from "../components/UI/SubscriptionStatus";

const Dashboard = () => {
  const { t } = useLanguage();
  const { clients } = useStore();

  const activeClients = clients.filter((client) => {
    const isExpired = new Date() > new Date(client.subscriptionEnd);
    return !isExpired;
  });

  const expiredClients = clients.filter((client) => {
    const isExpired = new Date() > new Date(client.subscriptionEnd);
    return isExpired;
  });

  const totalBranches = clients.reduce(
    (sum, client) => sum + client.branches.length,
    0
  );

  const expiringSoonClients = clients.filter((client) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(client.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const statsCards = [
    {
      title: t(translations.totalClients),
      value: clients.length,
      icon: Users,
      color: "bg-primary-500",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      textColor: "text-primary-600 dark:text-primary-400",
    },
    {
      title: t(translations.activeClients),
      value: activeClients.length,
      icon: CheckCircle,
      color: "bg-success-500",
      bgColor: "bg-success-50 dark:bg-success-900/20",
      textColor: "text-success-600 dark:text-success-400",
    },
    {
      title: t(translations.expiredClients),
      value: expiredClients.length,
      icon: AlertTriangle,
      color: "bg-error-500",
      bgColor: "bg-error-50 dark:bg-error-900/20",
      textColor: "text-error-600 dark:text-error-400",
    },
    {
      title: t(translations.totalBranches),
      value: totalBranches,
      icon: Building,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t(translations.dashboard)}
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
          {t(translations.systemOverview)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expiring Subscriptions Alert */}
        {expiringSoonClients.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning-600" />
              <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                {t({
                  en: "Expiring Subscriptions",
                  ar: "اشتراكات تنتهي قريباً",
                })}
              </h2>
            </div>
            <div className="space-y-4">
              {expiringSoonClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800"
                >
                  <div>
                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {client.name}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {client.email}
                    </p>
                  </div>
                  <SubscriptionStatus client={client} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Clients */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              {t(translations.recentActivity)}
            </h2>
          </div>
          <div className="space-y-4">
            {clients.slice(0, 5).map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {client.name}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {client.branches.length} {t(translations.branches)}
                    </p>
                  </div>
                </div>
                <SubscriptionStatus client={client} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          {t({ en: "Quick Actions", ar: "إجراءات سريعة" })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary p-4 text-left">
            <Users className="w-6 h-6 mb-2" />
            <div>
              <h3 className="font-medium">{t(translations.addClient)}</h3>
              <p className="text-sm opacity-90">
                {t({
                  en: "Add a new client to the system",
                  ar: "إضافة عميل جديد للنظام",
                })}
              </p>
            </div>
          </button>

          <button className="btn-secondary p-4 text-left">
            <Building className="w-6 h-6 mb-2" />
            <div>
              <h3 className="font-medium">
                {t({ en: "Manage Branches", ar: "إدارة الفروع" })}
              </h3>
              <p className="text-sm opacity-75">
                {t({
                  en: "View and manage all branches",
                  ar: "عرض وإدارة جميع الفروع",
                })}
              </p>
            </div>
          </button>

          <button className="btn-secondary p-4 text-left">
            <Calendar className="w-6 h-6 mb-2" />
            <div>
              <h3 className="font-medium">
                {t({ en: "Subscription Reports", ar: "تقارير الاشتراكات" })}
              </h3>
              <p className="text-sm opacity-75">
                {t({
                  en: "View subscription analytics",
                  ar: "عرض تحليلات الاشتراكات",
                })}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
