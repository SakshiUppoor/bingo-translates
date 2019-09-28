const submit = document.querySelector("#btn11");
const inputdata = document.querySelector("#inputdata");
const result = document.querySelector("#result");
const btn11 = document.querySelector(".talk");
const speakme = document.querySelector("#speakme");

var someFunction = function(mymessage) {
  return new Promise(function(resolve, reject) {
    try {
      const tvalue = translateme(mymessage);
      resolve(tvalue);
    } catch (e) {
      reject("Error");
    }
  });
};

//Translate the data
const translateme = mymessage => {
  if ($("body").data("title") === "my_translate_page") {
    var datainp = inputdata.value;

    var source_lan = document.querySelector("#source_lan").value;
    var res_lan = document.querySelector("#res_lan").value;
  }
  if ($("body").data("title") === "my_chat_page") {
    var datainp = mymessage;

    var source_lan = "en";
    var res_lan = "hi";
  }

  //   console.log(source_lan);
  //   console.log(res_lan);

  const inputlink =
    "http://localhost:3000/translated?source_lan=" +
    source_lan +
    "&res_lan=" +
    res_lan +
    "&inputstring=" +
    datainp;
  console.log(inputlink);

  fetch(inputlink).then(res => {
    res.json().then(data => {
      console.log(data);

      if ($("body").data("title") === "my_translate_page") {
        result.textContent = "Loading....";

        if (data.error) {
          result.value = data.error;
        } else {
          result.value = data.translatedText;
        }
      } else {
        console.log(data.translatedText);
        const input = document.getElementById("input");
        input.value = data.translatedText;
      }
    });
  });
};

//Submit form event
if ($("body").data("title") === "my_translate_page") {
  submit.addEventListener("click", e => {
    e.preventDefault();
    translateme();
  });
}

//Speech Recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log("Voices activated!!");
};

recognition.onresult = event => {
  console.log(event);
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  inputdata.value = transcript;
  translateme();
};

if ($("body").data("title") === "my_translate_page") {
  //Voice Recognition event
  btn11.addEventListener("click", () => {
    recognition.start();
  });
  //Speak out event
  speakme.addEventListener("click", () => {
    const totranslate = document.querySelector("#result").value;
    var lang = document.querySelector("#res_lan").value;
    if (
      lang == "mr" ||
      lang == "kn" ||
      lang == "gu" ||
      lang == "ml" ||
      lang == "ta" ||
      lang == "ur" ||
      lang == "ta" ||
      lang == "te" ||
      lang == "sd"
    ) {
      lang = "hi";
    }
    readOutLoud(totranslate, lang);
  });
}

const readOutLoud = (message, lang) => {
  const speech = new SpeechSynthesisUtterance();
  console.log(speech);

  speech.text = message;
  speech.voulme = 1;
  speech.rate = 1;
  speech.lang = lang;

  window.speechSynthesis.speak(speech);
};

if ($("body").data("title") === "my_learner_page") {
  const speakme1 = document.getElementById("speakme1");
  speakme1.addEventListener("click", () => {
    readOutLoud("धन्यवाद ", "hi");
  });

  const speakme2 = document.getElementById("speakme2");
  speakme2.addEventListener("click", () => {
    readOutLoud("क्या भाव है? ", "hi");
  });

  const speakme3 = document.getElementById("speakme3");
  speakme3.addEventListener("click", () => {
    readOutLoud("क्या आप अंग्रेज़ी बोलते हैं?", "hi");
  });

  const speakme4 = document.getElementById("speakme4");
  speakme4.addEventListener("click", () => {
    readOutLoud("क्या आप मेरी मदद कर सकते हैं?", "hi");
  });

  const speakme5 = document.getElementById("speakme5");
  speakme5.addEventListener("click", () => {
    readOutLoud("माफ़ करना", "hi");
  });

  const speakme6 = document.getElementById("speakme6");
  speakme6.addEventListener("click", () => {
    readOutLoud("आपसे मिलकर अच्छा लगा!", "hi");
  });
}

console.log(mic);
