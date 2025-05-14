import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";

import { JWT_SECRET } from "@repo/backend-common/config";
import { client } from "@repo/db/client";
import {
  CreateUSerSchema,
  SigninSchema,
  CreateRoomSchema,
  CreateElementSchema,
  UpdateElementSchema,
  UpdateSessionSchema,
} from "@repo/common/types";
import { AuthenticatedRequest, middleware } from "./middleware";

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

//@ts-ignore
app.post("/signup", async (req, res) => {
  const parsed = CreateUSerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const { email, password, name, username } = parsed.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.user.create({
      data: { email, password: hashedPassword, name, username },
    });
    res.json({ message: "User signed up" });
  } catch (e) {
    res.status(409).json({ message: "Email already registered" });
  }
});
//@ts-ignore
app.post("/login", async (req, res) => {
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const { email, password } = parsed.data;
  const user = await client.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 86400000 });
  res.json({ token });
});
//@ts-ignore
app.post("/document", middleware, async (req: AuthenticatedRequest, res) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const { roomName } = parsed.data;
  const existing = await client.document.findUnique({
    where: { slug: roomName },
  });

  if (existing) return res.status(409).json({ message: "Document exists" });

  const doc = await client.document.create({
    data: { title: roomName, slug: roomName, createdBy: Number(req.userId) },
  });

  res.json({ documentId: doc.id });
});

app.get("/documents", middleware, async (req: AuthenticatedRequest, res) => {
  const docs = await client.document.findMany({ where: { createdBy: Number(req.userId)} });
  res.json({ documents: docs });
});
//@ts-ignore
app.get("/document/:slug", middleware, async (req, res) => {
  const { slug } = req.params;
  const document = await client.document.findUnique({
    where: { slug },
    include: { elements: true },
  });

  if (!document) return res.status(404).json({ message: "Not found" });
  res.json({ document });
});

app.get("/elements/:documentId", middleware, async (req, res) => {
  const elements = await client.element.findMany({
    where: { documentId: Number(req.params.documentId) },
    orderBy: { id: "asc" },
  });
  res.json({ elements });
});
//@ts-ignore
app.post("/element", middleware, async (req, res) => {
  const parsed = CreateElementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const element = await client.element.create({ data: parsed.data });
  res.json({ element });
});
//@ts-ignore
app.put("/element/:id", middleware, async (req, res) => {
  const parsed = UpdateElementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const updated = await client.element.update({
    where: { id: Number(req.params.id) },
    data: parsed.data,
  });
  res.json({ updated });
});
//@ts-ignore
app.delete("/element", middleware, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ message: "Invalid IDs" });

  await client.element.deleteMany({ where: { id: { in: ids } } });
  res.json({ message: "Deleted" });
});
//@ts-ignore
app.post("/session/update", middleware, async (req:AuthenticatedRequest, res) => {
  const parsed = UpdateSessionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const { documentId, cursorX, cursorY, selectedElementIds } = parsed.data;
  const session = await client.userSession.upsert({
    where: {
      userId_documentId: {
        userId: Number(req.userId),
        documentId,
      },
    },
    update: {
      cursorX,
      cursorY,
      selectedElementIds,
      lastActiveAt: new Date(),
    },
    create: {
      userId: Number(req.userId),
      documentId,
      cursorX,
      cursorY,
      selectedElementIds,
    },
  });

  res.json({ session });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));