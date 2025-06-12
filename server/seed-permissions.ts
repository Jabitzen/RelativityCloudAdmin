import { storage } from "./storage";
import { 
  InsertResource, 
  InsertAction, 
  InsertResourceAction 
} from "@shared/schema";

// System Resources - Define what resources exist in your application
const SYSTEM_RESOURCES: InsertResource[] = [
  {
    name: "dashboard",
    displayName: "Dashboard",
    description: "Main dashboard and analytics",
    module: "core",
    isActive: true
  },
  {
    name: "users",
    displayName: "User Management",
    description: "User accounts and profiles",
    module: "core",
    isActive: true
  },
  {
    name: "agencies",
    displayName: "Agency Management",
    description: "Organization and agency management",
    module: "core",
    isActive: true
  },
  {
    name: "roles",
    displayName: "Role Management",
    description: "User roles and hierarchies",
    module: "core",
    isActive: true
  },
  {
    name: "permissions",
    displayName: "Permission Management",
    description: "Access control and permissions",
    module: "core",
    isActive: true
  },
  {
    name: "workflows",
    displayName: "Workflow Builder",
    description: "Business process workflows",
    module: "workflow",
    isActive: true
  },
  {
    name: "applications",
    displayName: "Application Management",
    description: "Connected applications and integrations",
    module: "core",
    isActive: true
  },
  {
    name: "billing",
    displayName: "Billing & Licensing",
    description: "License management and billing",
    module: "billing",
    isActive: true
  },
  {
    name: "settings",
    displayName: "System Settings",
    description: "System configuration and preferences",
    module: "core",
    isActive: true
  },
  {
    name: "activity",
    displayName: "Activity Logs",
    description: "System activity and audit logs",
    module: "core",
    isActive: true
  }
];

// System Actions - Define what actions can be performed
const SYSTEM_ACTIONS: InsertAction[] = [
  // CRUD Operations
  {
    name: "create",
    displayName: "Create",
    description: "Create new records",
    category: "crud",
    isActive: true
  },
  {
    name: "read",
    displayName: "View",
    description: "View and read records",
    category: "crud",
    isActive: true
  },
  {
    name: "update",
    displayName: "Edit",
    description: "Update existing records",
    category: "crud",
    isActive: true
  },
  {
    name: "delete",
    displayName: "Delete",
    description: "Delete records",
    category: "crud",
    isActive: true
  },
  
  // Workflow Actions
  {
    name: "approve",
    displayName: "Approve",
    description: "Approve workflow requests or documents",
    category: "workflow",
    isActive: true
  },
  {
    name: "reject",
    displayName: "Reject",
    description: "Reject workflow requests or documents",
    category: "workflow",
    isActive: true
  },
  {
    name: "submit",
    displayName: "Submit",
    description: "Submit for approval",
    category: "workflow",
    isActive: true
  },
  {
    name: "review",
    displayName: "Review",
    description: "Review submissions or documents",
    category: "workflow",
    isActive: true
  },
  
  // Administrative Actions
  {
    name: "manage",
    displayName: "Manage",
    description: "Full administrative access",
    category: "admin",
    isActive: true
  },
  {
    name: "configure",
    displayName: "Configure",
    description: "Configure system settings",
    category: "admin",
    isActive: true
  },
  {
    name: "assign",
    displayName: "Assign",
    description: "Assign roles or permissions",
    category: "admin",
    isActive: true
  },
  
  // Specialized Actions
  {
    name: "export",
    displayName: "Export",
    description: "Export data or reports",
    category: "data",
    isActive: true
  },
  {
    name: "import",
    displayName: "Import",
    description: "Import data or configurations",
    category: "data",
    isActive: true
  }
];

