import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../constants/translations";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrenciesList,
  selectCurrenciesLoading,
  selectCurrenciesError,
  selectCurrenciesSuccess,
} from "../store/selectors";
import {
  fetchCurrencies,
  deleteCurrency,
  clearCurrenciesError,
  clearCurrenciesSuccess,
} from "../store/actions";
import Modal from "../components/UI/Modal";
import CurrencyForm from "../components/Forms/CurrencyForm";
import { toast } from "../components/UI/Toast";

const Currencies = () => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const currencies = useAppSelector(selectCurrenciesList);
  const loading = useAppSelector(selectCurrenciesLoading);
  const error = useAppSelector(selectCurrenciesError);
  const success = useAppSelector(selectCurrenciesSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [deletingCurrency, setDeletingCurrency] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch currencies on component mount
  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(t({ en: success, ar: success }));
      dispatch(clearCurrenciesSuccess());
    }
  }, [success, dispatch, t]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(t({ en: error, ar: error }));
      dispatch(clearCurrenciesError());
    }
  }, [error, dispatch, t]);

  // Filter currencies based on search and status
  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.symbol?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && currency.is_active) ||
      (statusFilter === "inactive" && !currency.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleDeleteCurrency = async () => {
    if (deletingCurrency) {
      try {
        await dispatch(deleteCurrency(deletingCurrency.id)).unwrap();
        setDeletingCurrency(null);
        setActiveDropdown(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const CurrencyCard = ({ currency }) => {
    return (
      <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                {currency.name}
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {currency.code} - {currency.symbol}
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(
                  activeDropdown === currency.id ? null : currency.id
                );
              }}
              className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {activeDropdown === currency.id && (
              <div
                className={`absolute top-10 ${
                  isRTL ? "left-0" : "right-0"
                } w-48 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10`}
              >
                <button
                  onClick={() => {
                    setEditingCurrency(currency);
                    setActiveDropdown(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left"
                >
                  <Edit className="w-4 h-4" />
                  {t(translations.edit)}
                </button>
                <button
                  onClick={() => {
                    setDeletingCurrency(currency);
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
          {currency.is_active ? (
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
              en: "Currencies",
              ar: "العملات",
            })}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {t({
              en: "Manage currencies and their symbols",
              ar: "إدارة العملات ورموزها",
            })}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t({
            en: "Add Currency",
            ar: "إضافة عملة",
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
              en: "Loading currencies...",
              ar: "جاري تحميل العملات...",
            })}
          </p>
        </div>
      )}

      {/* Currencies Grid */}
      {!loading && filteredCurrencies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCurrencies.map((currency) => (
            <CurrencyCard key={currency.id} currency={currency} />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {searchTerm || statusFilter !== "all"
              ? t(translations.noResults)
              : t({
                  en: "No currencies found",
                  ar: "لم يتم العثور على عملات",
                })}
          </h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {searchTerm || statusFilter !== "all"
              ? t({
                  en: "Try adjusting your search or filters",
                  ar: "جرب تعديل البحث أو المرشحات",
                })
              : t({
                  en: "Get started by adding your first currency",
                  ar: "ابدأ بإضافة العملة الأولى",
                })}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              {t({
                en: "Add Currency",
                ar: "إضافة عملة",
              })}
            </button>
          )}
        </div>
      ) : null}

      {/* Add/Edit Currency Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingCurrency}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCurrency(null);
        }}
        title={
          editingCurrency
            ? t({
                en: "Edit Currency",
                ar: "تعديل العملة",
              })
            : t({
                en: "Add Currency",
                ar: "إضافة عملة",
              })
        }
        size="md"
      >
        <CurrencyForm
          currency={editingCurrency}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCurrency(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCurrency}
        onClose={() => setDeletingCurrency(null)}
        title={t({
          en: "Delete Currency",
          ar: "حذف العملة",
        })}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t({
              en: "Are you sure you want to delete this currency? This action cannot be undone.",
              ar: "هل أنت متأكد من حذف هذه العملة؟ لا يمكن التراجع عن هذا الإجراء.",
            })}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingCurrency(null)}
              className="btn-secondary"
            >
              {t(translations.cancel)}
            </button>
            <button onClick={handleDeleteCurrency} className="btn-danger">
              {t(translations.delete)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Currencies;

