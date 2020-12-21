const express = require("express");
const translatte = require("translatte");
const router = express();
const fs = require("fs");

router.get("/translated", (req, res) => {
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
        // console.log(translated_res);
        res.send({ translatedText: translated_res.text });
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

// SE=ends quiz questions taking from and to language
router.get("/getQuestions", (req, res) => {
  try {
    if (!req.query.source_lan || !req.query.res_lan) {
      res.send({
        error: "Please provide source and res language",
      });
    } else {
      // {0 - English(en),1 - Hindi(hi), 2 - Marathi(mr),3- Gujrati(gu),4-Kannada(kn)
      // ,5-Malayalam(ml),6-German(de),7-Russian(ru),8-Spanish(es),9-Tamil(ta),10-Telugu(te)}

      const words = require("./quizData.json");
      const languageMap = require("./languages.json");

      const source = languageMap[req.query.source_lan];
      const response = languageMap[req.query.res_lan];
      const count = words[0].length;

      const result = [];
      for (let i = 0; i < count; i++) {
        const current_word = words[source.code][i];
        const answer = words[response.code][i];
        const question = `What is the ${response.lang} word for '${current_word}' ?`;
        const options = [answer];

        while (options.length < 4) {
          var item = words[response.code][Math.floor(Math.random() * count)];
          if (item != answer) options.push(item);
        }
        options.sort(function () {
          return Math.random() - 0.5;
        });
        const obj = { question, answer, options };
        result.push(obj);
      }
      return res.send(result);
    }
  } catch (e) {
    res.send({ Error: e });
  }
});

// This route is slow, so please have some patience, Thanks!
router.get("/generateQuiz/:source_lan/:res_lan", async (req, res) => {
  console.log("Here");
  const source_lan = req.params.source_lan;
  const res_lan = req.params.res_lan;
  const words = [
    "Hello",
    "Thankyou",
    "Greetings",
    "Welcome",
    "Good morning",
    "How are you ?",
    "Goodluck",
  ];

  const result = [];
  await words.forEach(async (word, idx) => {
    await translatte(word, { from: source_lan, to: res_lan })
      .then(async (translated_res) => {
        result.push({ text: translated_res.text, idx });
        if (result.length == words.length) {
          // We had to sort this as the received response was in random order

          await result.sort((a, b) => {
            return a.idx > b.idx ? 1 : -1;
          });

          const finalResult = [];
          result.forEach((item) => {
            finalResult.push(item.text);
          });

          return res.send(finalResult);
        }
      })
      .catch((e) => {
        res.send(e);
      });
  });
});

module.exports = router;
