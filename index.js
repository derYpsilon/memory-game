const ySize = 4;
const xSize = 4;
const matrix = Array.from(Array(ySize), () => Array.from(Array(xSize), () => 0));
const theBoard = document.querySelector('.board');
const thePopUpMiss = document.querySelector('.miss');
const thePopUpWin = document.querySelector('.win');
const thePopUpStart = document.querySelector('.startup');
const playerScore = document.querySelector('.score');
const playAgain = document.querySelector('.one-more');
let firstFlag = { isChecked: false, cardID: 0 };
let secondFlag = { isChecked: false, cardID: 0 };
let theScore = 0;

function checkTheFreePlace(cellValue, xPos, yPos) {

    if (matrix[yPos][xPos] !== 0) return false;

    matrix[yPos][xPos] = cellValue;
    return true;
}

function fillMatrix() {
    let maxCellValue = xSize * ySize / 2;
    for (let i = 1; i <= maxCellValue; i++) {
        do {

        } while (!checkTheFreePlace(i, Math.trunc(Math.random() * xSize), Math.trunc(Math.random() * ySize)));
    }
}

function createTheBoard() {
    theBoard.style.gridTemplateColumns = `repeat(${xSize}, 1fr)`;
    for (let i = 1; i <= (xSize * ySize); i++) {
        let theCell = document.createElement('div');
        let a = Math.trunc((i - 1) / xSize);
        let b = i - (a * (xSize)) - 1;
        theCell.classList.add('cell');
        theCell.classList.add(`card_${matrix[a][b]}`);
        theCell.setAttribute('cellID', `${matrix[a][b]}`)
        theBoard.appendChild(theCell);
    }
    thePopUpStart.classList.add('popup_is-opened');
}

function removeSameCards() {
    let cardsToTurn = document.querySelectorAll('.checked');
    cardsToTurn[0].classList.remove('cell');
    cardsToTurn[0].classList.add('opened-cell');
    cardsToTurn[1].classList.remove('cell');
    cardsToTurn[1].classList.add('opened-cell');
}

function restoreCardsStatus() {
    let cardsToTurn = document.querySelectorAll('.checked');
    cardsToTurn[0].classList.remove('checked');
    cardsToTurn[1].classList.remove('checked');
    cardsToTurn.forEach(function (item) {
        item.classList.remove(`card_${firstFlag.cardID}`);
        item.classList.remove(`card_${secondFlag.cardID}`);
    })
    firstFlag.isChecked = false;
    secondFlag.isChecked = false;
    firstFlag.cardID = 0;
    secondFlag.cardID = 0;
}

function startGame(event) {
    if (event.target.classList.contains('button')) {
        thePopUpStart.classList.remove('popup_is-opened');
        let theCell = document.querySelectorAll('.cell');
        theCell.forEach(function (item) {
            for (let i = 1; i <= (xSize * ySize) / 2; i++) {
                item.classList.remove(`card_${i}`);
            }
        });
    }
}

function clickOnCard(event) {
    if (event.target.classList.contains('cell')) {
        if (!firstFlag.isChecked) {
            firstFlag.isChecked = true;
            event.target.classList.add('checked');
            firstFlag.cardID = event.target.getAttribute('cellID');
            event.target.classList.add(`card_${firstFlag.cardID}`);
            return;
        }
        if (firstFlag.isChecked && !secondFlag.isChecked && !event.target.classList.contains('checked')) {
            secondFlag.isChecked = true;
            event.target.classList.add('checked');
            secondFlag.cardID = event.target.getAttribute('cellID');
            event.target.classList.add(`card_${secondFlag.cardID}`);
        }

        if (firstFlag.isChecked && secondFlag.isChecked) {
            if (firstFlag.cardID === secondFlag.cardID) {
                addScore();
                thePopUpWin.classList.add('popup_is-opened');
                setTimeout(removePopUp, 800, thePopUpWin);
            }
            else {
                addScore();
                thePopUpMiss.classList.add('popup_is-opened');
                setTimeout(removePopUp, 800, thePopUpMiss);
            }
        }
    }
}

function addScore() {
    theScore++;
    playerScore.textContent = `Счет: ${theScore}`;
}

function isThePartyOver() {
    let theCell = document.querySelectorAll('.opened-cell');
    return theCell.length === xSize * ySize;
}

function oneMoreTime(event) {
    if (event.target.classList.contains('button')) {
        document.location.reload(true);
    }
}

function removePopUp(item) {
    item.classList.remove('popup_is-opened');
    if (item.classList.contains('miss')) {
        restoreCardsStatus();
        return;
    }
    if (item.classList.contains('win')) {
        removeSameCards();
        restoreCardsStatus();
        if (isThePartyOver()) playAgain.classList.add('popup_is-opened');
    }
}

fillMatrix(); // заполняем первую половину матрицы
fillMatrix(); // а теперь вторую

createTheBoard();
theBoard.addEventListener('click', clickOnCard);

thePopUpStart.addEventListener('click', startGame);
playAgain.addEventListener('click', oneMoreTime);
