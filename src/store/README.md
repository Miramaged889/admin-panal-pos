# Redux Store Architecture

This directory contains the complete Redux store implementation for the admin panel.

## 📁 Structure

```
src/store/
├── index.js              # Main store exports
├── config.js             # Store configuration and middleware
├── hooks.js              # Redux hooks (useAppDispatch, useAppSelector)
├── actions.js            # Centralized action exports
├── selectors.js          # State selectors for better performance
├── middleware.js         # Custom middleware (logging, error handling)
├── slices/               # Redux Toolkit slices
│   ├── authSlice.js      # Authentication state management
│   ├── clientsSlice.js   # Client/tenant management
│   └── saasUsersSlice.js # SaaS user management
└── README.md             # This file
```

mira123456@

## 🏗️ Architecture Overview

### Store Configuration (`config.js`)

- **Middleware Setup**: Custom middleware for logging, error handling, and analytics
- **Serialization Checks**: Proper configuration for non-serializable data
- **Development Tools**: Redux DevTools integration
- **Thunk Configuration**: Extra arguments for async actions

### State Management

- **Auth Slice**: JWT authentication, user management, login/logout
- **Clients Slice**: CRUD operations for tenant clients
- **SaaS Users Slice**: SaaS admin user management

### Custom Middleware

- **Logger**: Development-only action logging
- **Error Handler**: Global error handling and notifications
- **Analytics**: Action tracking for analytics

## 🎯 Usage Examples

### Using Hooks

```javascript
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectClientsList, selectClientsLoading } from "../store/selectors";
import { fetchClients, createClient } from "../store/actions";

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectClientsList);
  const loading = useAppSelector(selectClientsLoading);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleCreateClient = (clientData) => {
    dispatch(createClient(clientData));
  };
};
```

### Using Selectors

```javascript
import { useAppSelector } from "../store/hooks";
import {
  selectActiveClients,
  selectExpiredClients,
  selectClientById,
} from "../store/selectors";

// Get filtered clients
const activeClients = useAppSelector(selectActiveClients);
const expiredClients = useAppSelector(selectExpiredClients);

// Get specific client
const client = useAppSelector((state) => selectClientById(state, clientId));
```

### Using Actions

```javascript
import { useAppDispatch } from "../store/hooks";
import { loginSaaSAdmin, fetchClients, createClient } from "../store/actions";

const dispatch = useAppDispatch();

// Login
await dispatch(loginSaaSAdmin({ email, password })).unwrap();

// Fetch clients
await dispatch(fetchClients()).unwrap();

// Create client
await dispatch(createClient(clientData)).unwrap();
```

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Controls development tools and middleware
- `REACT_APP_API_BASE_URL`: API base URL (optional)

### Middleware Configuration

- **Development**: Full logging and debugging
- **Production**: Error handling and analytics only

## 🚀 Best Practices

### 1. Use Selectors

Always use selectors instead of accessing state directly:

```javascript
// ✅ Good
const clients = useAppSelector(selectClientsList);

// ❌ Bad
const clients = useAppSelector((state) => state.clients.clients);
```

### 2. Handle Async Actions

Use `.unwrap()` for proper error handling:

```javascript
// ✅ Good
try {
  await dispatch(createClient(data)).unwrap();
} catch (error) {
  console.error("Failed to create client:", error);
}

// ❌ Bad
dispatch(createClient(data));
```

### 3. Use Computed Selectors

For derived state, use computed selectors:

```javascript
// ✅ Good
const activeClients = useAppSelector(selectActiveClients);

// ❌ Bad
const clients = useAppSelector(selectClientsList);
const activeClients = clients.filter((client) => client.is_active);
```

### 4. Error Handling

Use the error middleware for global error handling:

```javascript
// Errors are automatically logged and handled
// You can add custom error handling in middleware.js
```

## 🔍 Debugging

### Redux DevTools

In development, use Redux DevTools for:

- Action inspection
- State time-travel
- Performance profiling

### Console Logging

Development middleware provides detailed logging:

- Action types and payloads
- State changes
- Error details

## 📊 Performance

### Selector Optimization

- Use memoized selectors for expensive computations
- Avoid creating new objects in selectors
- Use shallow equality checks

### Middleware Performance

- Logger middleware only runs in development
- Error handling is lightweight
- Analytics middleware is optional

## 🔒 Security

### Token Management

- Automatic token refresh
- Secure token storage in localStorage
- Automatic logout on token expiry

### Error Handling

- Global error handling for API failures
- Automatic redirect on authentication errors
- Secure error messages

## 🧪 Testing

### Unit Testing

```javascript
import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { store } from "../store";
import { useAppSelector } from "../store/hooks";

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

const { result } = renderHook(() => useAppSelector(selectClientsList), {
  wrapper,
});
```

### Integration Testing

- Test async actions with mock API
- Test error scenarios
- Test middleware behavior

## 📈 Monitoring

### Analytics

Track important user actions:

- Login/logout events
- Client creation/deletion
- Error occurrences

### Performance Monitoring

- Action execution time
- State update frequency
- Memory usage patterns
