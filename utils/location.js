const got = require("got");

let locations = {};

const fetchLocation = async (user, latitude, longitude) => {
  const url = ` https://api.codezap.io/v1/reverse?lat=${latitude}&lng=${longitude}&language=en`;

  const result = await got.get(url, {
    headers: { "api-key": "41exb1Iktl9OToEZBnJSjwsrQ4ZRjh7M" },
    responseType: "json",
  });

  if (!locations[user.room]) {
    locations[user.room] = [];
  }
  locations[user.room][user.username] = result.body.address;
};

const deleteLocation = async (user) => {
  if (locations[user.room]) delete locations[user.room][user.username];
};

const getLocation = (user) => {
  const locationObj = locations[user.room][user.username];
  if (!locationObj) {
    return "";
  } else {
    let locationString = "";
    if (locationObj.city) {
      locationString += locationObj.city + " ";
    }
    if (locationObj.region) {
      locationString += locationObj.region + " ";
    }
    if (locationObj.state) {
      locationString += locationObj.state + " ";
    }
    if (locationObj.country) {
      locationString += locationObj.country + " ";
    }
    // console.log(locationString);
    return locationString;
  }
};

module.exports = { fetchLocation, getLocation, deleteLocation };
