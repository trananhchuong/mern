// import express from "express";
// import cors from "cors";
// import posts from "./routers/posts.js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// import { Server } from "socket.io";
// import http from "http";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const URI = process.env.DATABASE_URL;

// app.use(cors());
// app.use(express.json({ limit: "30mb" }));
// app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// app.use("/posts", posts);

// // // setup socket
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origins: ["http://localhost:3000"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("🚀 ~ file: index.js ~ line 36 ~ io.on ~ socket", socket);
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// mongoose
//   .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Connected to DB");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:3000"],
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

let listUserName = [];
let listMessage = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("client-regis-username", (userName) => {
    const checkUserNameIsExits = listUserName.find(
      (user) => user.userName === userName
    );

    if (checkUserNameIsExits) {
      socket.emit("server-send-client-register-fail");
    } else {
      listUserName.push({
        id: socket.id,
        userName: userName,
      });
      socket.emit("server-send-client-register-success", userName);
      io.sockets.emit("server-send-list-user", listUserName);
      socket.userName = userName;
    }
  });

  socket.on("client-send-message", (valuePost) => {
    const newMessage = {
      ...valuePost,
      id: socket.id,
    };

    listMessage.push(newMessage);

    io.sockets.emit("server-send-list-message", listMessage);
  });
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
