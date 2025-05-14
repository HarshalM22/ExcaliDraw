import { z } from "zod";

// User schema for signup
export const CreateUSerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  username: z.string().min(1),
});

// User schema for login
export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Document schema for room creation
export const CreateRoomSchema = z.object({
  roomName: z.string().min(3),
});

// Element creation schema
export const CreateElementSchema = z.object({
  documentId: z.number(),
  type: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  strokeColor: z.string(),
  fillColor: z.string(),
});

// Element update schema
export const UpdateElementSchema = z.object({
  type: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  strokeColor: z.string().optional(),
  fillColor: z.string().optional(),
});

// Session update schema
export const UpdateSessionSchema = z.object({
  documentId: z.number(),
  cursorX: z.number(),
  cursorY: z.number(),
  selectedElementIds: z.array(z.number()),
});
