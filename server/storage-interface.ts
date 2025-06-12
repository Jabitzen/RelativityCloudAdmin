import { Store } from 'express-session';
import {
  User, InsertUser, Agency, InsertAgency, Role, InsertRole,
  Permission, InsertPermission, Application, InsertApplication,
  ActivityLog, Team, InsertTeam
} from '@shared/schema';

export interface IStorage {
  sessionStore: Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUsersWithAgencies(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Agency methods
  getAgency(id: string): Promise<Agency | undefined>;
  getAgencies(): Promise<Agency[]>;
  createAgency(agency: InsertAgency): Promise<Agency>;
  updateAgency(id: string, data: Partial<InsertAgency>): Promise<Agency | undefined>;
  deleteAgency(id: string): Promise<boolean>;

  // Role methods
  getRole(id: number): Promise<Role | undefined>;
  getRoles(): Promise<Role[]>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, data: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;

  // Permission methods
  getPermission(id: number): Promise<Permission | undefined>;
  getPermissions(): Promise<Permission[]>;
  createPermission(permission: InsertPermission): Promise<Permission>;

  // Team methods
  getTeam(id: number): Promise<Team | undefined>;
  getTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, data: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;

  // Application methods
  getApplication(id: number): Promise<Application | undefined>;
  getApplications(): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;

  // Activity log methods
  createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<void>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
}