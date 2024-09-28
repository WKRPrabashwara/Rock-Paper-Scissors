const CHOICES = { ROCK: 'rock', PAPER: 'paper', SCISSORS: 'scissors' };
const keyMap = {
    'r': CHOICES.ROCK,
    'p': CHOICES.PAPER,
    's': CHOICES.SCISSORS,
};

const bodyElement = document.querySelector('body');

const yourScore = document.querySelector('.js-user-score');
const computerScore = document.querySelector('.js-computer-score');

let rockElement = document.querySelector('.rock');
let paperElement = document.querySelector('.paper');
let scissorsElement = document.querySelector('.scissors');

const scoreResetElement = document.querySelector('.scoreReset__btn');
const autoPlayElement = document.querySelector('.autoPlay__btn');

const scoreResetConfirmelement = document.querySelector('.scoreResetConfirm');

const gamePlayelement = document.querySelector('.gamePlay__section');

let computerChoice;
let UserChoice;
let result;
let inID;
let confirmTimeout;
const nullCkeckforAlert = JSON.parse(localStorage.getItem('scoreData'));
let score = JSON.parse(localStorage.getItem('scoreData')) || { wins: 0, loses: 0, ties: 0 };
htmlRender();

if (!nullCkeckforAlert) alert(`
    R key - Rock
    P key - Paper
    S key - Scissors
    `);

function gamePlay(userC) {
    computerC = computerChoiceGen();

    if (userC === computerC) {
        return ['tie', computerC];

    } else if (
        (userC === 'rock' && computerC === 'scissors') ||
        (userC === 'paper' && computerC === 'rock') ||
        (userC === 'scissors' && computerC === 'paper')
    ) {
        return ['win', computerC];

    } else {
        return ['lose', computerC];
    };
};

function computerChoiceGen() {
    const choices = [CHOICES.ROCK, CHOICES.PAPER, CHOICES.SCISSORS];
    const randIndex = Math.floor(Math.random() * choices.length);
    return choices[randIndex];
};

function addChoiceListeners(rock, paper, scissors) {
    rock.addEventListener('click', () => {
        handleUserChoice(CHOICES.ROCK);
        gamePlayHtmlRender(CHOICES.ROCK, computerChoice, result);
    });
    paper.addEventListener('click', () => {
        handleUserChoice(CHOICES.PAPER);
        gamePlayHtmlRender(CHOICES.PAPER, computerChoice, result);
    });
    scissors.addEventListener('click', () => {
        handleUserChoice(CHOICES.SCISSORS);
        gamePlayHtmlRender(CHOICES.SCISSORS, computerChoice, result);
    });
};

function resultUpdater(resultParam) {
    if (resultParam === 'win') {
        score.wins++
    } else if (resultParam === 'lose') {
        score.loses++
    } else if (resultParam === 'tie') {
        score.ties++
    } else {
        console.log('Error occurred!');
    };

    localStorage.setItem('scoreData', JSON.stringify(score));
    htmlRender();
};

function htmlRender() {
    yourScore.innerText = score.wins;
    computerScore.innerText = score.loses;
};

function scoreReset() {
    score = { wins: 0, loses: 0, ties: 0 };
    localStorage.setItem('scoreData', JSON.stringify(score));
    htmlRender();
};

function autoPlay() {
    const randNum = Math.random();
    let userC;

    if (randNum <= 1 / 3) {
        userC = 'rock';
    }
    else if (randNum > 1 / 3 && randNum <= 2 / 3) {
        userC = 'paper';
    }
    else if (randNum <= 1) {
        userC = 'scissors';
    }
    else {
        console.log('Error occurred!');
    };

    const intervalID = setInterval(() => {
        const value = gamePlay(userC);
        resultUpdater(value[0]);
    }, 500);

    return intervalID;
};

