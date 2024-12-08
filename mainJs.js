let words = wordsArray();
function wordsArray() {
  // prettier-ignore
  return ["apple","banana","cherry","dragonfruit","elephant","forest","guitar","honey","island",
    "jungle","kite","lemon","mountain","notebook","ocean","piano","quartz","river","strawberry","tiger","umbrella","volcano",
    "waterfall","xylophone","yacht","zebra"];
}
let start = document.querySelector(".Start");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-word");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finish = document.querySelector(".finished");
let select = document.querySelector("#def");
let startOver = document.getElementById("start-over");
let gameColor = document.querySelector(".game-color");
upcomingWords.style.display = "none";
let lvls = {
  easy: 6,
  normal: 4,
  hard: 2,
};

handleLocalStorage();
function handleLocalStorage() {
  gameColor.value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--mian-color");

  getFromLocalStorage();
  function getFromLocalStorage() {
    if (localStorage.getItem("gameColor")) {
      const root = document.documentElement;
      let colorValue = localStorage.getItem("gameColor");
      root.style.setProperty("--mian-color", colorValue);
      gameColor.value = colorValue;
    }
    if (localStorage.getItem("gameDifficulty")) {
      select.value = localStorage.getItem("gameDifficulty");
    }
  }
  setToLocalSotage();
  function setToLocalSotage() {
    select.addEventListener("input", function () {
      localStorage.setItem("gameDifficulty", select.value);
    });
    gameColor.addEventListener("input", function () {
      const root = document.documentElement;
      root.style.setProperty("--mian-color", gameColor.value);
      window.localStorage.setItem("gameColor", gameColor.value);
    });
  }
}

let defaultLevel = select.value;
let defaultLevelSeconds = lvls[defaultLevel];
select.value = defaultLevel;
secondsSpan.appendChild(document.createTextNode(defaultLevelSeconds));
timeLeftSpan.appendChild(document.createTextNode(defaultLevelSeconds));
scoreTotal.style.display = "none";
scoreTotal.innerHTML = words.length;
select.addEventListener("change", function () {
  defaultLevel = select.value;
  defaultLevelSeconds = lvls[defaultLevel];
  secondsSpan.innerHTML = defaultLevelSeconds;
  timeLeftSpan.innerHTML = defaultLevelSeconds;
});
input.onpaste = function () {
  return false;
};

start.addEventListener("click", function () {
  upcomingWords.style.display = "flex";
  scoreTotal.style.display = "inline-block";
  this.remove();
  input.focus();
  genWord();
});

function genWord() {
  let random = words[Math.floor(Math.random() * words.length)];
  let index = words.indexOf(random);
  words.splice(index, 1);
  theWord.innerHTML = random;
  upcomingWords.innerHTML = "";

  for (let i = 0; i < words.length; i++) {
    let wordContainer = document.createElement("div");
    wordContainer.appendChild(document.createTextNode(words[i]));
    upcomingWords.appendChild(wordContainer);
  }
  handleTimer();
}

let startInterval;
function handleTimer() {
  let text = document.createTextNode("Reset Your Game");
  startPlay();
  function startPlay() {
    rstGame.innerHTML = "";
    clearInterval(startInterval);
    startInterval = setInterval(() => {
      lvls[select.value]--;
      timeLeftSpan.innerHTML = lvls[select.value];
      if (lvls[select.value] <= 0 && theWord.innerHTML !== input.value) {
        rstGame.appendChild(text);
        startOver.style.display = "inline-block";
        rstGame.style.display = "inline-block";
        finish.style.display = "block";
        finish.innerHTML = "game over";
        clearInterval(startInterval);
      }
      if (lvls[select.value] <= 0 && theWord.innerHTML === input.value) {
        scoreGot.innerHTML++;
        if (words.length > 0) {
          resetGame();
        } else {
          clearInterval(startInterval);
          startOver.style.display = "inline-block";
          rstGame.style.display = "inline-block";
          rstGame.appendChild(text);
          finish.style.display = "block";
          finish.innerHTML = "congratulations";
        }
      }
    }, 1000);
  }
  function resetGame() {
    lvls[select.value] = defaultLevelSeconds;
    timeLeftSpan.innerHTML = defaultLevelSeconds;
    input.value = "";
    genWord();
    startPlay();
  }
}
let rstGame = document.querySelector(".rest");
startOver.addEventListener("click", function () {
  startOver.style.display = "none";
  rstGame.style.display = "none";
  input.value = "";
  input.focus();
  finish.innerHTML = "";
  finish.style.display = "none";
  scoreGot.innerHTML = 0;
  timeLeftSpan.innerHTML = defaultLevelSeconds;
  lvls = {
    easy: 6,
    normal: 4,
    hard: 2,
  };
  words = wordsArray();
  genWord();
});
