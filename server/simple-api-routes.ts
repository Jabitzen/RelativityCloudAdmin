import express from "express";
import { createServer } from "http";
import { PostgreSQLStorage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

const storage = new PostgreSQLStorage();

export async function registerApiRoutes(app: express.Express) {
  const server = createServer(app);

  // Initialize database connection
  await storage.connect();

  // Users API
  app.get("/api/users", async (_req: any, res: any) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req: any, res: any) => {
    try {
      const userSchema = insertUserSchema.omit({ id: true });
      const validatedData = userSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.put("/api/users/:id", async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const userSchema = insertUserSchema.omit({ id: true });
      const validatedData = userSchema.parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update user' });
      }
    }
  });

  // Agencies API
  app.get("/api/agencies", async (_req: any, res: any) => {
    try {
      const agencies = await storage.getAgencies();
      res.json(agencies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agencies" });
    }
  });

  app.post("/api/agencies", async (req: any, res: any) => {
    try {
      const agency = await storage.createAgency(req.body);
      res.status(201).json(agency);
    } catch (error) {
      res.status(500).json({ message: "Failed to create agency" });
    }
  });

  // Roles API
  app.get("/api/roles", async (_req: any, res: any) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post("/api/roles", async (req: any, res: any) => {
    try {
      const role = await storage.createRole(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  // Teams API
  app.get("/api/teams", async (_req: any, res: any) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", async (req: any, res: any) => {
    try {
      const team = await storage.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  return server;
}