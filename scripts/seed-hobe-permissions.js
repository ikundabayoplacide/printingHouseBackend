require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../src/config/database');

const hobePermissions = [
  { resource: 'hobe', action: 'view' },
  { resource: 'hobe', action: 'create' },
  { resource: 'hobe', action: 'edit' },
  { resource: 'hobe', action: 'delete' },
  { resource: 'hobe', action: 'sell' },
];

const run = async () => {
  await sequelize.authenticate();

  for (const p of hobePermissions) {
    const name = `${p.resource}.${p.action}`;

    // Skip if already exists
    const [existing] = await sequelize.query(
      `SELECT id FROM permissions WHERE name = :name LIMIT 1`,
      { replacements: { name }, type: sequelize.QueryTypes.SELECT }
    );

    let permId;

    if (existing) {
      permId = existing.id;
      console.log(`⚠  Permission already exists: ${name}`);
    } else {
      permId = uuidv4();
      await sequelize.query(
        `INSERT INTO permissions (id, name, resource, action, description, "createdAt", "updatedAt")
         VALUES (:id, :name, :resource, :action, :description, NOW(), NOW())`,
        {
          replacements: {
            id: permId,
            name,
            resource: p.resource,
            action: p.action,
            description: `${p.action.charAt(0).toUpperCase() + p.action.slice(1)} hobe`,
          },
        }
      );
      console.log(`✅ Created permission: ${name}`);
    }

    // Link to HOBE role if not already linked
    const [linked] = await sequelize.query(
      `SELECT id FROM role_permissions WHERE role = 'HOBE' AND "permissionId" = :permId LIMIT 1`,
      { replacements: { permId }, type: sequelize.QueryTypes.SELECT }
    );

    if (linked) {
      console.log(`⚠  Already linked to HOBE: ${name}`);
    } else {
      await sequelize.query(
        `INSERT INTO role_permissions (id, role, "permissionId", "createdAt", "updatedAt")
         VALUES (:id, 'HOBE', :permId, NOW(), NOW())`,
        { replacements: { id: uuidv4(), permId } }
      );
      console.log(`🔗 Linked to HOBE role: ${name}`);
    }
  }

  console.log('\nDone.');
  await sequelize.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
