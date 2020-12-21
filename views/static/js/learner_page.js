const container = document.getElementsByClassName("container")[0];
const content = data[0];
const src = $("#my-lang").val();
const dest = $("#learn-lang").val();

const words = content[src];
const translated_words = content[dest];

for (var i = 0; i < 7; i++) {
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

// const speakme6 = document.getElementById("speakme6");
// speakme6.addEventListener("click", () => {
//   readOutLoud("आपसे मिलकर अच्छा लगा!", "hi");
// });
