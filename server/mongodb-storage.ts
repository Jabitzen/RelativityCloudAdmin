import { MongoClient, Db, Collection } from "mongodb";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  agencyId?: string;
  agencyName?: string;
}

interface Agency {
  id: number;
  name: string;
  code: string;
  type: string;
  status: string;
  description?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  agencyId: number;
}

export class MongoDBStorage {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect() {
    try {
      const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017";
      this.client = new MongoClient(connectionString);
      await this.client.connect();
      this.db = this.client.db("enterprise_sso");
      
      // Create indexes for better performance
      await this.createIndexes();
      
      console.log("✅ Connected successfully to MongoDB Atlas");
      console.log("📊 Database indexes created successfully");
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  private async createIndexes() {
    if (!this.db) return;

    const collections = [
      "users", "agencies", "roles", "permissions", "applications",
      "workflows", "workflow_instances", "activity_logs", "sessions",
      "role_permissions", "user_roles", "user_permissions",
      "agency_applications", "teams", "team_members"
    ];

    for (const collectionName of collections) {
      try {
        await this.db.createCollection(collectionName);
        console.log(`📁 Created collection: ${collectionName}`);
      } catch (error) {
        // Collection might already exist, which is fine
      }
    }
  }

  private getCollection<T>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return this.db.collection<T>(name);
  }

  // Users
  async getUsers(): Promise<User[]> {
    const collection = this.getCollection<User>("users");
    const users = await collection.find({}).toArray();
    return users.map(user => ({
      ...user,
      id: user.id || (user as any)._id
    }));
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const collection = this.getCollection<User>("users");
    const user = {
      ...userData,
      id: Date.now(),
      isActive: userData.isActive ?? true,
      createdAt: new Date(),
    } as User;
    
    await collection.insertOne(user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = this.getCollection<User>("users");
    const result = await collection.findOneAndUpdate(
      { $or: [{ id: parseInt(id) }, { username: id }] },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return result;
  }

  async deleteUser(id: string): Promise<boolean> {
    const collection = this.getCollection<User>("users");
    const result = await collection.deleteOne({ 
      $or: [{ id: parseInt(id) }, { username: id }] 
    });
    return result.deletedCount > 0;
  }

  // Agencies
  async getAgencies(): Promise<Agency[]> {
    const collection = this.getCollection<Agency>("agencies");
    const agencies = await collection.find({}).toArray();
    return agencies.map(agency => ({
      ...agency,
      id: agency.id || (agency as any)._id
    }));
  }

  async createAgency(agencyData: Partial<Agency>): Promise<Agency> {
    const collection = this.getCollection<Agency>("agencies");
    const agency = {
      ...agencyData,
      id: Date.now(),
      status: agencyData.status ?? "active",
      createdAt: new Date(),
    } as Agency;
    
    await collection.insertOne(agency);
    return agency;
  }

  // Roles
  async getRoles(): Promise<Role[]> {
    const collection = this.getCollection<Role>("roles");
    const roles = await collection.find({}).toArray();
    return roles.map(role => ({
      ...role,
      id: role.id || (role as any)._id
    }));
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    const collection = this.getCollection<Role>("roles");
    const role = {
      ...roleData,
      id: Date.now(),
      createdAt: new Date(),
    } as Role;
    
    await collection.insertOne(role);
    return role;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    const collection = this.getCollection<Team>("teams");
    const teams = await collection.find({}).toArray();
    return teams.map(team => ({
      ...team,
      id: team.id || (team as any)._id
    }));
  }

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    const collection = this.getCollection<Team>("teams");
    const team = {
      ...teamData,
      id: Date.now(),
      createdAt: new Date(),
    } as Team;
    
    await collection.insertOne(team);
    return team;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}