import { Store } from 'express-session';
import { User, InsertUser, Agency, InsertAgency, Role, InsertRole, Permission, InsertPermission, Workflow, InsertWorkflow, WorkflowInstance, InsertWorkflowInstance, Application, InsertApplication, ActivityLog, Person, InsertPerson } from '@shared/schema';
export interface IStorage {
    sessionStore: Store;
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    getUsers(): Promise<User[]>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: number, data: Partial<User>): Promise<User>;
    getUserCount(): Promise<number>;
    getAgency(id: number): Promise<Agency | undefined>;
    getAgencies(): Promise<Agency[]>;
    createAgency(agency: InsertAgency): Promise<Agency>;
    getRole(id: number): Promise<Role | undefined>;
    getRoles(): Promise<Role[]>;
    createRole(role: InsertRole): Promise<Role>;
    getPermission(id: number): Promise<Permission | undefined>;
    getPermissions(): Promise<Permission[]>;
    createPermission(permission: InsertPermission): Promise<Permission>;
    assignPermissionToRole(roleId: number, permissionId: number): Promise<{
        id: number;
        roleId: number;
        permissionId: number;
    }>;
    removePermissionFromRole(roleId: number, permissionId: number): Promise<void>;
    getRolePermissions(roleId: number): Promise<Permission[]>;
    assignRoleToUser(userId: number, roleId: number): Promise<{
        id: number;
        userId: number;
        roleId: number;
    }>;
    removeRoleFromUser(userId: number, roleId: number): Promise<void>;
    getUserRoles(userId: number): Promise<Role[]>;
    setUserPermission(userId: number, permissionId: number, granted: boolean): Promise<{
        id: number;
        userId: number;
        permissionId: number;
        granted: boolean;
    }>;
    removeUserPermission(userId: number, permissionId: number): Promise<void>;
    getUserPermissions(userId: number): Promise<{
        permission: Permission;
        granted: boolean;
    }[]>;
    userHasPermission(userId: number, resource: string, action: string): Promise<boolean>;
    getWorkflow(id: number): Promise<Workflow | undefined>;
    getWorkflows(): Promise<Workflow[]>;
    createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
    getWorkflowInstance(id: number): Promise<WorkflowInstance | undefined>;
    getWorkflowInstances(status?: string): Promise<WorkflowInstance[]>;
    createWorkflowInstance(instance: InsertWorkflowInstance): Promise<WorkflowInstance>;
    approveWorkflowStep(instanceId: number, approverId: number, comment?: string): Promise<WorkflowInstance>;
    rejectWorkflowStep(instanceId: number, approverId: number, comment?: string): Promise<WorkflowInstance>;
    getPendingWorkflowCount(): Promise<number>;
    getPendingWorkflowInstances(limit?: number): Promise<WorkflowInstance[]>;
    getApplication(id: number): Promise<Application | undefined>;
    getApplications(): Promise<Application[]>;
    createApplication(application: InsertApplication): Promise<Application>;
    assignApplicationToAgency(applicationId: number, agencyId: number, expiresAt?: Date): Promise<{
        id: number;
        applicationId: number;
        agencyId: number;
        assignedAt: Date;
        expiresAt: Date | null;
    }>;
    getActiveApplicationCount(): Promise<number>;
    getLicenseUsagePercentage(): Promise<number>;
    getConnectedApplications(): Promise<any[]>;
    createActivityLog(log: Partial<ActivityLog>): Promise<ActivityLog>;
    getActivityLogs(limit?: number): Promise<ActivityLog[]>;
    getRecentActivityLogs(limit?: number): Promise<ActivityLog[]>;
    getPersons(agencyId: string): Promise<Person[]>;
    getPerson(id: number, agencyId: string): Promise<Person | undefined>;
    createPerson(person: InsertPerson): Promise<Person>;
    updatePerson(id: number, data: Partial<Person>, agencyId: string): Promise<Person>;
    deletePerson(id: number, agencyId: string): Promise<void>;
    searchPersons(query: string, agencyId: string): Promise<Person[]>;
}
//# sourceMappingURL=storage-interface.d.ts.map