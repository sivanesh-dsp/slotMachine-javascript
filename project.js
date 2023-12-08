// 1. deposit some initial amount
// 2. select number of lines
// 3. enter bet amount
// 4. spin the machine
// 5. check if won
// 6. give their winning amount
// 7. play again...?

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

//1. deposit some initial amount
const deposit = () => {
  while (true) {
    const depositAmount = parseFloat(prompt("Enter your deposit amount: "));

    if (isNaN(depositAmount) || depositAmount <= 0) {
      console.log("invalid amount, try again..");
    } else return depositAmount;
  }
};

//2. select number of lines
const getNumberOfLines = () => {
  while (true) {
    const numberOfLines = parseFloat(
      prompt("Enter the number of lines (1-3): ")
    );

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("invalid value, try again..");
    } else return numberOfLines;
  }
};

//3. enter bet amount
const getBetAmount = (balance, numberOfLines) => {
  while (true) {
    const betAmount = parseFloat(prompt("Enter the bet per line: "));

    if (
      isNaN(betAmount) ||
      betAmount <= 0 ||
      betAmount > balance / numberOfLines
    ) {
      console.log("invalid value, try again..");
    } else return betAmount;
  }
};

//4. spin the machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol); //adding symbols according to count
    }
  }
  const reels = [[], [], []];
  for (let i = 0; i < COLS; i++) {
    const reelsymbols = symbols; //duplicating symbols for manipulate
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelsymbols.length);
      const selectedSymbol = reelsymbols[randomIndex];
      reels[i].push(selectedSymbol); //adding selectedSymbol to reels
      // console.log(reels[i]);
      reelsymbols.splice(randomIndex, 1); //removing element from reelsymbols
      // console.log(reelsymbols);
    }
  }

  return reels;
};

//5. check if won
//5.1 Tranposing the array
const transpose = (reels) => {
  const rows = [[], [], []];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};
//5.2 Displaying the symbols
const printRows = (spinMachine) => {
  for (const row of spinMachine) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};
//5.3 check if won
const getWinnings = (spinMachine, bet, numberOfLines) => {
  let winnings = 0;
  for (let i = 0; i < numberOfLines; i++) {
    const symbols = spinMachine[i];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }

  return winnings;
};

//6. give their winning amount // 7.play again?
const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);

    const numberOfLines = getNumberOfLines();

    const bet = getBetAmount(balance, numberOfLines);
    balance -= bet * numberOfLines;

    const reels = spin();
    const spinMachine = transpose(reels);
    printRows(spinMachine);

    const winnings = getWinnings(spinMachine, bet, numberOfLines);
    balance += winnings;

    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You ran out of money!!");
      const addMoney = prompt("Want to add more money.. (y/n)? ");
      if (addMoney.toLowerCase() != "y") break;
      balance = deposit();
      continue;
    }

    const playAgain = prompt("Do you want to play again (y/n)? ");

    if (playAgain.toLowerCase() != "y") {
      console.log("Your total balance: " + balance);
      break;
    }
  }
};

game();
