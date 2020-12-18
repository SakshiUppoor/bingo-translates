const inputdata = document.querySelector("#inputdata");
const result = document.querySelector("#result");

//Translate the data
const translateme = (datainp, source_lan, res_lan) => {
  fetch(
    `http://localhost:3000/translated?source_lan=${source_lan}&res_lan=${res_lan}&inputstring=${datainp}`
  ).then((res) => {
    res.json().then((data) => {
      console.log(data);

      if ($("body").data("title") === "my_translate_page") {
        result.value = "Loading....";

        if (data.error) {
          result.value = data.error;
        } else {
          result.value = data.translatedText;
        }
        speakme.disabled = false;
      } else {
        const input = document.getElementById("input");
        input.value = data.translatedText;
      }
    });
  });
};

//Speech Recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log("Voices activated!!");
};

recognition.onresult = (event) => {
  console.log(event);
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  inputdata.value = transcript;
  translateme();
};

const readOutLoud = (message, lang) => {
  const speech = new SpeechSynthesisUtterance();
  console.log(speech);

  speech.text = message;
  speech.voulme = 1;
  speech.rate = 1;
  speech.lang = lang;

  window.speechSynthesis.speak(speech);
};
