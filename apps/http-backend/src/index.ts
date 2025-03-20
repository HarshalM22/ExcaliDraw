import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

import {
  CreateUSerSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { client } from "@repo/db/client";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthenticatedRequest, middleware } from "./middleware";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Allowed frontend origin
    credentials: true, // Allow cookies
  })
);
app.use(express.json());

app.post("/signup", async function (req, res) {
  const parsedData = CreateUSerSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }
  try {
    await client.user.create({
      data: {
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.name,
        username: parsedData.data.username,
      },
    });
    res.json({
      message: "user has been signed up",
    });
  } catch (e) {
    res.status(411).json({
      message: "email is already registered",
    });
  }
});

app.post("/login", async function (req, res) {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    const find = await client.user.findUnique({
      where: {
        email: parsedData.data.email,
        password: parsedData.data.password,
      },
    });

    if (!find) {
      res.status(403).json({
        message: "Not Authorized",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: find.id,
      },
      JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      token: token,
    });
  } catch (e) {
    res.json({
      message: e,
    });
  }
});

app.post("/room", middleware, async function (req, res) {
  const RoomData = CreateRoomSchema.safeParse(req.body);
  if (!RoomData || RoomData.data?.roomName == undefined || null) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  // @ts-ignore
  const userId = req.userId;
  try {
    const find = await client.room.findUnique({
      where: {
        adminId: userId,
        slug: RoomData.data.roomName,
      },
    });
    if (find) {
      res.status(411).json({
        message: "room already exists",
      });
    } else {
      const Room = await client.room.create({
        data: {
          slug: RoomData.data.roomName,
          adminId: userId,
        },
      });
      res.json({
        roomId: Room.id,
      });
    }
  } catch (e) {
    res.status(411).json({
      message: "Something Went wrong",
      e,
    });
  }
});

app.get("/room", middleware, async function (req: AuthenticatedRequest, res) {
  const userId = req.userId;
  const rooms = await client.room.findMany({
    where: {
      adminId: userId,
    },
  });

  res.json({
    rooms: rooms,
  });
});

app.get("/chats/:roomId",middleware, async function (req, res) {
  const roomId = Number(req.params.roomId);
  const messages = await client.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
  });

  res.json({
    messages,
  });
});

app.get("/getRoomId/:roomName",middleware,async function(req, res){
  const slug = req.params.roomName 
  const room = await client.room.findUnique({
    where: {
      slug: slug
    },
  });

  if (room === null || !room) {
   
     res.status(403).json({
      message: "room name is invalid",
    });
    return 
  }

  res.json({
    roomId: room.id
  });
  
});


app.delete("/eraseShape", middleware, async function (req, res) {
  const { ids } = req.body; // Get shape IDs from request
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Invalid shape IDs" });
  }

  try {
    const response = await client.chat.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    res.json({
      message: "done scene hai",
    });
  } catch (e) {
    res.status(500).json({
      message: "An error occurred",
      error: e,
    });
  }
});
app.listen(3001);
