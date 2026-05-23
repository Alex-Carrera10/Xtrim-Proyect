import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "xtrim-leads-crm",
  frameworkVersion: "4",
  plugins: ["serverless-offline"],
  build: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: "node22",
      platform: "node",
      external: [],
      define: { "require.resolve": "undefined" },
    },
  },
  provider: {
    name: "aws",
    runtime: "nodejs22.x",
    region: "us-east-1",
    profile: "muebleria",
    httpApi: {
      cors: true,
    },
    environment: {
      DATABASE_URL: "${env:DATABASE_URL}",
    },
  },
  functions: {
    createLead: {
      handler: "src/infrastructure/handlers/lead.createLead",
      events: [
        {
          httpApi: {
            method: "POST",
            path: "/leads",
          },
        },
      ],
    },
    getLeads: {
      handler: "src/infrastructure/handlers/lead.getLeads",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/leads",
          },
        },
      ],
    },
    getLeadById: {
      handler: "src/infrastructure/handlers/crm.getLeadById",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/leads/{id}",
          },
        },
      ],
    },
    getSalesKPI: {
      handler: "src/infrastructure/handlers/lead.getSalesKPI",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/leads/kpi",
          },
        },
      ],
    },
    updateLeadStatus: {
      handler: "src/infrastructure/handlers/crm.updateLeadStatus",
      events: [
        {
          httpApi: {
            method: "PATCH",
            path: "/leads/{id}/status",
          },
        },
      ],
    },
    addActivity: {
      handler: "src/infrastructure/handlers/crm.addActivity",
      events: [
        {
          httpApi: {
            method: "POST",
            path: "/leads/{id}/activities",
          },
        },
      ],
    },
    getLeadHistory: {
      handler: "src/infrastructure/handlers/crm.getLeadHistory",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/leads/{id}/activities",
          },
        },
      ],
    },
    deleteLead: {
      handler: "src/infrastructure/handlers/crm.deleteLead",
      events: [
        {
          httpApi: {
            method: "DELETE",
            path: "/leads/{id}",
          },
        },
      ],
    },
    updateLeadFull: {
      handler: "src/infrastructure/handlers/crm.updateLead",
      events: [
        {
          httpApi: {
            method: "PUT",
            path: "/leads/{id}",
          },
        },
      ],
    },
    createProduct: {
      handler: "src/infrastructure/handlers/product.createProduct",
      events: [
        {
          httpApi: {
            method: "POST",
            path: "/products",
          },
        },
      ],
    },
    getProducts: {
      handler: "src/infrastructure/handlers/product.getProducts",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/products",
          },
        },
      ],
    },
    getProductById: {
      handler: "src/infrastructure/handlers/product.getProductById",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/products/{id}",
          },
        },
      ],
    },
    updateProduct: {
      handler: "src/infrastructure/handlers/product.updateProduct",
      events: [
        {
          httpApi: {
            method: "PUT",
            path: "/products/{id}",
          },
        },
      ],
    },
    deleteProduct: {
      handler: "src/infrastructure/handlers/product.deleteProduct",
      events: [
        {
          httpApi: {
            method: "DELETE",
            path: "/products/{id}",
          },
        },
      ],
    },
    getNotifications: {
      handler: "src/infrastructure/handlers/notification.getNotifications",
      events: [
        {
          httpApi: {
            method: "GET",
            path: "/notifications",
          },
        },
      ],
    },
    markNotificationAsRead: {
      handler: "src/infrastructure/handlers/notification.markAsRead",
      events: [
        {
          httpApi: {
            method: "PATCH",
            path: "/notifications/{id}/read",
          },
        },
      ],
    },
    markAllNotificationsAsRead: {
      handler: "src/infrastructure/handlers/notification.markAllAsRead",
      events: [
        {
          httpApi: {
            method: "PATCH",
            path: "/notifications/read-all",
          },
        },
      ],
    },
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
