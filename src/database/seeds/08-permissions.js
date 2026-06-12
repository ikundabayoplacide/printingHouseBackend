'use strict';

const { v4: uuidv4 } = require('uuid');

// All permissions defined as resource.action
const PERMISSIONS = [
  // Users
  { resource: 'users', action: 'view' },
  { resource: 'users', action: 'create' },
  { resource: 'users', action: 'edit' },
  { resource: 'users', action: 'delete' },

  // Customers
  { resource: 'customers', action: 'view' },
  { resource: 'customers', action: 'create' },
  { resource: 'customers', action: 'edit' },
  { resource: 'customers', action: 'delete' },

  // Jobs
  { resource: 'jobs', action: 'view' },
  { resource: 'jobs', action: 'create' },
  { resource: 'jobs', action: 'edit' },
  { resource: 'jobs', action: 'delete' },
  { resource: 'jobs', action: 'assign' },
  { resource: 'jobs', action: 'cancel' },
  { resource: 'jobs', action: 'approve' },
  { resource: 'jobs', action: 'reject' },

  // Payments
  { resource: 'payments', action: 'view' },
  { resource: 'payments', action: 'create' },
  { resource: 'payments', action: 'approve' },

  // Quotations
  { resource: 'quotations', action: 'view' },
  { resource: 'quotations', action: 'create' },
  { resource: 'quotations', action: 'edit' },
  { resource: 'quotations', action: 'export' },
  { resource: 'quotations', action: 'print' },

  // Invoices
  { resource: 'invoices', action: 'view' },
  { resource: 'invoices', action: 'create' },
  { resource: 'invoices', action: 'edit' },
  { resource: 'invoices', action: 'export' },
  { resource: 'invoices', action: 'print' },

  // Stock
  { resource: 'stock', action: 'view' },
  { resource: 'stock', action: 'create' },
  { resource: 'stock', action: 'edit' },
  { resource: 'stock', action: 'delete' },
  { resource: 'stock', action: 'approve' },
  { resource: 'stock', action: 'reject' },
  { resource: 'stock', action: 'export' },

  // Departments
  { resource: 'departments', action: 'view' },
  { resource: 'departments', action: 'edit' },

  // Reports
  { resource: 'reports', action: 'view' },
  { resource: 'reports', action: 'create' },
  { resource: 'reports', action: 'export' },
  { resource: 'reports', action: 'print' },
  { resource: 'reports', action: 'approve' },
  { resource: 'reports', action: 'reject' },

  // Production
  { resource: 'production', action: 'view' },
  { resource: 'production', action: 'assign' },
  { resource: 'production', action: 'approve' },
  { resource: 'production', action: 'reject' },

  // Finance
  { resource: 'finance', action: 'view' },
  { resource: 'finance', action: 'approve' },
  { resource: 'finance', action: 'reject' },
  { resource: 'finance', action: 'export' },
  { resource: 'finance', action: 'print' },

  // Taxes
  { resource: 'taxes', action: 'view' },
  { resource: 'taxes', action: 'create' },
  { resource: 'taxes', action: 'edit' },
  { resource: 'taxes', action: 'export' },

  // Recovery
  { resource: 'recovery', action: 'view' },
  { resource: 'recovery', action: 'create' },
  { resource: 'recovery', action: 'edit' },

  // Boutique
  { resource: 'boutique', action: 'view' },
  { resource: 'boutique', action: 'create' },
  { resource: 'boutique', action: 'edit' },

  // Hobe
  { resource: 'hobe', action: 'view' },
  { resource: 'hobe', action: 'create' },
  { resource: 'hobe', action: 'edit' },
  { resource: 'hobe', action: 'delete' },
  { resource: 'hobe', action: 'sell' },

  // Deliveries
  { resource: 'deliveries', action: 'view' },
  { resource: 'deliveries', action: 'edit' },

  // Visitors
  { resource: 'visitors', action: 'view' },
  { resource: 'visitors', action: 'create' },

  // Dashboard
  { resource: 'dashboard', action: 'view' },

  // Settings
  { resource: 'settings', action: 'view' },
  { resource: 'settings', action: 'edit' },

  // Workers / Teams
  { resource: 'workers', action: 'view' },
  { resource: 'workers', action: 'assign' },
  { resource: 'teams', action: 'view' },
  { resource: 'teams', action: 'edit' },

  // Tasks
  { resource: 'tasks', action: 'view' },
  { resource: 'tasks', action: 'edit' },

  // Time Logs
  { resource: 'timelogs', action: 'view' },
  { resource: 'timelogs', action: 'create' },

  // HR
  { resource: 'hr', action: 'view' },
  { resource: 'hr', action: 'edit' },

  // Suppliers
  { resource: 'suppliers', action: 'view' },
  { resource: 'suppliers', action: 'create' },
  { resource: 'suppliers', action: 'edit' },

  // Dossiers
  { resource: 'dossiers', action: 'view' },
  { resource: 'dossiers', action: 'create' },
  { resource: 'dossiers', action: 'edit' },

  // E-Procurement
  { resource: 'procurement', action: 'view' },
  { resource: 'procurement', action: 'create' },
  { resource: 'procurement', action: 'edit' },

  // UI Permissions / Workflow Config
  { resource: 'ui_permissions', action: 'view' },
  { resource: 'ui_permissions', action: 'edit' },
  { resource: 'workflow_config', action: 'view' },
  { resource: 'workflow_config', action: 'edit' },
];

