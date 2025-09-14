// Custom middleware for logging and error handling
export const loggerMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  return result;
};

// Error handling middleware
export const errorMiddleware = (store) => (next) => (action) => {
  // Check if action is rejected
  if (action.type && action.type.endsWith("/rejected")) {
    // You can add global error handling here
    // For example, show a toast notification
    if (action.payload) {
      // Handle specific error types
      if (action.payload.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = "/login";
      }
    }
  }

  return next(action);
};

// Analytics middleware (optional)
export const analyticsMiddleware = (store) => (next) => (action) => {
  // Track specific actions for analytics
  const trackedActions = [
    "auth/loginSaaSAdmin/fulfilled",
    "auth/logoutSaaSAdmin/fulfilled",
    "clients/createClient/fulfilled",
    "clients/deleteClient/fulfilled",
  ];

  if (trackedActions.includes(action.type)) {
    // Send analytics event
    // You can integrate with Google Analytics, Mixpanel, etc.
  }

  return next(action);
};
