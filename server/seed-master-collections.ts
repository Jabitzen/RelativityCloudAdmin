import { storage } from "./mongodb-storage";

interface ResourceData {
  name: string;
  displayName: string;
  description: string;
  module?: string;
  isActive: boolean;
}

interface ActionData {
  name: string;
  displayName: string;
  description: string;
  category?: string;
  isActive: boolean;
}

export async function seedMasterCollections(): Promise<void> {
  console.log('🌱 Seeding master collections (resources and actions)...');

  try {
    // Define resources
    const resources: ResourceData[] = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        description: 'Main dashboard and overview screens',
        module: 'core',
        isActive: true
      },
      {
        name: 'users',
        displayName: 'Users',
        description: 'User management and profiles',
        module: 'identity',
        isActive: true
      },
      {
        name: 'agencies',
        displayName: 'Agencies',
        description: 'Agency management and configuration',
        module: 'organization',
        isActive: true
      },
      {
        name: 'roles',
        displayName: 'Roles',
        description: 'Role management and assignment',
        module: 'security',
        isActive: true
      },
      {
        name: 'permissions',
        displayName: 'Permissions',
        description: 'Permission management and configuration',
        module: 'security',
        isActive: true
      },
      {
        name: 'workflows',
        displayName: 'Workflows',
        description: 'Workflow management and automation',
        module: 'process',
        isActive: true
      },
      {
        name: 'applications',
        displayName: 'Applications',
        description: 'Application integration and management',
        module: 'integration',
        isActive: true
      },
      {
        name: 'billing',
        displayName: 'Billing',
        description: 'Billing and subscription management',
        module: 'finance',
        isActive: true
      },
      {
        name: 'settings',
        displayName: 'Settings',
        description: 'System settings and configuration',
        module: 'core',
        isActive: true
      },
      {
        name: 'activity_logs',
        displayName: 'Activity Logs',
        description: 'System activity and audit logs',
        module: 'audit',
        isActive: true
      }
    ];

    // Define actions
    const actions: ActionData[] = [
      {
        name: 'create',
        displayName: 'Create',
        description: 'Create new records or resources',
        category: 'crud',
        isActive: true
      },
      {
        name: 'read',
        displayName: 'Read',
        description: 'View and read existing records',
        category: 'crud',
        isActive: true
      },
      {
        name: 'update',
        displayName: 'Update',
        description: 'Modify existing records',
        category: 'crud',
        isActive: true
      },
      {
        name: 'delete',
        displayName: 'Delete',
        description: 'Remove or deactivate records',
        category: 'crud',
        isActive: true
      },
      {
        name: 'approve',
        displayName: 'Approve',
        description: 'Approve workflows or requests',
        category: 'workflow',
        isActive: true
      },
      {
        name: 'reject',
        displayName: 'Reject',
        description: 'Reject workflows or requests',
        category: 'workflow',
        isActive: true
      },
      {
        name: 'submit',
        displayName: 'Submit',
        description: 'Submit documents or requests',
        category: 'workflow',
        isActive: true
      },
      {
        name: 'review',
        displayName: 'Review',
        description: 'Review documents or submissions',
        category: 'workflow',
        isActive: true
      },
      {
        name: 'manage',
        displayName: 'Manage',
        description: 'Full management access (all operations)',
        category: 'admin',
        isActive: true
      },
      {
        name: 'configure',
        displayName: 'Configure',
        description: 'Configure system settings and parameters',
        category: 'admin',
        isActive: true
      },
      {
        name: 'assign',
        displayName: 'Assign',
        description: 'Assign roles, permissions, or resources',
        category: 'admin',
        isActive: true
      }
    ];

    // Seed resources
    for (const resourceData of resources) {
      const existingResource = await storage.getResourceByName(resourceData.name);
      if (!existingResource) {
        await storage.createResource(resourceData);
        console.log(`✅ Created resource: ${resourceData.displayName}`);
      } else {
        console.log(`🔄 Resource already exists: ${resourceData.displayName}`);
      }
    }

    // Seed actions
    for (const actionData of actions) {
      const existingAction = await storage.getActionByName(actionData.name);
      if (!existingAction) {
        await storage.createAction(actionData);
        console.log(`✅ Created action: ${actionData.displayName}`);
      } else {
        console.log(`🔄 Action already exists: ${actionData.displayName}`);
      }
    }

    // Seed agency options
    const agencyOptions = [
      {
        title: 'Violations',
        description: 'Manage traffic violations and citations',
        icon: 'FileText',
        url: '/admin/callViolations/{agencyCode}',
        sortOrder: 1,
        isActive: true
      },
      {
        title: 'Dispatch Call Types',
        description: 'Configure emergency and non-emergency call types',
        icon: 'BookOpen',
        url: '/agency-options/callTypes/{agencyCode}',
        sortOrder: 2,
        isActive: true
      },
      {
        title: 'Call Category',
        description: 'Organize calls by category and priority',
        icon: 'Users',
        url: '/agency-options/callCategory/{agencyCode}',
        sortOrder: 3,
        isActive: true
      },
      {
        title: 'Call Response',
        description: 'Configure response protocols and procedures',
        icon: 'Phone',
        url: '/agency-options/callResponse/{agencyCode}',
        sortOrder: 4,
        isActive: true
      }
    ];

    // Check if agency options already exist
    const existingOptions = await storage.getAgencyOptions();
    if (existingOptions.length === 0) {
      for (const option of agencyOptions) {
        await storage.createAgencyOption(option);
        console.log(`✅ Created agency option: ${option.title}`);
      }
    } else {
      console.log(`🔄 Agency options already exist (${existingOptions.length} options)`);
    }

    console.log('🎉 Master collections seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding master collections:', error);
    throw error;
  }
}