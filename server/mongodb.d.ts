import { MongoClient, Db, Collection } from 'mongodb';
export declare function connectToDatabase(): Promise<Db>;
export declare function closeDatabaseConnection(): Promise<void>;
export declare function getClient(): MongoClient;
export declare function getDatabase(): Db;
export declare function getCollection(name: string): Collection;
export declare function pingDatabase(): Promise<boolean>;
export declare function generateId(): string;
//# sourceMappingURL=mongodb.d.ts.map