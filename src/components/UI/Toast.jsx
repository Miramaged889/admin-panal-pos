import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// Global toast store
let toastStore = {
  toasts: [],
  listeners: [],
  counter: 0,
  addToast: (toast) => {
    // Generate unique ID using timestamp + counter + random number to avoid duplicates
    const id = `${Date.now()}-${++toastStore.counter}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newToast = { id, ...toast };

    // Check if a toast with the same message already exists to prevent duplicates
    const existingToast = toastStore.toasts.find(
      (t) => t.message === toast.message && t.type === toast.type
    );
    if (existingToast) {
      // Remove the existing toast before adding the new one
      toastStore.removeToast(existingToast.id);
    }

    toastStore.toasts.push(newToast);
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts));

    // Auto remove after duration
    setTimeout(() => {
      toastStore.removeToast(id);
    }, toast.duration || 5000);

    return id;
  },
  removeToast: (id) => {
    toastStore.toasts = toastStore.toasts.filter((toast) => toast.id !== id);
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts));
  },
  subscribe: (listener) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  },
};

// Export toast functions
export const toast = {
  success: (message, options = {}) =>
    toastStore.addToast({ type: "success", message, ...options }),
  error: (message, options = {}) =>
    toastStore.addToast({ type: "error", message, ...options }),
  info: (message, options = {}) =>
    toastStore.addToast({ type: "info", message, ...options }),
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-800 dark:text-success-200";
      case "error":
        return "bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-800 dark:text-error-200";
      case "info":
        return "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-200";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-4 ${isRTL ? "left-4" : "right-4"} z-50 space-y-2`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm w-full border rounded-lg p-4 shadow-lg animate-slide-in
            ${getToastStyles(toast.type)}
          `}
        >
          <div
            className={`flex items-start gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => toastStore.removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
