import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Users,
  Building,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Truck,
  Package,
  User,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../constants/translations";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectTenantsList,
  selectTenantsLoading,
  selectTenantsError,
  selectTenantsSuccess,
} from "../store/selectors";
import {
  fetchTenants,
  deleteClient,
  clearClientsError,
  clearClientsSuccess,
} from "../store/actions";
import Modal from "../components/UI/Modal";
import SubscriptionStatus from "../components/UI/SubscriptionStatus";
import ClientForm from "../components/Forms/ClientForm";
import { toast } from "../components/UI/Toast";

const Clients = () => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const tenants = useAppSelector(selectTenantsList);
  const loading = useAppSelector(selectTenantsLoading);
  const error = useAppSelector(selectTenantsError);
  const success = useAppSelector(selectTenantsSuccess);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch tenants on component mount
  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(t({ en: success, ar: success }));
      dispatch(clearClientsSuccess());
    }
  }, [success, dispatch, t]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(t({ en: error, ar: error }));
      dispatch(clearClientsError());
    }
  }, [error, dispatch, t]);

  // Filter tenants based on search and status
  const filteredClients = tenants.filter((client) => {
    const matchesSearch =
      client.arabic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.english_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.subdomain?.toLowerCase().includes(searchTerm.toLowerCase());

    const isExpired = new Date() > new Date(client.End_Date);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !isExpired) ||
      (statusFilter === "expired" && isExpired);

    return matchesSearch && matchesStatus;
  });

  const handleDeleteClient = async () => {
    if (deletingClient) {
      try {
        // Pass both id and schema (subdomain) for the new API structure
        await dispatch(
          deleteClient({
            id: deletingClient.id,
            schema: deletingClient.subdomain,
          })
        ).unwrap();
        setDeletingClient(null);
        setActiveDropdown(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCardClick = (clientId, event) => {
    // Don't navigate if clicking on the dropdown or its items
    if (event.target.closest(".dropdown-container")) {
      return;
    }
    navigate(`/clients/${clientId}`);
  };

  const ClientCard = ({ client }) => {
    return (
      <div
        className="card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={(e) => handleCardClick(client.id, e)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                {isRTL
                  ? client.arabic_name
                  : client.english_name || client.arabic_name}
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {client.subdomain}
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(
                  activeDropdown === client.id ? null : client.id
                );
              }}
              className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {activeDropdown === client.id && (
              <div
                className={`absolute top-10 ${
                  isRTL ? "left-0" : "right-0"
                } w-48 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10`}
              >
                <Link
                  to={`/clients/${client.id}`}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  onClick={() => setActiveDropdown(null)}
                >
                  <Eye className="w-4 h-4" />
                  {t(translations.view)}
                </Link>
                <button
                  onClick={() => {
                    setEditingClient(client);
                    setActiveDropdown(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left"
                >
                  <Edit className="w-4 h-4" />
                  {t(translations.edit)}
                </button>
                <button
                  onClick={() => {
                    setDeletingClient(client);
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

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <Building className="w-4 h-4" />
            {client.no_branches || 0} {t(translations.branches)}
          </div>

          {/* Number of Users */}
          {client.no_users && (
            <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <Users className="w-4 h-4" />
              {client.no_users} {t(translations.users)}
            </div>
          )}

          {/* Subscription Options */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4 text-primary-600" />
              <span
                className={
                  client.modules_enabled?.kitchen
                    ? "text-success-600"
                    : "text-text-muted-light dark:text-text-muted-dark"
                }
              >
                {t(translations.ketchin)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-primary-600" />
              <span
                className={
                  client.modules_enabled?.Delivery
                    ? "text-success-600"
                    : "text-text-muted-light dark:text-text-muted-dark"
                }
              >
                {t(translations.delivery)}
              </span>
            </div>
          </div>

          <SubscriptionStatus client={client} showDetails />
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
            {t(translations.clients)}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {t({
              en: "Manage your clients and their subscriptions",
              ar: "إدارة عملائك واشتراكاتهم",
            })}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t(translations.addClient)}
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
          <option value="expired">{t(translations.expired)}</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t({ en: "Loading clients...", ar: "جاري تحميل العملاء..." })}
          </p>
        </div>
      )}

      {/* Clients Grid */}
      {!loading && filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            {searchTerm || statusFilter !== "all"
              ? t(translations.noResults)
              : t(translations.noClients)}
          </h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {searchTerm || statusFilter !== "all"
              ? t({
                  en: "Try adjusting your search or filters",
                  ar: "جرب تعديل البحث أو المرشحات",
                })
              : t({
                  en: "Get started by adding your first client",
                  ar: "ابدأ بإضافة عميلك الأول",
                })}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              {t(translations.addClient)}
            </button>
          )}
        </div>
      ) : null}

      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingClient}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClient(null);
        }}
        title={
          editingClient ? t(translations.editClient) : t(translations.addClient)
        }
        size="lg"
      >
        <ClientForm
          client={editingClient}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingClient(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        title={t(translations.deleteClient)}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t(translations.deleteClientConfirm)}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingClient(null)}
              className="btn-secondary"
            >
              {t(translations.cancel)}
            </button>
            <button onClick={handleDeleteClient} className="btn-danger">
              {t(translations.delete)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
