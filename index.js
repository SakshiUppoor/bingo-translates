const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocation,
  freeAvatar,
} = require("./utils/messages");
const translateRoutes = require("./routes/translate");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);

app.use(translateRoutes);
app.use(express.static(path.join(__dirname, "./views")));

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("New user connected!");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit(
      "message",
      generateMessage(
        { id: "admin_id", username: "Bingo!", room: user.room },
        "Welcome"
      )
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(
          { id: "admin_id", username: "Bingo!", room: user.room },
          `${username} has joined!`
        )
      ); //Sends message to everyone except the user who has joined

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("message", (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(message)) {
      socket.emit(
        "message",
        generateMessage(
          { id: "admin_id", username: "Bingo!", room: user.room },
          "Please maintain decent language!"
        )
      );
      return callback("PLease maintain your language.Profanity is prohibited!");
    }
    io.to(user.room).emit("message", generateMessage(user, message));
    callback();
  });

  socket.on("sendLocation", (position, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      generateLocation(
        user.username,
        `https://google.com/maps?q=${position.latitude},${position.longitude})`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(
          { id: "admin_id", username: "Bingo!", room: user.room },
          `${user.username} has left!`
        )
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

io.on("translate", (socket) => {
  console.log("connect");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server is up on port " + PORT);
});

//socket.emit() --Emits it to the particular user
//io.emit()  --Emits it to all the users
//socket.broadcast.emit()  --Emits it to all users except the one generating it
