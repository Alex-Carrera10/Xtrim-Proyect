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
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
