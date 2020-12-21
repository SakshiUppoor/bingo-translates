import fs from "fs";

const container = document.getElementsByClassName("container")[0];

const content = fs.readFileSync("../data.json");
const src = $("#my-language").val();
const dest = $("#learn-lang").val();

const words = content[src];
const translated_words = content[dest];

for (i = 0; i < 6; i++) {
  const word = words[i];
  const translated_word = translated_words[i];

  const panel = `<div class="panel p1"><div class="translation"><div class="translated">${translated_word}<div class="speaker speaker-button" onclick='readOutLoud(
         "${translated_word}",
          "${dest}"
        )' ><ion-icon  id="speakme${
          i + 1
        }" name="volume-high"></ion-icon></div></div></div><div class="origin">${word}</div></div>`;
  container.innerHTML = container.innerHTML + panel;
}

original_words.forEach((word, i) => {
  translation = fetch(
    `http://localhost:3000/translated?source_lan=en&res_lan=hi&inputstring=${word}`
  )
    .then((res) => {
      res.json().then((data) => {
        const result = data.translatedText;
        const panel = `<div class="panel p1"><div class="translation"><div class="translated">${result}<div class="speaker speaker-button" onclick='readOutLoud(
         "${result}",
          "hi"
        )' ><ion-icon  id="speakme${
          i + 1
        }" name="volume-high"></ion-icon></div></div><div class="pronunciation">dhanyavaad</div></div><div class="origin">${word}</div></div>`;
        container.innerHTML = container.innerHTML + panel;
      });
    })
    .catch((e) => console.log(e));
});

// const original_words = [
//   "Thankyou",
//   "What is the cost?",
//   "Do you speak English?",
//   "Can you help me?",
//   "Sorry",
//   "Nice to meet you!",
// ];

// original_words.forEach((word, i) => {
//   translation = fetch(
//     `http://localhost:3000/translated?source_lan=en&res_lan=hi&inputstring=${word}`
//   )
//     .then((res) => {
//       res.json().then((data) => {
//         const result = data.translatedText;
//         const panel = `<div class="panel p1"><div class="translation"><div class="translated">${result}<div class="speaker speaker-button" onclick='readOutLoud(
//          "${result}",
//           "hi"
//         )' ><ion-icon  id="speakme${
//           i + 1
//         }" name="volume-high"></ion-icon></div></div><div class="pronunciation">dhanyavaad</div></div><div class="origin">${word}</div></div>`;
//         container.innerHTML = container.innerHTML + panel;
//       });
//     })
//     .catch((e) => console.log(e));
// });

// const speakme1 = document.getElementById("speakme1");
// speakme1.addEventListener("click", () => {
//   fetch(
//     `http://localhost:3000/translated?source_lan=en&res_lan=hi&inputstring=Thankyou`
//   ).then((res) => {
//     res.json().then((data) => {
//       const result = data.translatedText;
//       readOutLoud(result, "hi");
//     });
//   });
// });

// const speakme2 = document.getElementById("speakme2");
// speakme2.addEventListener("click", () => {
//   readOutLoud("क्या भाव है? ", "hi");
// });

// const speakme3 = document.getElementById("speakme3");
// speakme3.addEventListener("click", () => {
//   readOutLoud("क्या आप अंग्रेज़ी बोलते हैं?", "hi");
// });

// const speakme4 = document.getElementById("speakme4");
// speakme4.addEventListener("click", () => {
//   readOutLoud("क्या आप मेरी मदद कर सकते हैं?", "hi");
// });

// const speakme5 = document.getElementById("speakme5");
// speakme5.addEventListener("click", () => {
//   readOutLoud("माफ़ करना", "hi");
// });

// const speakme6 = document.getElementById("speakme6");
// speakme6.addEventListener("click", () => {
//   readOutLoud("आपसे मिलकर अच्छा लगा!", "hi");
// });
