var resDropDown = document.querySelector("#res_lan");
var translateBtn = document.querySelector("#translate-btn");
var speechBtn = document.querySelector("#speakme");
var copyTextareaBtn = document.querySelector("#copy-btn");
var downloadBtn = document.querySelector("#download-btn");
var downloadBtn = document.querySelector("#download-btn");
var resultArea = document.querySelector("#result");
var inputArea = document.querySelector("#inputdata");

inputArea.value = "";

resDropDown.addEventListener("change", (e) => {
  performTranslation(e);
});

translateBtn.addEventListener("click", (e) => {
  performTranslation(e);
});

copyTextareaBtn.addEventListener("click", function (event) {
  copyToClipboard(resultArea.value);
});

downloadBtn.addEventListener("click", function (event) {
  download(resultArea.value);
});

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function download(text) {
  var filename = "translated.txt";
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const talk_btn = document.querySelector(".talk");

//Voice Recognition event
talk_btn.addEventListener("click", () => {
  recognition.start();
  inputdata.value = "Listening...";
  speechBtn.disabled = true;
});

//Speak out event
function textToSpeech() {
  const totranslate = document.querySelector("#result").value;
  var lang = document.querySelector("#res_lan").value;

  languages_list = ["mr", "kn", "gu", "ml", "ta", "ur", "ta", "te", "sd"];
  if (languages_list.includes(lang)) {
    lang = "hi";
  }
  readOutLoud(totranslate, lang);
}

function performTranslation(e) {
  const source_lan = document.querySelector("#source_lan").value;
  const res_lan = document.querySelector("#res_lan").value;
  const inputdata = document.querySelector("#inputdata");
  result.value = "Translating...";
  speechBtn.disabled = true;

  e.preventDefault();
  translateme(inputdata.value.trim(), source_lan, res_lan);
}
