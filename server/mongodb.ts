import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB Connection URI from environment variable
const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb+srv://RPSWeb:MCmF9YPg07yxooiN@relativityatlas.azgjfgu.mongodb.net/?retryWrites=true&w=majority';
const dbName = process.env.DB_NAME || 'RPSWeb_NeW';

// MongoDB Client Options - adjusted for TLS compatibility
const options = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 3,
  retryWrites: true,
  authSource: 'admin',
  tlsInsecure: true
};

// Create a MongoDB client instance
const client = new MongoClient(uri, options);
let db: Db | null = null;

// Database connection function
export async function connectToDatabase(): Promise<Db> {
  try {
    if (!db) {
      // Connect to the MongoDB server
      await client.connect();
      console.log('✅ Connected successfully to MongoDB Atlas');
      
      // Get database instance
      db = client.db(dbName);
      
      // Initialize collections and indexes
      await initializeCollections();
    }
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Initialize collections and create indexes
async function initializeCollections(): Promise<void> {
  try {
    const collections = [
      'users', 'agencies', 'roles', 'permissions', 'applications', 
      'workflows', 'workflow_instances', 'activity_logs', 'sessions',
      'role_permissions', 'user_roles', 'user_permissions', 'agency_applications',
      'teams', 'team_members'
    ];
    
    for (const collectionName of collections) {
      try {
        await db!.createCollection(collectionName);
        console.log(`📁 Created collection: ${collectionName}`);
      } catch (error: any) {
        if (error.code !== 48) { // Collection already exists
          console.log(`📁 Collection ${collectionName} already exists`);
        }
      }
    }

    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// Create database indexes
async function createIndexes(): Promise<void> {
  try {
    if (!db) return;
    
    // Users indexes
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Applications indexes
    await db.collection('applications').createIndex({ clientId: 1 }, { unique: true });
    await db.collection('applications').createIndex({ name: 1 });
    
    // Workflows indexes
    await db.collection('workflows').createIndex({ name: 1 });
    await db.collection('workflow_instances').createIndex({ workflowId: 1 });
    await db.collection('workflow_instances').createIndex({ userId: 1 });
    await db.collection('workflow_instances').createIndex({ status: 1 });
    await db.collection('workflow_instances').createIndex({ createdAt: -1 });
    
    // Activity logs indexes
    await db.collection('activity_logs').createIndex({ createdAt: -1 });
    await db.collection('activity_logs').createIndex({ userId: 1 });
    
    // Sessions index with TTL (skip if already exists)
    try {
      await db.collection('sessions').createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    } catch (error: any) {
      if (error.code !== 85) { // Not an IndexOptionsConflict
        throw error;
      }
      console.log('📊 Sessions TTL index already exists');
    }
    
    // Role and permission indexes
    await db.collection('roles').createIndex({ name: 1 }, { unique: true });
    await db.collection('permissions').createIndex({ resource: 1, action: 1 }, { unique: true });
    
    // Teams indexes
    await db.collection('teams').createIndex({ name: 1 });
    await db.collection('teams').createIndex({ agencyId: 1 });
    await db.collection('team_members').createIndex({ teamId: 1, userId: 1 }, { unique: true });
    await db.collection('team_members').createIndex({ userId: 1 });
    
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Close database connection
export async function closeDatabaseConnection(): Promise<void> {
  try {
    if (client) {
      await client.close();
      db = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Get the MongoDB client instance
export function getClient(): MongoClient {
  return client;
}

// Get the database instance
export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

// Get a specific collection
export function getCollection(name: string): Collection {
  return getDatabase().collection(name);
}

// Check if the database connection is alive
export async function pingDatabase(): Promise<boolean> {
  try {
    if (!db) {
      await connectToDatabase();
    }
    await client.db().admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB ping failed:', error);
    return false;
  }
}

// Generate a new ID that stays within integer limits
export function generateId(): string {
  // Use a simple counter-based approach to ensure small IDs
  const timestamp = Math.floor(Date.now() / 100000) % 1000; // Very small timestamp component
  const random = Math.floor(Math.random() * 10); // Tiny random component
  return (timestamp * 10 + random).toString();
}