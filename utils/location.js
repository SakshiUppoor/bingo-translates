const got = require("got");
require("dotenv").config();

let locations = {};

const fetchLocation = async (username, latitude, longitude) => {
  const url = ` https://api.codezap.io/v1/reverse?lat=${latitude}&lng=${longitude}&language=en`;

  const result = await got.get(url, {
    headers: { "api-key": process.env.api_key },
    responseType: "json",
  });
  console.log(result.body);
  locations[username] = result.body.address;
  console.log("Location", locations);
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
