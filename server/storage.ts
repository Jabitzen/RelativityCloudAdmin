import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { users, agencies, roles, teams, type User, type Agency, type Role, type Team, type NewUser, type NewAgency, type NewRole, type NewTeam } from '@shared/schema';

export interface IStorage {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  // Users
  getUsers(): Promise<User[]>;
  createUser(userData: NewUser): Promise<User>;
  updateUser(id: number, updates: Partial<NewUser>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  
  // Agencies
  getAgencies(): Promise<Agency[]>;
  createAgency(agencyData: NewAgency): Promise<Agency>;
  
  // Roles
  getRoles(): Promise<Role[]>;
  createRole(roleData: NewRole): Promise<Role>;
  
  // Teams
  getTeams(): Promise<Team[]>;
  createTeam(teamData: NewTeam): Promise<Team>;
}

export class PostgreSQLStorage implements IStorage {
  private pool: Pool | null = null;
  private db: any = null;

  async connect(): Promise<void> {
    try {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      
      this.db = drizzle(this.pool);
      
      console.log("✅ Connected successfully to PostgreSQL");
    } catch (error) {
      console.error("❌ Failed to connect to PostgreSQL:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.db = null;
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    const result = await this.db.select().from(users);
    return result;
  }

  async createUser(userData: NewUser): Promise<User> {
    const [user] = await this.db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<NewUser>): Promise<User | null> {
    const [user] = await this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Agencies
  async getAgencies(): Promise<Agency[]> {
    const result = await this.db.select().from(agencies);
    return result;
  }

  async createAgency(agencyData: NewAgency): Promise<Agency> {
    const [agency] = await this.db.insert(agencies).values(agencyData).returning();
    return agency;
  }

  // Roles
  async getRoles(): Promise<Role[]> {
    const result = await this.db.select().from(roles);
    return result;
  }

  async createRole(roleData: NewRole): Promise<Role> {
    const [role] = await this.db.insert(roles).values(roleData).returning();
    return role;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    const result = await this.db.select().from(teams);
    return result;
  }

  async createTeam(teamData: NewTeam): Promise<Team> {
    const [team] = await this.db.insert(teams).values(teamData).returning();
    return team;
  }
}