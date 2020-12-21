const express = require("express");
const translatte = require("translatte");
const router = express();

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

      const words = [
        [
          "Hello",
          "Thankyou",
          "Greetings",
          "Welcome",
          "Good morning",
          "How are you ?",
          "Goodluck",
        ],
        [
          "नमस्ते",
          "धन्यवाद",
          "अभिवादन",
          "स्वागत हे",
          "शुभ प्रभात",
          "क्या हाल है ?",
          "सौभाग्य",
        ],
        [
          "नमस्कार",
          "धन्यवाद",
          "शुभेच्छा",
          "स्वागत आहे",
          "शुभ प्रभात",
          "तू कसा आहेस ?",
          "गुडब्लक",
        ],
        [
          "નમસ્તે",
          "આભાર",
          "શુભેચ્છાઓ",
          "સ્વાગત",
          "સુપ્રભાત",
          "તમે કેમ છો ?",
          "સારા નસીબ",
        ],
        [
          "ಹಲೋ",
          "ಧನ್ಯವಾದಗಳು",
          "ಶುಭಾಶಯಗಳು",
          "ಸ್ವಾಗತ",
          "ಶುಭೋದಯ",
          "ನೀವು ಹೇಗಿದ್ದೀರಿ ?",
          "ಒಳ್ಳೆಯದಾಗಲಿ",
        ],
        [
          "ഹലോ",
          "നന്ദി",
          "ആശംസകൾ",
          "സ്വാഗതം",
          "സുപ്രഭാതം",
          "എന്തൊക്കെയുണ്ട് ?",
          "നല്ലതുവരട്ടെ",
        ],
        [
          "Hallo",
          "Vielen Dank",
          "Schöne Grüße",
          "Herzlich willkommen",
          "Guten Morgen",
          "Wie geht es dir ?",
          "Viel Glück",
        ],
        [
          "Здравствуйте",
          "Спасибо",
          "приветствия",
          "Добро пожаловать",
          "Доброе утро",
          "Как поживаете ?",
          "Удачи",
        ],
        [
          "Hola",
          "Gracias",
          "Saludos",
          "Bienvenidos",
          "Buenos días",
          "Cómo estás ?",
          "Buena suerte",
        ],
        [
          "வணக்கம்",
          "நன்றி",
          "வாழ்த்துக்கள்",
          "வரவேற்பு",
          "காலை வணக்கம்",
          "நீங்கள் எப்படி இருக்கிறீர்கள் ?",
          "Goodluck.",
        ],
        [
          "మీరు ఎలా ఉన్నారు ?",
          "స్వాగతం",
          "గుడ్లక్",
          "శుభాకాంక్షలు",
          "హలో",
          "శుభోదయం",
          "ధన్యవాదాలు",
        ],
      ];

      const languageMap = {
        en: { lang: "English", code: 0 },
        hi: { lang: "Hindi", code: 1 },
        mr: { lang: "Marathi", code: 2 },
        gu: { lang: "Gujrathi", code: 3 },
        kn: { lang: "Kannada", code: 4 },
        ml: { lang: "Malayalam", code: 5 },
        de: { lang: "German", code: 6 },
        ru: { lang: "Russian", code: 7 },
        es: { lang: "Spanish", code: 8 },
        ta: { lang: "Tamil", code: 9 },
        te: { lang: "Telugu", code: 10 },
      };

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
