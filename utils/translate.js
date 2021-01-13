const translatte = require("translatte");

const getTranslated = ({ message, res_language, room }) => {
  translatte(message, {
    from: res_language,
    to: room,
  })
    .then((translated_res) => {
      // console.log(translated_res);
      return translated_res.text;
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = { getTranslated };
