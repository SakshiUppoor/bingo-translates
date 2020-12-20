const fs = require("fs");
const fetch = require("node-fetch");

const original_words = [
  "Thankyou",
  "What is the cost?",
  "Do you speak English?",
  "Can you help me?",
  "Sorry",
  "Nice to meet you!",
];

const languages = [
  "en",
  "de",
  "gu",
  "hi",
  "kn",
  "ml",
  "mr",
  "ru",
  "es",
  "ta",
  "te",
];

const translated_words = {};

languages.map((lang) => {
  translated_words[lang] = {};
});

const content = new Promise(() => {
  languages.forEach((language) => {
    original_words.forEach((word, i) => {
      fetch(
        `http://localhost:3000/translated?source_lan=en&res_lan=${language}&inputstring=${word}`
      )
        .then((res) => {
          res.json().then((data) => {
            const result = data.translatedText;
            translated_words.language.push({ i: result });
          });
        })
        .catch((e) => console.log(e));
    });
  });
})
  .then(fs.writeFileSync("data.json", JSON.stringify(translated_words)))
  .catch((e) => console.log(e));
