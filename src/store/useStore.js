import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      isAuthenticated: false,
      user: null,

      // Clients data
      clients: [
        {
          id: "1",
          name: "شركة الأعمال الذكية",
          nameEn: "Smart Business Corp",
          email: "contact@smartbusiness.com",
          phone: "+966501234567",
          subscriptionStart: "2024-01-01",
          subscriptionEnd: "2024-12-31",
          status: "active",
          numberOfUsers: "25",
          subscriptionOptions: {
            hetchin: true,
            delivery: true,
          },
          manager: {
            name: "أحمد محمد",
            nameEn: "Ahmed Mohammed",
            email: "ahmed@smartbusiness.com",
            phone: "+966501234568",
          },
          branches: [
            {
              id: "b1",
              name: "الفرع الرئيسي",
              nameEn: "Main Branch",
              location: "الرياض، السعودية",
              locationEn: "Riyadh, Saudi Arabia",
            },
            {
              id: "b2",
              name: "فرع جدة",
              nameEn: "Jeddah Branch",
              location: "جدة، السعودية",
              locationEn: "Jeddah, Saudi Arabia",
            },
          ],
        },
        {
          id: "2",
          name: "مؤسسة التقنية المتقدمة",
          nameEn: "Advanced Tech Foundation",
          email: "info@advancedtech.com",
          phone: "+966507654321",
          subscriptionStart: "2024-03-01",
          subscriptionEnd: "2024-03-30", // Expired subscription
          status: "expired",
          numberOfUsers: "15",
          subscriptionOptions: {
            hetchin: true,
            delivery: false,
          },
          manager: {
            name: "خالد العبدالله",
            nameEn: "Khalid Al-Abdullah",
            email: "khalid@advancedtech.com",
            phone: "+966507654322",
          },
          branches: [
            {
              id: "b3",
              name: "المقر الرئيسي",
              nameEn: "Headquarters",
              location: "الدمام، السعودية",
              locationEn: "Dammam, Saudi Arabia",
            },
          ],
        },
      ],

      // Auth actions
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),

      // Client actions
      addClient: (client) => {
        const newClient = {
          ...client,
          id: Date.now().toString(),
          status: "active",
          numberOfUsers: client.numberOfUsers || "",
          subscriptionOptions: {
            hetchin: true,
            delivery: true,
            ...client.subscriptionOptions,
          },
          manager: client.manager || {
            name: "",
            nameEn: "",
            email: "",
            phone: "",
          },
          branches: [],
        };
        set((state) => ({
          clients: [...state.clients, newClient],
        }));
      },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      // Branch actions
      addBranch: (clientId, branch) => {
        const newBranch = {
          ...branch,
          id: Date.now().toString(),
        };
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, branches: [...client.branches, newBranch] }
              : client
          ),
        }));
      },

      updateBranch: (clientId, branchId, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  branches: client.branches.map((branch) =>
                    branch.id === branchId ? { ...branch, ...updates } : branch
                  ),
                }
              : client
          ),
        }));
      },

      deleteBranch: (clientId, branchId) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  branches: client.branches.filter(
                    (branch) => branch.id !== branchId
                  ),
                }
              : client
          ),
        }));
      },

      // Utility functions
      getClient: (id) => {
        return get().clients.find((client) => client.id === id);
      },

      isClientExpired: (client) => {
        return new Date() > new Date(client.subscriptionEnd);
      },

      getActiveClients: () => {
        return get().clients.filter((client) => !get().isClientExpired(client));
      },

      getExpiredClients: () => {
        return get().clients.filter((client) => get().isClientExpired(client));
      },
    }),
    {
      name: "admin-panel-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        clients: state.clients,
      }),
    }
  )
);

export default useStore;
