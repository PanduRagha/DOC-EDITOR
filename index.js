const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Document = require("./models/Document");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/codtech", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"));

// Socket.io
io.on("connection", (socket) => {
  socket.on("get-document", async (id) => {
    const document = await Document.findById(id) || await Document.create({ _id: id });
    socket.join(id);
    socket.emit("load-document", document.content);

    socket.on("send-changes", (data) => {
      socket.broadcast.to(id).emit("receive-changes", data);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(id, { content: data });
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
