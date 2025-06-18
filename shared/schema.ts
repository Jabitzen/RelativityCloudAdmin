import { pgTable, serial, varchar, boolean, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  agencyId: integer('agency_id'),
});

// Agencies table
export const agencies = pgTable('agencies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: text('status').default('active').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Roles table
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

// Teams table
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  agencyId: integer('agency_id').notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Agency = typeof agencies.$inferSelect;
export type NewAgency = typeof agencies.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertAgencySchema = createInsertSchema(agencies);
export const insertRoleSchema = createInsertSchema(roles);
export const insertTeamSchema = createInsertSchema(teams);