function scoreResetConfirm() {
    scoreResetConfirmelement.innerHTML = `
    <div class="confirm__text">
        Do you want to reset score?
    </div>
    <div class="confirm__btns">
        <div class="confirmYes__btn">Yes</div>
        <div class="confirmNo__btn">No</div>
    </div>
    `

    const confirmYesbtnElement = document.querySelector('.confirmYes__btn');
    const confirmNobtnElement = document.querySelector('.confirmNo__btn');

    confirmYesbtnElement.addEventListener('click', () => {
        scoreReset();
        scoreResetConfirmelement.innerHTML = ''
    });
    confirmNobtnElement.addEventListener('click', () => {
        scoreResetConfirmelement.innerHTML = ''
    });

    clearTimeout(confirmTimeout);
    confirmTimeout = setTimeout(() => {
        scoreResetConfirmelement.innerHTML = '';
    }, 5000);

};

function handleUserChoice(choice) {
    let value;
    scoreResetConfirmelement.innerHTML = '';
    clearInterval(inID);
    autoPlayElement.innerText = 'Auto Play';

    UserChoice = choice;
    value = gamePlay(UserChoice);

    result = value[0];
    computerChoice = value[1];
    resultUpdater(result);
}

function renderChoices() {
    gamePlayelement.innerHTML = `
            <div class="choices rock">
                <img src="./assets/icon-rock.svg" alt="">
            </div>
            <div class="choices paper">
                <img src="./assets/icon-paper.svg" alt="">
            </div>
            <div class="choices scissors">
                <img src="./assets/icon-scissors.svg" alt="">
            </div>
        `;

    let rockElement = document.querySelector('.rock');
    let paperElement = document.querySelector('.paper');
    let scissorsElement = document.querySelector('.scissors');

    addChoiceListeners(rockElement, paperElement, scissorsElement);;
}

function gamePlayHtmlRender(userC, computerC, stateResult) {
    gamePlayelement.classList.add('js-render');
    gamePlayelement.innerHTML = `
    <div class="you__picked picked">
        <div class="text">You Picked</div>
            <div class="choices js-choices">
            <img src="./assets/icon-${userC}.svg" alt="">
        </div>
    </div>

    <div class="game__state">
        <div class="winResult">You ${stateResult}!</div>
        <div class="playAgain">Play Again</div>
    </div>

    <div class="computer__picked picked">
        <div class="text">Computer Picked</div>
        <div class="choices js-choices">
            <img src="./assets/icon-${computerC}.svg" alt="">
        </div>
    </div>
    `;

    const playAgainElement = document.querySelector('.playAgain');

    playAgainElement.addEventListener('click', () => {
        renderChoices();
        clearInterval(inID);
        autoPlayElement.innerText = 'Auto Play';
    });
};

addChoiceListeners(rockElement, paperElement, scissorsElement);

scoreResetElement.addEventListener('click', () => {
    if (!scoreResetConfirmelement.innerHTML) {
        scoreResetConfirm();
        clearInterval(inID);
        autoPlayElement.innerText = 'Auto Play';
    } else {
        scoreResetConfirmelement.innerHTML = ''
    };
});

autoPlayElement.addEventListener('click', () => {
    if (autoPlayElement.innerText === 'Auto Play') {
        inID = autoPlay();
        autoPlayElement.innerText = 'Stop';
        scoreResetConfirmelement.innerHTML = ''
    } else {
        clearInterval(inID);
        autoPlayElement.innerText = 'Auto Play';
    }
});

bodyElement.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        renderChoices();
    }
    const choice = keyMap[event.key.toLowerCase()];
    if (choice) {
        handleUserChoice(choice);
        gamePlayHtmlRender(choice, computerChoice, result);
    } 
    if (event.key === 'Backspace') {
        if (!scoreResetConfirmelement.innerHTML) {
            clearInterval(inID);
            scoreResetConfirm();
            autoPlayElement.innerText = 'Auto Play';
        } else {
            scoreResetConfirmelement.innerHTML = '';
        }
    }
});
