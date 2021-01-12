const got = require("got");

let locations = {};

const fetchLocation = async (username, latitude, longitude) => {
  const url = ` https://api.codezap.io/v1/reverse?lat=${latitude}&lng=${longitude}&language=en`;

  const result = await got.get(url, {
    headers: { "api-key": "41exb1Iktl9OToEZBnJSjwsrQ4ZRjh7M" },
    responseType: "json",
  });
  locations[username] = result.body.address;
  // console.log("Location", locations);
};

const getLocation = (username) => {
  if (!locations[username]) {
    return "";
  } else {
    let locationString = "";
    if (locations[username].city) {
      locationString += locations[username].city + " ";
    }
    if (locations[username].region) {
      locationString += locations[username].region + " ";
    }
    if (locations[username].state) {
      locationString += locations[username].state + " ";
    }
    if (locations[username].country) {
      locationString += locations[username].country + " ";
    }
    // console.log(locationString);
    return locationString;
  }
};

module.exports = { fetchLocation, getLocation };
