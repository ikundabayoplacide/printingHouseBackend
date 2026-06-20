require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../src/config/database');

const ROLE = 'ACCOUNTANT';
const PERMISSIONS = ['hobe.view', 'boutique.view'];

const run = async () => {
  await sequelize.authenticate();

  for (const name of PERMISSIONS) {
    const [perm] = await sequelize.query(
      `SELECT id FROM permissions WHERE name = :name LIMIT 1`,
      { replacements: { name }, type: sequelize.QueryTypes.SELECT }
    );

    if (!perm) {
      console.log(`❌ Permission not found: ${name}`);
      continue;
    }

    const [existing] = await sequelize.query(
      `SELECT id FROM role_permissions WHERE role = :role AND "permissionId" = :permId LIMIT 1`,
      { replacements: { role: ROLE, permId: perm.id }, type: sequelize.QueryTypes.SELECT }
    );

    if (existing) {
      console.log(`⚠  Already granted: ${name} → ${ROLE}`);
    } else {
      await sequelize.query(
        `INSERT INTO role_permissions (id, role, "permissionId", "createdAt", "updatedAt")
         VALUES (:id, :role, :permId, NOW(), NOW())`,
        { replacements: { id: uuidv4(), role: ROLE, permId: perm.id } }
      );
      console.log(`✅ Granted: ${name} → ${ROLE}`);
    }
  }

  console.log('\nDone. Restart the server to clear the permission cache.');
  await sequelize.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
