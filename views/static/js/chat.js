const socket = io();

//Elements
const chatRoomTitle = document.querySelector("#chatroom__title");
const messageForm = document.querySelector("#message_form");
const messageFormInput = messageForm.querySelector("#input");
const messageFormButton = messageForm.querySelector("#button");
const locationbutton = document.querySelector("#locationbutton");
const messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const languages = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  gu: "Gujrathi",
  kn: "Kannada",
  ml: "Malayalam",
  de: "German",
  ru: "Russian",
  es: "Spanish",
  ta: "Tamil",
  te: "Telugu",
};

//Options --This is the qs library whose link we've included in the html file
//location.search is a browser side tool which gives us the querystring
//eg : ?username=yashchachad1&room=myroom
//Qs.parse returns all the query parameters as object
const { username, room, res_language } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  messages.scrollTop = messages.scrollHeight;
};

socket.on("message", (response) => {
  console.log(response);
  const { message, location } = response;

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
    message_id: message.message_id,
    photo: message.photo,
    color: message.color,
    location: location,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

// If locationSharing is on -> Then your location(city, country) will be visible besides every message
let locationSharing = 0;
locationbutton.addEventListener("click", () => {
  console.log("clicked");
  if (!navigator.geolocation) {
    return alert("OOps! The current browser doesn't support this feature");
  }

  locationSharing = !locationSharing;
  navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  messageFormButton.setAttribute("disabled", "disabled"); //Disable send button on clicking

  //const message=e.target.elements.message.value
  const message = document.querySelector("input").value;
  messageFormInput.value = "";

  socket.emit(
    "message",
    { message, room, res_language, locationSharing },
    (error) => {
      messageFormButton.removeAttribute("disabled"); //Reactivate the button on sending
      messageFormInput.focus();

      if (error) {
        return console.log(error);
      } else {
        console.log("Message Delivered!");
      }
    }
  );
});

const chatRoomName = languages[room] + " Chatroom";
chatRoomTitle.innerHTML = chatRoomName;

// If this button is clicked (set) then the location of the user will also be shared with messages
locationbutton.addEventListener("click", () => {
  locationbutton.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("OOps! The current browser doesn't support this feature");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "computeLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location Shared!");
        locationbutton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

function translateToNative(message_id) {
  chatMessage = document.getElementById(`text_${message_id}`);
  translation = document.getElementById(`translation_${message_id}`);
  message = chatMessage.innerHTML;
  fetch(
    `http://localhost:3000/translated?source_lan=${room}&res_lan=${res_language}&inputstring=${message}`
  ).then((res) => {
    res.json().then((data) => {
      translation.innerHTML = data.translatedText;
    });
  });
}

function hello(e, message_id) {
  viewSummary = document.getElementById(`view_${message_id}`);
  if (!e.open) viewSummary.innerHTML = "Hide translation";
  else viewSummary.innerHTML = "View translation";
  if (
    !e.open &&
    document.getElementById(`translation_${message_id}`).innerHTML == ""
  ) {
    document.getElementById(`translation_${message_id}`).innerHTML =
      "Translating...";
    translateToNative(message_id);
  }
}