// Build permission map: name -> id
const permissionMap = {};
const permissionRows = PERMISSIONS.map((p) => {
  const id = uuidv4();
  const name = `${p.resource}.${p.action}`;
  permissionMap[name] = id;
  return {
    id,
    name,
    resource: p.resource,
    action: p.action,
    description: `${p.action.charAt(0).toUpperCase() + p.action.slice(1)} ${p.resource}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

// Role → permission names mapping
const ROLE_PERMISSIONS = {
  ADMIN: PERMISSIONS.map((p) => `${p.resource}.${p.action}`), // full access

  RECEPTIONIST: [
    'dashboard.view',
    'visitors.view', 'visitors.create',
    'payments.view', 'payments.create',
    'deliveries.view', 'deliveries.edit',
    'boutique.view',
    'customers.view', 'customers.create',
    'jobs.view',
  ],

  SALES: [
    'dashboard.view',
    'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.cancel',
    'stock.view',
    'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.export', 'quotations.print',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.print',
    'dossiers.view', 'dossiers.create', 'dossiers.edit',
    'customers.view', 'customers.create', 'customers.edit',
  ],

  DAF: [
    'dashboard.view',
    'jobs.view', 'jobs.approve', 'jobs.reject',
    'finance.view', 'finance.approve', 'finance.reject', 'finance.export', 'finance.print',
    'hr.view', 'hr.edit',
    'reports.view', 'reports.export', 'reports.print',
    'payments.view',
    'invoices.view',
  ],

  ACCOUNTANT: [
    'dashboard.view',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.export', 'invoices.print',
    'payments.view', 'payments.create', 'payments.approve',
    'reports.view', 'reports.export', 'reports.print',
    'taxes.view', 'taxes.create', 'taxes.edit', 'taxes.export',
    'recovery.view', 'recovery.create', 'recovery.edit',
    'procurement.view', 'procurement.create', 'procurement.edit',
  ],

  PRODUCTION_MANAGER: [
    'dashboard.view',
    'jobs.view', 'jobs.assign',
    'production.view', 'production.assign',
    'departments.view', 'departments.edit',
    'reports.view',
  ],

  STOCK: [
    'dashboard.view',
    'stock.view', 'stock.create', 'stock.edit', 'stock.export',
    'stock.approve', 'stock.reject',
    'suppliers.view', 'suppliers.create', 'suppliers.edit',
  ],

  SUPERVISOR: [
    'dashboard.view',
    'production.view', 'production.approve', 'production.reject',
    'teams.view', 'teams.edit',
    'workers.view', 'workers.assign',
    'reports.view', 'reports.create', 'reports.export',
    'reports.approve', 'reports.reject',
    'jobs.view',
  ],

  WORKER: [
    'dashboard.view',
    'tasks.view', 'tasks.edit',
    'timelogs.view', 'timelogs.create',
    'stock.view',
    'reports.view',
  ],

  HOBE: [
    'dashboard.view',
    'hobe.view',
    'hobe.create',
    'hobe.edit',
    'hobe.delete',
    'hobe.sell',
  ],
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Insert all permissions
    await queryInterface.bulkInsert('permissions', permissionRows);

    // Build role_permissions rows
    const rolePermissionRows = [];
    for (const [role, permNames] of Object.entries(ROLE_PERMISSIONS)) {
      for (const permName of permNames) {
        const permId = permissionMap[permName];
        if (permId) {
          rolePermissionRows.push({
            id: uuidv4(),
            role,
            permissionId: permId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('role_permissions', rolePermissionRows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
