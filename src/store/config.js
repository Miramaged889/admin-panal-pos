import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import clientsReducer from "./slices/clientsSlice";
import saasUsersReducer from "./slices/saasUsersSlice";
import tenantUsersReducer from "./slices/tenantUsersSlice";
import {
  loggerMiddleware,
  errorMiddleware,
  analyticsMiddleware,
} from "./middleware";

// Configure store with proper middleware
export const createStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      clients: clientsReducer,
      saasUsers: saasUsersReducer,
      tenantUsers: tenantUsersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types for serialization checks
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/PURGE",
            "persist/REGISTER",
            "persist/FLUSH",
          ],
          // Ignore these field paths in all actions
          ignoredActionPaths: ["payload.timestamp", "meta.arg.timestamp"],
          // Ignore these paths in the state
          ignoredPaths: ["auth.user.timestamp"],
        },
        // Add custom middleware if needed
        thunk: {
          extraArgument: {
            // Add any extra arguments for thunks here
          },
        },
      }).concat([
        // Add custom middleware in development
        ...(import.meta.env.DEV ? [loggerMiddleware] : []),
        errorMiddleware,
        analyticsMiddleware,
      ]),
    devTools: import.meta.env.DEV,
  });
};

// Export store instance
export const store = createStore();

// Export types for better development experience
export const getState = () => store.getState();
export const getDispatch = () => store.dispatch;
