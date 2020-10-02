const path = require("path");
const express = require("express");
const http = require("http"); //Core HTTP module
const socketio = require("socket.io");
const Filter = require("bad-words");
const translatte = require("translatte");
const { generateMessage, generateLocation } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./views")));

io.on("connection", (socket) => {
  console.log("New user connected!");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Bingo!", "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Bingo!", `${username} has joined!`)); //Sends message to everyone except the user who has joined
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
        generateMessage("Bingo!", "Please maintain decent language!")
      );
      return callback("PLease maintain your language.Profanity is prohibited!");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
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
        generateMessage("Admin", `${user.username} has left!`)
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

app.get("/hi", (req, res) => {
  res.render("index");
});

app.get("/translated", (req, res) => {
  if (!req.query.inputstring) {
    res.send({
      error: "Please provide some input text",
    });
  } else {
    const inputstring = req.query.inputstring;
    const source_lan = req.query.source_lan;
    const res_lan = req.query.res_lan;
    translatte(inputstring, { from: source_lan, to: res_lan })
      .then((translated_res) => {
        res.send({ translatedText: translated_res.text });
        console.log(translated_res.text);
      })
      .catch((err) => {
        return err;
      });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server is up on port " + PORT);
});

//socket.emit() --Emits it to the particular user
//io.emit()  --Emits it to all the users
//socket.broadcast.emit()  --Emits it to all users except the one generating it
