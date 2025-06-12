import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizations / agencies table
export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(),
  parentAgencyId: integer("parent_agency_id"), // Self-referencing foreign key
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  logo: text("logo"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  // Geographic coordinates
  latitude: text("latitude"),
  longitude: text("longitude"),
});

// Base user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorSecret: text("two_factor_secret"),
  supervisorId: integer("supervisor_id"),
  agencyId: integer("agency_id"),
  preferredLanguage: text("preferred_language").default("en"),
  preferences: json("preferences").$type<{
    theme: {
      name: string;
      style: "mongo" | "palantir" | "custom";
      mode: "light" | "dark";
      customColors?: Record<string, string>;
    };
    accessibility: {
      highContrast: boolean;
      fontSize: "small" | "medium" | "large" | "x-large";
      reduceMotion: boolean;
    };
    notifications: boolean;
  } | null>().default({ 
    theme: { 
      name: "mongo-light", 
      style: "mongo", 
      mode: "light" 
    }, 
    accessibility: {
      highContrast: false,
      fontSize: "medium",
      reduceMotion: false
    },
    notifications: true 
  }),
});

// After table definitions are complete, set up the references
// This avoids the circular reference issues
export const setupReferences = () => {
  // Using relations is the preferred approach in drizzle-orm
  // Foreign key constraints will be handled by the database
};

// Roles table for RBAC
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  agencyId: integer("agency_id"),
});

// Resources table - defines what resources exist in the system
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "users", "workflows", "agencies"
  displayName: text("display_name").notNull(), // e.g., "User Management", "Workflow Builder"
  description: text("description"),
  module: text("module"), // e.g., "core", "workflow", "billing"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Actions table - defines what actions can be performed
export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "create", "read", "update", "delete", "approve", "reject"
  displayName: text("display_name").notNull(), // e.g., "Create", "View", "Edit", "Delete", "Approve", "Reject"
  description: text("description"),
  category: text("category"), // e.g., "crud", "workflow", "admin"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Resource-Action combinations - defines valid permission combinations
export const resourceActions = pgTable("resource_actions", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull(),
  actionId: integer("action_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Permissions table - now references valid resource-action combinations
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  resourceActionId: integer("resource_action_id").notNull(), // References resource_actions table
  description: text("description"),
  // Additional permission-specific metadata can go here
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Role-Permission mapping table
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull(),
  permissionId: integer("permission_id").notNull(),
});

// User-Role mapping table
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  roleId: integer("role_id").notNull(),
});

// User-Permission mapping table for individual permission overrides
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  permissionId: integer("permission_id").notNull(),
  granted: boolean("granted").notNull().default(true),
});

// Workflows removed - simplified architecture focuses on core management features

// Applications/Services that can be integrated with this SSO
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  clientId: text("client_id").notNull().unique(),
  clientSecret: text("client_secret").notNull(),
  redirectUris: text("redirect_uris").array().notNull(),
  allowedScopes: text("allowed_scopes").array().notNull(),
  // Additional fields for UI
  url: text("url"),
  icon: text("icon"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  termsUrl: text("terms_url"),
  privacyUrl: text("privacy_url"),
  defaultPermissions: json("default_permissions").$type<{
    resource: string;
    action: string;
  }[]>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Agency-Application mapping for licensing
export const agencyApplications = pgTable("agency_applications", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull(),
  applicationId: integer("application_id").notNull(),
  licenseKey: text("license_key"),
  seats: integer("seats").notNull().default(1),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
});

// Persons table for agency-level person management
export const persons = pgTable("persons", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country"),
  dateOfBirth: timestamp("date_of_birth"),
  ssn: text("ssn"), // Social Security Number or equivalent ID
  nationality: text("nationality"),
  occupation: text("occupation"),
  employer: text("employer"),
  emergencyContact: json("emergency_contact").$type<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }>(),
  notes: text("notes"),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("active"), // active, inactive, archived
  agencyId: text("agency_id").notNull(), // References the agency this person belongs to
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: integer("updated_by"),
  isActive: boolean("is_active").notNull().default(true),
});

// Teams table for team management
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  teamLead: integer("team_lead"),
  reportingManagers: json("reporting_managers").$type<number[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: integer("updated_by"),
  isActive: boolean("is_active").notNull().default(true),
});

// Team members junction table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("member"), // member, manager, team_lead
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

// Activity logs for audit trail
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: integer("resource_id"),
  details: json("details").$type<Record<string, any>>().notNull().default({}),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Billing records removed - simplified architecture focuses on core management features

// Removed unused schemas: masterAddresses, violations, agencyOptions
// Focus maintained on core management features: Users, Agencies, Roles & Permissions, Teams

// Set up all references after the tables are defined
export const setupAllReferences = () => {
  // Using relations is the preferred approach in drizzle-orm
  // Foreign key constraints will be handled by the database
  setupReferences();
};

// Schema definitions for validation
export const insertUserSchema = createInsertSchema(users, {
  password: z.string().min(6),
  email: z.string().email(),
}).omit({ id: true, preferences: true });

export const insertAgencySchema = createInsertSchema(agencies, {
  parentAgencyId: z.string().optional().nullable(),
}).omit({ id: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });
export const insertActionSchema = createInsertSchema(actions).omit({ id: true, createdAt: true });
export const insertResourceActionSchema = createInsertSchema(resourceActions).omit({ id: true, createdAt: true });
export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true, createdAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true });
export const insertTeamSchema = createInsertSchema(teams, {
  teamLead: z.number().int().positive().max(2147483647).optional().nullable(),
  reportingManagers: z.array(z.number().int().positive().max(2147483647)).optional().nullable(),
  createdBy: z.number().int().positive().max(2147483647).optional().nullable(),
  updatedBy: z.number().int().positive().max(2147483647).optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, joinedAt: true });

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type InsertAction = z.infer<typeof insertActionSchema>;
export type InsertResourceAction = z.infer<typeof insertResourceActionSchema>;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type User = typeof users.$inferSelect;
export type Agency = typeof agencies.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Action = typeof actions.$inferSelect;
export type ResourceAction = typeof resourceActions.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Extended type for login response
export interface LoginResponse extends Omit<User, "password" | "twoFactorSecret"> {
  twoFactorRequired?: boolean;
}

// Extended application form data for UI
export interface ApplicationFormData {
  name: string;
  description?: string;
  websiteUrl?: string;
  icon?: string;
  isActive: boolean;
}

// Schema for login form data
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginData = z.infer<typeof loginSchema>;

// Schema for two-factor authentication
export const twoFactorSchema = z.object({
  token: z.string().min(6).max(6),
  username: z.string().optional(),
});
export type TwoFactorData = z.infer<typeof twoFactorSchema>;