import { store } from "./config";

// Re-export store from config
export { store, createStore, getState, getDispatch } from "./config";

// Default export for backward compatibility
export default store;