// Valid Resource-Action Combinations - Define what actions are valid for each resource
const VALID_RESOURCE_ACTIONS = [
  // Dashboard
  { resource: "dashboard", action: "read" },
  
  // Users
  { resource: "users", action: "create" },
  { resource: "users", action: "read" },
  { resource: "users", action: "update" },
  { resource: "users", action: "delete" },
  { resource: "users", action: "manage" },
  
  // Agencies
  { resource: "agencies", action: "create" },
  { resource: "agencies", action: "read" },
  { resource: "agencies", action: "update" },
  { resource: "agencies", action: "delete" },
  { resource: "agencies", action: "manage" },
  
  // Roles
  { resource: "roles", action: "create" },
  { resource: "roles", action: "read" },
  { resource: "roles", action: "update" },
  { resource: "roles", action: "delete" },
  { resource: "roles", action: "assign" },
  
  // Permissions
  { resource: "permissions", action: "read" },
  { resource: "permissions", action: "assign" },
  { resource: "permissions", action: "manage" },
  
  // Workflows
  { resource: "workflows", action: "create" },
  { resource: "workflows", action: "read" },
  { resource: "workflows", action: "update" },
  { resource: "workflows", action: "delete" },
  { resource: "workflows", action: "submit" },
  { resource: "workflows", action: "approve" },
  { resource: "workflows", action: "reject" },
  { resource: "workflows", action: "review" },
  
  // Applications
  { resource: "applications", action: "create" },
  { resource: "applications", action: "read" },
  { resource: "applications", action: "update" },
  { resource: "applications", action: "delete" },
  { resource: "applications", action: "manage" },
  
  // Billing
  { resource: "billing", action: "read" },
  { resource: "billing", action: "manage" },
  { resource: "billing", action: "configure" },
  
  // Settings
  { resource: "settings", action: "read" },
  { resource: "settings", action: "update" },
  { resource: "settings", action: "configure" },
  
  // Activity
  { resource: "activity", action: "read" },
  { resource: "activity", action: "export" }
];

export async function seedPermissionSystem(): Promise<void> {
  console.log("🔒 Seeding permission system...");
  
  try {
    // 1. Seed Resources
    console.log("📋 Creating system resources...");
    const resourceMap = new Map<string, any>();
    
    for (const resource of SYSTEM_RESOURCES) {
      try {
        const createdResource = await storage.createResource(resource);
        resourceMap.set(resource.name, createdResource);
        console.log(`✅ Resource: ${resource.displayName}`);
      } catch (error) {
        console.log(`⚠️  Resource ${resource.displayName} already exists`);
        // Fetch existing resource
        const existing = await storage.getResourceByName(resource.name);
        if (existing) {
          resourceMap.set(resource.name, existing);
        }
      }
    }
    
    // 2. Seed Actions
    console.log("⚡ Creating system actions...");
    const actionMap = new Map<string, any>();
    
    for (const action of SYSTEM_ACTIONS) {
      try {
        const createdAction = await storage.createAction(action);
        actionMap.set(action.name, createdAction);
        console.log(`✅ Action: ${action.displayName}`);
      } catch (error) {
        console.log(`⚠️  Action ${action.displayName} already exists`);
        // Fetch existing action
        const existing = await storage.getActionByName(action.name);
        if (existing) {
          actionMap.set(action.name, existing);
        }
      }
    }
    
    // 3. Create Valid Resource-Action Combinations
    console.log("🔗 Creating valid resource-action combinations...");
    
    for (const combo of VALID_RESOURCE_ACTIONS) {
      const resource = resourceMap.get(combo.resource);
      const action = actionMap.get(combo.action);
      
      if (resource && action) {
        try {
          await storage.createResourceAction({
            resourceId: resource.id,
            actionId: action.id,
            isActive: true
          });
          console.log(`✅ ${combo.resource}:${combo.action}`);
        } catch (error) {
          console.log(`⚠️  ${combo.resource}:${combo.action} already exists`);
        }
      }
    }
    
    console.log("🎉 Permission system seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding permission system:", error);
    throw error;
  }
}