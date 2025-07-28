import { useLanguage } from "../../contexts/LanguageContext";

const DatePicker = ({
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  error,
  className = "",
  ...props
}) => {
  const { t } = useLanguage();

  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <input
        type="date"
        value={value || ""}
        onChange={handleChange}
        min={min}
        max={max}
        required={required}
        className={`
          input-field
          ${error ? "border-error-500 focus:ring-error-500" : ""}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;
