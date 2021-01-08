const { createUUID } = require("../utils/uuid");

var links = require("../jsonData/avatars.json");

// Stores the avatar assigned to each user
var avatar = {};
// Helps assign the avatar to the next incoming using in cyclic fashion
var nextAvatarId = {};

const generateMessage = (user, text) => {
  if (!avatar[user.room] || !(avatar[user.room][user.username] + 1)) {
    // This is for the time when room is created -> id(0) is reserved for admin
    if (!avatar[user.room]) {
      avatar[user.room] = [];
      nextAvatarId[user.room] = 0;
    }
    avatar[user.room][user.username] = nextAvatarId[user.room];
    nextAvatarId[user.room]++;
    if (nextAvatarId[user.room] == links.length) {
      nextAvatarId[user.room] = 1;
    }
  }
  return {
    message_id: createUUID(),
    username: user.username,
    text: text,
    createdAt: new Date().getTime(),
    photo: links[avatar[user.room][user.username]],
  };
};

const generateLocation = (username, locationlink) => {
  return {
    message_id: createUUID(),
    username,
    locationlink,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
