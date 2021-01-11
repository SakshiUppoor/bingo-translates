const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");
const { fetchLocation, getLocation } = require("./utils/location");
const translateRoutes = require("./routes/translate");
const translatte = require("translatte");
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

    socket.emit("message", {
      message: generateMessage(
        { id: "admin_id", username: "Bingo!", room: user.room },
        "Welcome"
      ),
      location: "Headquarters",
    });
    socket.broadcast.to(user.room).emit("message", {
      message: generateMessage(
        { id: "admin_id", username: "Bingo!", room: user.room },
        `${username} has joined!`
      ),
      location: "Headquarters",
    }); //Sends message to everyone except the user who has joined

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on(
    "message",
    async ({ message, room, res_language, locationSharing }, callback) => {
      const user = getUser(socket.id);
      const filter = new Filter();

      // Checking fro Profanity
      if (filter.isProfane(message)) {
        socket.emit("message", {
          message: generateMessage(
            { id: "admin_id", username: "Bingo!", room: user.room },
            "Please maintain decent language!"
          ),
          location: "Headquarters",
        });
        return callback(
          "PLease maintain your language.Profanity is prohibited!"
        );
      }
      // Translating every message to the room_language (room) by default
      await translatte(message, { from: res_language, to: room })
        .then((translated_res) => {
          message = translated_res.text;
        })
        .catch((err) => {
          res.send(err);
        });

      // Computing the user's location if allowed
      let locationString = "Unknown";
      if (locationSharing) {
        locationString = getLocation(user.username);
      }

      io.to(user.room).emit("message", {
        message: generateMessage(user, message),
        location: locationString,
      });
      callback();
    }
  );

  // This computes and stores the location of the user in a hashmap
  socket.on("computeLocation", async (position, callback) => {
    const user = getUser(socket.id);
    fetchLocation(user.username, position.latitude, position.longitude);
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
