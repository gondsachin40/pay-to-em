import express from 'express'
import type { Request , Response } from "express";
import { prisma } from "./lib/prisma";

const app = express();
const PORT = 8080;

app.use(express.json());


app.get("/", (req : Request, res : Response) => {

    res.send("API working 🚀");
});


app.post("/adduser", (req : Request, res : Response) => {
    const data = req.body;
    console.log(data);
    res.send("API working 🚀");
});

app.post("/user-with-post", async (req, res) => {
  try {
    const { name, email, title, content } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        posts: {
          create: {
            title,
            content,
            published: false,
          },
        },
      },
      include: {
        posts: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});


async function start() {
    try {
        await prisma.$connect();
        console.log("Database connected ✅");

        app.listen(PORT, () => {
            console.log(`Listening on ${PORT} 🚀`);
        });

    } catch (err) {
        console.error("DB connection failed ❌", err);
        process.exit(1);
    }
}

start();