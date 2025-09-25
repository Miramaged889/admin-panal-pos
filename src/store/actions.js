// Re-export all actions from slices for centralized access
export {
  // Auth actions
  loginSaaSAdmin,
  logoutSaaSAdmin,
  getCurrentUser,
  initializeAuth,
  clearError as clearAuthError,
  logout as logoutAction,
} from "./slices/authSlice";

export {
  // Client actions
  fetchClients,
  fetchTenants,
  createTenant,
  updateTenant,
  createClient,
  updateClient,
  deleteClient,
  getClientById,
  clearError as clearClientsError,
  clearSuccess as clearClientsSuccess,
  setCurrentClient,
} from "./slices/clientsSlice";

export {
  // SaaS Users actions
  fetchSaasUsers,
  createSaasUser,
  updateSaasUser,
  deleteSaasUser,
  getSaasUserById,
  clearError as clearSaasUsersError,
  clearSuccess as clearSaasUsersSuccess,
  setCurrentUser,
} from "./slices/saasUsersSlice";

export {
  // Tenant Users actions
  fetchTenantUsers,
  createTenantUser,
  updateTenantUser,
  deleteTenantUser,
  getTenantUserById,
  clearError as clearTenantUsersError,
  clearSuccess as clearTenantUsersSuccess,
  setCurrentTenantUser,
} from "./slices/tenantUsersSlice";

export {
  // Managers actions
  fetchManagers,
  createManager,
  updateManager,
  deleteManager,
  getManagerById,
  clearError as clearManagersError,
  clearSuccess as clearManagersSuccess,
  setCurrentManager,
  clearManagers,
} from "./slices/managersSlice";

// Action types for reference
export const ACTION_TYPES = {
  // Auth
  LOGIN_PENDING: "auth/loginSaaSAdmin/pending",
  LOGIN_FULFILLED: "auth/loginSaaSAdmin/fulfilled",
  LOGIN_REJECTED: "auth/loginSaaSAdmin/rejected",
  LOGOUT_PENDING: "auth/logoutSaaSAdmin/pending",
  LOGOUT_FULFILLED: "auth/logoutSaaSAdmin/fulfilled",
  LOGOUT_REJECTED: "auth/logoutSaaSAdmin/rejected",

  // Clients
  FETCH_CLIENTS_PENDING: "clients/fetchClients/pending",
  FETCH_CLIENTS_FULFILLED: "clients/fetchClients/fulfilled",
  FETCH_CLIENTS_REJECTED: "clients/fetchClients/rejected",
  CREATE_CLIENT_PENDING: "clients/createClient/pending",
  CREATE_CLIENT_FULFILLED: "clients/createClient/fulfilled",
  CREATE_CLIENT_REJECTED: "clients/createClient/rejected",
  UPDATE_CLIENT_PENDING: "clients/updateClient/pending",
  UPDATE_CLIENT_FULFILLED: "clients/updateClient/fulfilled",
  UPDATE_CLIENT_REJECTED: "clients/updateClient/rejected",
  DELETE_CLIENT_PENDING: "clients/deleteClient/pending",
  DELETE_CLIENT_FULFILLED: "clients/deleteClient/fulfilled",
  DELETE_CLIENT_REJECTED: "clients/deleteClient/rejected",

  // SaaS Users
  FETCH_SAAS_USERS_PENDING: "saasUsers/fetchSaasUsers/pending",
  FETCH_SAAS_USERS_FULFILLED: "saasUsers/fetchSaasUsers/fulfilled",
  FETCH_SAAS_USERS_REJECTED: "saasUsers/fetchSaasUsers/rejected",
  CREATE_SAAS_USER_PENDING: "saasUsers/createSaasUser/pending",
  CREATE_SAAS_USER_FULFILLED: "saasUsers/createSaasUser/fulfilled",
  CREATE_SAAS_USER_REJECTED: "saasUsers/createSaasUser/rejected",
  UPDATE_SAAS_USER_PENDING: "saasUsers/updateSaasUser/pending",
  UPDATE_SAAS_USER_FULFILLED: "saasUsers/updateSaasUser/fulfilled",
  UPDATE_SAAS_USER_REJECTED: "saasUsers/updateSaasUser/rejected",
  DELETE_SAAS_USER_PENDING: "saasUsers/deleteSaasUser/pending",
  DELETE_SAAS_USER_FULFILLED: "saasUsers/deleteSaasUser/fulfilled",
  DELETE_SAAS_USER_REJECTED: "saasUsers/deleteSaasUser/rejected",

  // Tenant Users
  FETCH_TENANT_USERS_PENDING: "tenantUsers/fetchTenantUsers/pending",
  FETCH_TENANT_USERS_FULFILLED: "tenantUsers/fetchTenantUsers/fulfilled",
  FETCH_TENANT_USERS_REJECTED: "tenantUsers/fetchTenantUsers/rejected",
  CREATE_TENANT_USER_PENDING: "tenantUsers/createTenantUser/pending",
  CREATE_TENANT_USER_FULFILLED: "tenantUsers/createTenantUser/fulfilled",
  CREATE_TENANT_USER_REJECTED: "tenantUsers/createTenantUser/rejected",
  UPDATE_TENANT_USER_PENDING: "tenantUsers/updateTenantUser/pending",
  UPDATE_TENANT_USER_FULFILLED: "tenantUsers/updateTenantUser/fulfilled",
  UPDATE_TENANT_USER_REJECTED: "tenantUsers/updateTenantUser/rejected",
  DELETE_TENANT_USER_PENDING: "tenantUsers/deleteTenantUser/pending",
  DELETE_TENANT_USER_FULFILLED: "tenantUsers/deleteTenantUser/fulfilled",
  DELETE_TENANT_USER_REJECTED: "tenantUsers/deleteTenantUser/rejected",
};
