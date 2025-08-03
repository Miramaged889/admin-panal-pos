import { useState } from "react";
import { Inbox, Reply, Trash2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "../components/UI/Toast";

const ContactUs = () => {
  const { t } = useLanguage();

  // Mock received messages - replace with actual data from your backend
  const [receivedMessages] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      subject: "طلب دعم فني",
      message: "أحتاج مساعدة في إعداد النظام الجديد. هل يمكنكم مساعدتي؟",
      date: "2024-01-15T10:30:00",
      status: "unread",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@restaurant.com",
      subject: "Technical Support Request",
      message:
        "I'm having issues with the POS system. The printer is not working properly. Can you help me troubleshoot this issue?",
      date: "2024-01-14T14:20:00",
      status: "read",
    },
    {
      id: 3,
      name: "محمد علي",
      email: "mohammed@cafe.com",
      subject: "استفسار عن الأسعار",
      message:
        "أريد معرفة الأسعار الجديدة للاشتراكات. هل يمكنكم إرسال الكتالوج الجديد؟",
      date: "2024-01-13T09:15:00",
      status: "read",
    },
    {
      id: 4,
      name: "Fatima Al-Zahra",
      email: "fatima@catering.com",
      subject: "Feature Request",
      message:
        "We would like to request a new feature for inventory management. Is this possible to implement?",
      date: "2024-01-12T16:45:00",
      status: "unread",
    },
  ]);

  const handleReply = () => {
    // Mock reply functionality
    toast.success(
      t({ en: "Reply sent successfully!", ar: "تم إرسال الرد بنجاح!" })
    );
  };

  const handleDelete = () => {
    // Mock delete functionality
    toast.success(
      t({ en: "Message deleted successfully!", ar: "تم حذف الرسالة بنجاح!" })
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = receivedMessages.filter(
    (msg) => msg.status === "unread"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t({ en: "Received Messages", ar: "الرسائل المستلمة" })}
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
          {t({
            en: "View and manage messages from users",
            ar: "عرض وإدارة الرسائل من المستخدمين",
          })}
        </p>
      </div>

      {/* Received Messages */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Inbox className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            {t({ en: "Received Messages", ar: "الرسائل المستلمة" })}
          </h2>
          {unreadCount > 0 && (
            <span className="bg-error-600 text-white text-xs rounded-full px-2 py-1">
              {unreadCount} {t({ en: "unread", ar: "غير مقروء" })}
            </span>
          )}
        </div>

        <div className="space-y-4">
          {receivedMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border rounded-lg ${
                message.status === "unread"
                  ? "border-primary-200 bg-primary-50 dark:bg-primary-900/20"
                  : "border-border-light dark:border-border-dark"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {message.name}
                    </h3>
                    {message.status === "unread" && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                        {t({ en: "New", ar: "جديد" })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {message.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark">
                    {formatDate(message.date)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReply(message.id)}
                      className="p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 transition-colors"
                      title={t({ en: "Reply", ar: "رد" })}
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-error-600 transition-colors"
                      title={t({ en: "Delete", ar: "حذف" })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {message.subject}
                </h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
