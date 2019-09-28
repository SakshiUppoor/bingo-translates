const socket = io();

//Elements
const messageForm = document.querySelector("#message_form");
const messageFormInput = messageForm.querySelector("#input");
const messageFormButton = messageForm.querySelector("#button");
const locationbutton = document.querySelector("#locationbutton");
const messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options --This is the qs library whose link we've included in the html file
//location.search is a browser side tool which gives us the querystring
//eg : ?username=yashchachad1&room=myroom
//Qs.parse returns all the query parameters as object
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = () => {
  messages.scrollTop = messages.scrollHeight;
};

socket.on("message", message => {
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", message => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    locationlink: message.locationlink,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();

  messageFormButton.setAttribute("disabled", "disabled"); //Disable send button on clicking

  //const message=e.target.elements.message.value
  const message = document.querySelector("input").value;
  // messageForm.value = translateme(message);

  socket.emit("message", message, error => {
    messageFormButton.removeAttribute("disabled"); //Reactivate the button on sending
    messageFormInput.value = "";
    messageFormInput.focus();

    if (error) {
      return console.log(error);
    } else {
      console.log("Message Delivered!");
    }
  });
});

const translatebtn = document.querySelector("#button_trans");
translatebtn.addEventListener("click", e => {
  e.preventDefault();

  //const message=e.target.elements.message.value
  const message = document.querySelector("input").value;
  const input = document.getElementById("input");
  input.value = translateme(message);
});

locationbutton.addEventListener("click", () => {
  locationbutton.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("OOps! The current browser doesn't support this feature");
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        console.log("Location Shared!");
        locationbutton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
