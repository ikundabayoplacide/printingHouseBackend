/**
 * Define all Sequelize model associations in one place.
 * This file must be required once at startup (before any queries run).
 */

const User = require('./User');
const Customer = require('./Customer');
const Job = require('./Job');
const Department = require('./Department');
const Notification = require('./Notification');

// User → Department
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });

// Job → Customer
Job.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Job, { foreignKey: 'customerId', as: 'jobs' });

// Job → User (creator)
Job.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
User.hasMany(Job, { foreignKey: 'createdById', as: 'createdJobs' });

// Job → Department (assigned to)
Job.belongsTo(Department, { foreignKey: 'departmentAssignedToId', as: 'departmentAssignedTo' });
Department.hasMany(Job, { foreignKey: 'departmentAssignedToId', as: 'jobs' });

// Notification → User
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

module.exports = { User, Customer, Job, Department, Notification };
