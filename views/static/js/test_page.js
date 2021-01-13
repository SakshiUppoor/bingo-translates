//Options --This is the qs library whose link we've included in the html file
//location.search is a browser side tool which gives us the querystring
//eg : ?username=yashchachad1&room=myroom
//Qs.parse returns all the query parameters as object
const { src, res } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

var current = 1;
var currentAnswer = "";
var score = 0;
questionHolder = document.getElementById("question");
option1 = document.getElementById("A");
option2 = document.getElementById("B");
option3 = document.getElementById("C");
option4 = document.getElementById("D");

questions = [];
const url = `${process.env.HOST}/getQuestions?source_lan=${src}&res_lan=${res}`;
fetch(url)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    questions = res;
    updateQuiz();
  })
  .catch((error) => console.log(error));

function hello() {
  console.log(questions);
}

function updateQuiz() {
  move();
  updateScore();
  if (current < questions.length) {
    q = questions[current - 1];
    currentAnswer = q.answer;
    questionHolder.innerHTML = q.question;
    option1.innerHTML = q.options[0];
    option2.innerHTML = q.options[1];
    option3.innerHTML = q.options[2];
    option4.innerHTML = q.options[3];
    current += 1;
  } else {
    showResult();
  }
}

function checkAnswer(e) {
  if (e.innerHTML == currentAnswer) {
    score += 10;
  } else {
    console.log("Try again.");
  }
  updateQuiz();
}

function showResult() {
  swal({
    title: "Good job!",
    text: `You completed the quiz!\nScore: ${score}/${10 * questions.length}`,
    icon: "success",
    buttons: {
      tryAgain: "Try Again",
      cancel: "Exit",
    },
  }).then((value) => {
    switch (value) {
      case "tryAgain":
        location.reload();
        break;

      default:
        window.history.back();
        break;
    }
  });
}

function move() {
  var elem = document.getElementById("myBar");
  var qno = document.getElementById("qno");
  var width = 0;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width = parseInt(((current - 1) / questions.length) * 100);
      elem.style.width = width + "%";
      qno.innerHTML = `Question ${current - 1} / ${questions.length}`;
    }
  }
}

function updateScore() {
  var scoreContainer = document.getElementById("score");
  scoreContainer.innerHTML = `Score: ${score}/${10 * questions.length}`;
}
