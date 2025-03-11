import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUSerSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { client } from "@repo/db/client";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

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
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.username,
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

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
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

  res.cookie("token",token);

});

app.post("/room", middleware, async (req, res) => {
  const RoomData = CreateRoomSchema.safeParse(req.body);
  if (!RoomData || RoomData.data?.name == undefined || null) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  // @ts-ignore
  const userId = req.userId;
  console.log(userId);
  try {
    console.log("entered in ttry ");
    console.log(RoomData.data.name);
    const Room = await client.room.create({
     data : {
       slug: RoomData.data.name,
      adminId: userId,
     }
    });
    console.log(Room.id);
    res.json({
      roomId: Room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "room alreasy exists with this name",
      e,
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await client.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.json({
    messages,
  });
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await client.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});

app.listen(3001);
