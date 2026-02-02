import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Ruler,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../constants/translations";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectMeasureUnitsList,
  selectMeasureUnitsLoading,
  selectMeasureUnitsError,
  selectMeasureUnitsSuccess,
} from "../store/selectors";
import {
  fetchMeasureUnits,
  deleteMeasureUnit,
  clearMeasureUnitsError,
  clearMeasureUnitsSuccess,
} from "../store/actions";
import Modal from "../components/UI/Modal";
import MeasureUnitForm from "../components/Forms/MeasureUnitForm";
import { toast } from "../components/UI/Toast";

const MeasureUnits = () => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const measureUnits = useAppSelector(selectMeasureUnitsList);
  const loading = useAppSelector(selectMeasureUnitsLoading);
  const error = useAppSelector(selectMeasureUnitsError);
  const success = useAppSelector(selectMeasureUnitsSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMeasureUnit, setEditingMeasureUnit] = useState(null);
  const [deletingMeasureUnit, setDeletingMeasureUnit] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch measure units on component mount
  useEffect(() => {
    dispatch(fetchMeasureUnits());
  }, [dispatch]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(t({ en: success, ar: success }));
      dispatch(clearMeasureUnitsSuccess());
    }
  }, [success, dispatch, t]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(t({ en: error, ar: error }));
      dispatch(clearMeasureUnitsError());
    }
  }, [error, dispatch, t]);

  // Filter measure units based on search and status
  const filteredMeasureUnits = measureUnits.filter((unit) => {
    const matchesSearch =
      unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && unit.is_active) ||
      (statusFilter === "inactive" && !unit.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleDeleteMeasureUnit = async () => {
    if (deletingMeasureUnit) {
      try {
        await dispatch(deleteMeasureUnit(deletingMeasureUnit.id)).unwrap();
        setDeletingMeasureUnit(null);
        setActiveDropdown(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const MeasureUnitCard = ({ unit }) => {
    return (
      <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                {unit.name}
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {unit.abbreviation}
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(
                  activeDropdown === unit.id ? null : unit.id
                );
              }}
              className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {activeDropdown === unit.id && (
              <div
                className={`absolute top-10 ${
                  isRTL ? "left-0" : "right-0"
                } w-48 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10`}
              >
                <button
                  onClick={() => {
                    setEditingMeasureUnit(unit);
                    setActiveDropdown(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left"
                >
                  <Edit className="w-4 h-4" />
                  {t(translations.edit)}
                </button>
                <button
                  onClick={() => {
                    setDeletingMeasureUnit(unit);
                    setActiveDropdown(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  {t(translations.delete)}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unit.is_active ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span className="text-sm text-success-600">
                {t(translations.active)}
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-error-600" />
              <span className="text-sm text-error-600">
                {t(translations.inactive)}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t({
              en: "Measure Units",
              ar: "وحدات القياس",
            })}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {t({
              en: "Manage measure units and their abbreviations",
              ar: "إدارة وحدات القياس واختصاراتها",
            })}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t({
            en: "Add Measure Unit",
            ar: "إضافة وحدة قياس",
          })}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              isRTL ? "right-3" : "left-3"
            } w-5 h-5 text-text-muted-light dark:text-text-muted-dark`}
          />
          <input
            type="text"
            placeholder={t(translations.search)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`input-field ${isRTL ? "pr-10" : "pl-10"}`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">
            {t({ en: "All Status", ar: "جميع الحالات" })}
          </option>
          <option value="active">{t(translations.active)}</option>
          <option value="inactive">{t(translations.inactive)}</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t({
              en: "Loading measure units...",
              ar: "جاري تحميل وحدات القياس...",
            })}
          </p>
        </div>
      )}

      {/* Measure Units Grid */}
      {!loading && filteredMeasureUnits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeasureUnits.map((unit) => (
            <MeasureUnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-12">
          <Ruler className="w-16 h-16 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {searchTerm || statusFilter !== "all"
              ? t(translations.noResults)
              : t({
                  en: "No measure units found",
                  ar: "لم يتم العثور على وحدات قياس",
                })}
          </h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {searchTerm || statusFilter !== "all"
              ? t({
                  en: "Try adjusting your search or filters",
                  ar: "جرب تعديل البحث أو المرشحات",
                })
              : t({
                  en: "Get started by adding your first measure unit",
                  ar: "ابدأ بإضافة وحدة القياس الأولى",
                })}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              {t({
                en: "Add Measure Unit",
                ar: "إضافة وحدة قياس",
              })}
            </button>
          )}
        </div>
      ) : null}

      {/* Add/Edit Measure Unit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingMeasureUnit}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMeasureUnit(null);
        }}
        title={
          editingMeasureUnit
            ? t({
                en: "Edit Measure Unit",
                ar: "تعديل وحدة القياس",
              })
            : t({
                en: "Add Measure Unit",
                ar: "إضافة وحدة قياس",
              })
        }
        size="md"
      >
        <MeasureUnitForm
          measureUnit={editingMeasureUnit}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingMeasureUnit(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingMeasureUnit}
        onClose={() => setDeletingMeasureUnit(null)}
        title={t({
          en: "Delete Measure Unit",
          ar: "حذف وحدة القياس",
        })}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t({
              en: "Are you sure you want to delete this measure unit? This action cannot be undone.",
              ar: "هل أنت متأكد من حذف وحدة القياس هذه؟ لا يمكن التراجع عن هذا الإجراء.",
            })}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingMeasureUnit(null)}
              className="btn-secondary"
            >
              {t(translations.cancel)}
            </button>
            <button onClick={handleDeleteMeasureUnit} className="btn-danger">
              {t(translations.delete)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MeasureUnits;

