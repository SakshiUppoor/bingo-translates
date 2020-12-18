const btn11 = document.querySelector(".talk");
const speakme = document.querySelector("#speakme");
const submit = document.querySelector("#btn11");

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
    // As read out loud in the above languages was not supported
    lang = "hi";
  }
  readOutLoud(totranslate, lang);
});

submit.addEventListener("click", (e) => {
  e.preventDefault();

  const source_lan = document.querySelector("#source_lan").value;
  const res_lan = document.querySelector("#res_lan").value;
  const inputdata = document.querySelector("#inputdata");
  translateme(inputdata.value.trim(), source_lan, res_lan);
});
