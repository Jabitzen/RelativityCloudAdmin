import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./mongodb-storage";

export async function registerApiRoutes(app: Express): Promise<Server> {
  // Teams routes
  app.get("/api/teams", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      next(error);
    }
  });

  // User routes
  app.get("/api/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await storage.getUsersWithAgencies();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      next(error);
    }
  });

  // Agency routes
  app.get("/api/agencies", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const agencies = await storage.getAgencies();
      res.json(agencies);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      next(error);
    }
  });

  // Role routes
  app.get("/api/roles", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      next(error);
    }
  });

  // Permission routes
  app.get("/api/permissions", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = await storage.getPermissions();
      res.json(permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      next(error);
    }
  });

  // Resource routes
  app.get("/api/resources", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      next(error);
    }
  });

  // Action routes
  app.get("/api/actions", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actions = await storage.getActions();
      res.json(actions);
    } catch (error) {
      console.error('Error fetching actions:', error);
      next(error);
    }
  });

  // Role permissions routes
  app.get("/api/roles/:roleId/permissions", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = parseInt(req.params.roleId);
      if (isNaN(roleId)) {
        return res.status(400).json({ error: "Invalid role ID" });
      }
      
      // For now, return empty array since role permissions functionality needs to be implemented
      res.json([]);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      next(error);
    }
  });

  // POST routes for creating new entities
  app.post("/api/roles", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For now, return a mock response since create functionality needs to be implemented
      res.status(501).json({ error: "Create role functionality not yet implemented" });
    } catch (error) {
      console.error('Error creating role:', error);
      next(error);
    }
  });

  app.post("/api/permissions", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For now, return a mock response since create functionality needs to be implemented
      res.status(501).json({ error: "Create permission functionality not yet implemented" });
    } catch (error) {
      console.error('Error creating permission:', error);
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}