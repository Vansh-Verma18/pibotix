import { Role } from './models/Role';
import { Permission } from './models/Permission';

export async function seedDatabase() {
  try {
    const rolesCount = await Role.countDocuments();
    if (rolesCount > 0) {
      return; // Already seeded
    }

    console.log('Seeding initial roles and permissions...');

    // Define permissions
    const permissions = [
      { action: 'manage_users', description: 'Can view, edit, and delete any user' },
      { action: 'approve_users', description: 'Can approve or reject pending users' },
      { action: 'manage_roles', description: 'Can change user roles' },
      { action: 'view_dashboard', description: 'Can access the admin dashboard' },
    ];

    const createdPermissions = await Permission.insertMany(permissions);

    const getPermIds = (actions: string[]) => 
      createdPermissions.filter(p => actions.includes(p.action)).map(p => p._id);

    // Define roles
    const roles = [
      {
        name: 'superadmin',
        permissions: getPermIds(['manage_users', 'approve_users', 'manage_roles', 'view_dashboard']),
      },
      {
        name: 'admin',
        permissions: getPermIds(['approve_users', 'view_dashboard']),
      },
      {
        name: 'user',
        permissions: [],
      },
    ];

    await Role.insertMany(roles);
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
