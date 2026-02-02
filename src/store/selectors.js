import { createSelector } from "@reduxjs/toolkit";

// Auth selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Clients selectors
export const selectClients = (state) => state.clients;
export const selectClientsList = (state) => state.clients.clients;
export const selectCurrentClient = (state) => state.clients.currentClient;
export const selectClientsLoading = (state) => state.clients.loading;
export const selectClientsError = (state) => state.clients.error;
export const selectClientsSuccess = (state) => state.clients.success;

// Tenants selectors
export const selectTenants = (state) => state.clients.tenants;
export const selectTenantsList = (state) => state.clients.tenants;
export const selectTenantsLoading = (state) => state.clients.loading;
export const selectTenantsError = (state) => state.clients.error;
export const selectTenantsSuccess = (state) => state.clients.success;

// SaaS Users selectors
export const selectSaasUsers = (state) => state.saasUsers;
export const selectSaasUsersList = (state) => state.saasUsers.users;
export const selectCurrentSaasUser = (state) => state.saasUsers.currentUser;
export const selectSaasUsersLoading = (state) => state.saasUsers.loading;
export const selectSaasUsersError = (state) => state.saasUsers.error;
export const selectSaasUsersSuccess = (state) => state.saasUsers.success;

// Computed selectors with memoization
export const selectActiveClients = createSelector(
  [selectClientsList],
  (clients) => clients.filter((client) => client.is_active)
);

export const selectExpiredClients = createSelector(
  [selectClientsList],
  (clients) =>
    clients.filter((client) => {
      if (!client.End_Date) return false;
      return new Date() > new Date(client.End_Date);
    })
);

export const selectTrialClients = createSelector(
  [selectClientsList],
  (clients) => clients.filter((client) => client.on_trial)
);

// Client by ID selector with memoization
export const selectClientById = createSelector(
  [selectClientsList, (state, clientId) => clientId],
  (clients, clientId) => clients.find((client) => client.id === clientId)
);

// SaaS User by ID selector with memoization
export const selectSaasUserById = createSelector(
  [selectSaasUsersList, (state, userId) => userId],
  (users, userId) => users.find((user) => user.id === userId)
);

// Tenant Users selectors
export const selectTenantUsers = (state) => state.tenantUsers;
export const selectTenantUsersList = (state) => state.tenantUsers.tenantUsers;
export const selectCurrentTenantUser = (state) =>
  state.tenantUsers.currentTenantUser;
export const selectTenantUsersLoading = (state) => state.tenantUsers.loading;
export const selectTenantUsersError = (state) => state.tenantUsers.error;
export const selectTenantUsersSuccess = (state) => state.tenantUsers.success;

// Tenant User by ID selector with memoization
export const selectTenantUserById = createSelector(
  [selectTenantUsersList, (state, userId) => userId],
  (users, userId) => users.find((user) => user.id === userId)
);

// Managers selectors
export const selectManagers = (state) => state.managers;
export const selectManagersList = (state) => state.managers.managers;
export const selectCurrentManager = (state) => state.managers.currentManager;
export const selectManagersLoading = (state) => state.managers.loading;
export const selectManagersError = (state) => state.managers.error;
export const selectManagersSuccess = (state) => state.managers.success;

// Manager by ID selector with memoization
export const selectManagerById = createSelector(
  [selectManagersList, (state, managerId) => managerId],
  (managers, managerId) => managers.find((manager) => manager.id === managerId)
);

// Measure Units selectors
export const selectMeasureUnits = (state) => state.measureUnits;
export const selectMeasureUnitsList = (state) => state.measureUnits.measureUnits;
export const selectMeasureUnitsLoading = (state) => state.measureUnits.loading;
export const selectMeasureUnitsError = (state) => state.measureUnits.error;
export const selectMeasureUnitsSuccess = (state) => state.measureUnits.success;

// Measure Unit by ID selector with memoization
export const selectMeasureUnitById = createSelector(
  [selectMeasureUnitsList, (state, unitId) => unitId],
  (units, unitId) => units.find((unit) => unit.id === unitId)
);

// Currencies selectors
export const selectCurrencies = (state) => state.currencies;
export const selectCurrenciesList = (state) => state.currencies.currencies;
export const selectCurrenciesLoading = (state) => state.currencies.loading;
export const selectCurrenciesError = (state) => state.currencies.error;
export const selectCurrenciesSuccess = (state) => state.currencies.success;

// Currency by ID selector with memoization
export const selectCurrencyById = createSelector(
  [selectCurrenciesList, (state, currencyId) => currencyId],
  (currencies, currencyId) => currencies.find((currency) => currency.id === currencyId)
);
