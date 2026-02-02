import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectCurrenciesLoading,
  selectCurrenciesError,
  selectCurrenciesSuccess,
} from "../../store/selectors";
import {
  createCurrency,
  updateCurrency,
  clearCurrenciesError,
  clearCurrenciesSuccess,
} from "../../store/actions";
import { toast } from "../UI/Toast";

const CurrencyForm = ({ currency, onClose }) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectCurrenciesLoading);
  const error = useAppSelector(selectCurrenciesError);
  const success = useAppSelector(selectCurrenciesSuccess);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currency) {
      setFormData({
        code: currency.code || "",
        name: currency.name || "",
        symbol: currency.symbol || "",
        is_active: currency.is_active !== undefined ? currency.is_active : true,
      });
    }
  }, [currency]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(t({ en: success, ar: success }));
      dispatch(clearCurrenciesSuccess());
      onClose();
    }
  }, [success, dispatch, t, onClose]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || error;
      toast.error(t({ en: errorMessage, ar: errorMessage }));
      dispatch(clearCurrenciesError());
    }
  }, [error, dispatch, t]);

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = t(translations.required);
    }

    if (!formData.name.trim()) {
      newErrors.name = t(translations.required);
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = t(translations.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (currency) {
        // Update existing currency
        const updateData = {
          code: formData.code.trim(),
          name: formData.name.trim(),
          symbol: formData.symbol.trim(),
          is_active: formData.is_active,
        };
        await dispatch(
          updateCurrency({ id: currency.id, currencyData: updateData })
        ).unwrap();
      } else {
        // Create new currency
        const createData = {
          code: formData.code.trim(),
          name: formData.name.trim(),
          symbol: formData.symbol.trim(),
          is_active: formData.is_active,
        };
        await dispatch(createCurrency(createData)).unwrap();
      }
    } catch (error) {
      // Error is handled by useEffect
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Code Field */}
      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
          {t({ en: "Code", ar: "الرمز" })}{" "}
          <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className={`input-field ${
            errors.code ? "border-error-500 focus:ring-error-500" : ""
          }`}
          placeholder={t({ en: "Currency Code (e.g., AED, USD)", ar: "رمز العملة (مثل: AED, USD)" })}
          dir="ltr"
        />
        {errors.code && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.code}
          </p>
        )}
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
          {t(translations.name)} <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input-field ${
            errors.name ? "border-error-500 focus:ring-error-500" : ""
          }`}
          placeholder={t({ en: "Currency Name", ar: "اسم العملة" })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.name}
          </p>
        )}
      </div>

      {/* Symbol Field */}
      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
          {t({ en: "Symbol", ar: "الرمز" })}{" "}
          <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          className={`input-field ${
            errors.symbol ? "border-error-500 focus:ring-error-500" : ""
          }`}
          placeholder={t({ en: "Currency Symbol (e.g., $, €, د.إ)", ar: "رمز العملة (مثل: $، €، د.إ)" })}
        />
        {errors.symbol && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.symbol}
          </p>
        )}
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border border-border-light dark:border-border-dark rounded-lg">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary-500 focus:ring-2"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
        >
          {t(translations.active)}
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={loading}
        >
          {t(translations.cancel)}
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t(translations.loading)}
            </div>
          ) : currency ? (
            t(translations.save)
          ) : (
            t(translations.add)
          )}
        </button>
      </div>
    </form>
  );
};

export default CurrencyForm;

