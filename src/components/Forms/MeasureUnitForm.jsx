import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../constants/translations";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectMeasureUnitsLoading,
  selectMeasureUnitsError,
  selectMeasureUnitsSuccess,
} from "../../store/selectors";
import {
  createMeasureUnit,
  updateMeasureUnit,
  clearMeasureUnitsError,
  clearMeasureUnitsSuccess,
} from "../../store/actions";
import { toast } from "../UI/Toast";

const MeasureUnitForm = ({ measureUnit, onClose }) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectMeasureUnitsLoading);
  const error = useAppSelector(selectMeasureUnitsError);
  const success = useAppSelector(selectMeasureUnitsSuccess);

  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (measureUnit) {
      setFormData({
        name: measureUnit.name || "",
        abbreviation: measureUnit.abbreviation || "",
        is_active: measureUnit.is_active !== undefined ? measureUnit.is_active : true,
      });
    }
  }, [measureUnit]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(t({ en: success, ar: success }));
      dispatch(clearMeasureUnitsSuccess());
      onClose();
    }
  }, [success, dispatch, t, onClose]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || error;
      toast.error(t({ en: errorMessage, ar: errorMessage }));
      dispatch(clearMeasureUnitsError());
    }
  }, [error, dispatch, t]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t(translations.required);
    }

    if (!formData.abbreviation.trim()) {
      newErrors.abbreviation = t(translations.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (measureUnit) {
        // Update existing measure unit
        const updateData = {
          name: formData.name.trim(),
          abbreviation: formData.abbreviation.trim(),
          is_active: formData.is_active ? "true" : "false",
        };
        await dispatch(
          updateMeasureUnit({ id: measureUnit.id, measureUnitData: updateData })
        ).unwrap();
      } else {
        // Create new measure unit
        const createData = {
          name: formData.name.trim(),
          abbreviation: formData.abbreviation.trim(),
        };
        await dispatch(createMeasureUnit(createData)).unwrap();
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
          placeholder={t(translations.name)}
          dir="ltr"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.name}
          </p>
        )}
      </div>

      {/* Abbreviation Field */}
      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
          {t({
            en: "Abbreviation",
            ar: "الاختصار",
          })}{" "}
          <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          name="abbreviation"
          value={formData.abbreviation}
          onChange={handleChange}
          className={`input-field ${
            errors.abbreviation ? "border-error-500 focus:ring-error-500" : ""
          }`}
          placeholder={t({
            en: "Abbreviation",
            ar: "الاختصار",
          })}
          dir="ltr"
        />
        {errors.abbreviation && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.abbreviation}
          </p>
        )}
      </div>

      {/* Active Status (only for edit mode) */}
      {measureUnit && (
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
      )}

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
          ) : measureUnit ? (
            t(translations.save)
          ) : (
            t(translations.add)
          )}
        </button>
      </div>
    </form>
  );
};

export default MeasureUnitForm;

