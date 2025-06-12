import { ObjectId } from 'mongodb';
import { connectToDatabase, getCollection, generateId } from './mongodb';
import { IStorage } from './storage-interface';
import {
  User, InsertUser, Agency, InsertAgency, Role, InsertRole,
  Permission, InsertPermission, Application, InsertApplication,
  ActivityLog, Team, InsertTeam
} from '../shared/schema';
import session from 'express-session';
import createMemoryStore from 'memorystore';

const MemoryStore = createMemoryStore(session);

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      await connectToDatabase();
      const user = await getCollection('users').findOne({ id });
      return user ? (user as any) : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      await connectToDatabase();
      const user = await getCollection('users').findOne({ username });
      return user ? (user as any) : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      await connectToDatabase();
      const user = await getCollection('users').findOne({ email });
      return user ? (user as any) : undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      await connectToDatabase();
      const users = await getCollection('users').find({}).toArray();
      return users as any[];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getUsersWithAgencies(): Promise<User[]> {
    try {
      await connectToDatabase();
      const users = await getCollection('users').aggregate([
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyId',
            foreignField: 'id',
            as: 'agency'
          }
        },
        {
          $addFields: {
            agencyName: { $arrayElemAt: ['$agency.name', 0] }
          }
        },
        {
          $project: {
            password: 0,
            twoFactorSecret: 0,
            agency: 0
          }
        }
      ]).toArray();
      return users as any[];
    } catch (error) {
      console.error('Error getting users with agencies:', error);
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      await connectToDatabase();
      const newUser = {
        ...insertUser,
        id: parseInt(generateId()),
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: null
      };
      
      await getCollection('users').insertOne(newUser);
      return newUser as any;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      await connectToDatabase();
      const result = await getCollection('users').findOneAndUpdate(
        { id },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result ? (result as any) : undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await connectToDatabase();
      const result = await getCollection('users').deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Agency methods
  async getAgency(id: string): Promise<Agency | undefined> {
    try {
      await connectToDatabase();
      const agency = await getCollection('agencies').findOne({ id });
      return agency ? (agency as any) : undefined;
    } catch (error) {
      console.error('Error getting agency:', error);
      return undefined;
    }
  }

  async getAgencies(): Promise<Agency[]> {
    try {
      await connectToDatabase();
      const agencies = await getCollection('agencies').find({}).toArray();
      return agencies as any[];
    } catch (error) {
      console.error('Error getting agencies:', error);
      return [];
    }
  }

  async createAgency(insertAgency: InsertAgency): Promise<Agency> {
    try {
      await connectToDatabase();
      const newAgency = {
        ...insertAgency,
        id: generateId(),
        createdAt: new Date()
      };
      
      await getCollection('agencies').insertOne(newAgency);
      return newAgency as any;
    } catch (error) {
      console.error('Error creating agency:', error);
      throw error;
    }
  }

  async updateAgency(id: string, updateData: Partial<InsertAgency>): Promise<Agency | undefined> {
    try {
      await connectToDatabase();
      const result = await getCollection('agencies').findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      return result ? (result as any) : undefined;
    } catch (error) {
      console.error('Error updating agency:', error);
      return undefined;
    }
  }

  async deleteAgency(id: string): Promise<boolean> {
    try {
      await connectToDatabase();
      const result = await getCollection('agencies').deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting agency:', error);
      return false;
    }
  }

  // Role methods
  async getRole(id: number): Promise<Role | undefined> {
    try {
      await connectToDatabase();
      const role = await getCollection('roles').findOne({ id });
      return role ? (role as any) : undefined;
    } catch (error) {
      console.error('Error getting role:', error);
      return undefined;
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      await connectToDatabase();
      const roles = await getCollection('roles').find({}).toArray();
      return roles as any[];
    } catch (error) {
      console.error('Error getting roles:', error);
      return [];
    }
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    try {
      await connectToDatabase();
      const newRole = {
        ...insertRole,
        id: parseInt(generateId())
      };
      
      await getCollection('roles').insertOne(newRole);
      return newRole as any;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(id: number, updateData: Partial<InsertRole>): Promise<Role | undefined> {
    try {
      await connectToDatabase();
      const result = await getCollection('roles').findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      return result ? (result as any) : undefined;
    } catch (error) {
      console.error('Error updating role:', error);
      return undefined;
    }
  }

  async deleteRole(id: number): Promise<boolean> {
    try {
      await connectToDatabase();
      const result = await getCollection('roles').deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting role:', error);
      return false;
    }
  }

  // Permission methods
  async getPermission(id: number): Promise<Permission | undefined> {
    try {
      await connectToDatabase();
      const permission = await getCollection('permissions').findOne({ id });
      return permission ? (permission as any) : undefined;
    } catch (error) {
      console.error('Error getting permission:', error);
      return undefined;
    }
  }

  async getPermissions(): Promise<Permission[]> {
    try {
      await connectToDatabase();
      const permissions = await getCollection('permissions').find({}).toArray();
      return permissions as any[];
    } catch (error) {
      console.error('Error getting permissions:', error);
      return [];
    }
  }

  async createPermission(insertPermission: InsertPermission): Promise<Permission> {
    try {
      await connectToDatabase();
      const newPermission = {
        ...insertPermission,
        id: parseInt(generateId()),
        createdAt: new Date()
      };
      
      await getCollection('permissions').insertOne(newPermission);
      return newPermission as any;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  // Team methods
  async getTeam(id: number): Promise<Team | undefined> {
    try {
      await connectToDatabase();
      const team = await getCollection('teams').findOne({ id });
      return team ? (team as any) : undefined;
    } catch (error) {
      console.error('Error getting team:', error);
      return undefined;
    }
  }

  async getTeams(): Promise<Team[]> {
    try {
      await connectToDatabase();
      const teams = await getCollection('teams').find({}).toArray();
      return teams as any[];
    } catch (error) {
      console.error('Error getting teams:', error);
      return [];
    }
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    try {
      await connectToDatabase();
      const newTeam = {
        ...insertTeam,
        id: parseInt(generateId()),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await getCollection('teams').insertOne(newTeam);
      return newTeam as any;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async updateTeam(id: number, updateData: Partial<InsertTeam>): Promise<Team | undefined> {
    try {
      await connectToDatabase();
      const result = await getCollection('teams').findOneAndUpdate(
        { id },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result ? (result as any) : undefined;
    } catch (error) {
      console.error('Error updating team:', error);
      return undefined;
    }
  }

  async deleteTeam(id: number): Promise<boolean> {
    try {
      await connectToDatabase();
      const result = await getCollection('teams').deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }

  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    try {
      await connectToDatabase();
      const application = await getCollection('applications').findOne({ id });
      return application ? (application as any) : undefined;
    } catch (error) {
      console.error('Error getting application:', error);
      return undefined;
    }
  }

  async getApplications(): Promise<Application[]> {
    try {
      await connectToDatabase();
      const applications = await getCollection('applications').find({}).toArray();
      return applications as any[];
    } catch (error) {
      console.error('Error getting applications:', error);
      return [];
    }
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    try {
      await connectToDatabase();
      const newApplication = {
        ...insertApplication,
        id: parseInt(generateId())
      };
      
      await getCollection('applications').insertOne(newApplication);
      return newApplication as any;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  // Activity log methods
  async createActivityLog(activityLog: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<void> {
    try {
      await connectToDatabase();
      const newActivityLog = {
        ...activityLog,
        id: parseInt(generateId()),
        createdAt: new Date()
      };
      
      await getCollection('activity_logs').insertOne(newActivityLog);
    } catch (error) {
      console.error('Error creating activity log:', error);
    }
  }

  async getActivityLogs(limit?: number): Promise<ActivityLog[]> {
    try {
      await connectToDatabase();
      const query = getCollection('activity_logs').find({}).sort({ createdAt: -1 });
      if (limit) {
        query.limit(limit);
      }
      const logs = await query.toArray();
      return logs as any[];
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return [];
    }
  }
}

export const storage = new MongoDBStorage();