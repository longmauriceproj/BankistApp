'use strict';

//Data
//assume we are getting data from web API where data typically comes in the form of objects
//simplified case without data and other information for each account balance transaction
const account1 = {
  owner: 'Maurice Long',
  transactions: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  transactionsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-12-10T17:01:17.194Z',
    '2021-12-11T23:36:17.929Z',
    '2021-12-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Zhao Kang',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  transactionsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//Elements - select them all here
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Functions
const formatTransactionsDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth()}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//NOTE: better to pass data into function instead of writing in global context
const displayTransactions = function (acc, sort = false) {
  //Empty container - innerHTML is similar to .textContent but returns all HTML code
  containerTransactions.innerHTML = '';
  //loop through account transactions to create transaction row elements

  const movs = sort
    ? acc.transactions.slice().sort((a, b) => a - b)
    : acc.transactions;

  movs.forEach(function (trans, i) {
    const type = trans > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.transactionsDates[i]);
    const displayDate = formatTransactionsDate(date);
    const html = `
    <div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">
      ${i + 1} ${type}
        </div>
        <div class="transactions__date">${displayDate}</div>
        <div class="transactions__value">${trans.toFixed(2)}€</div>
    </div>
  `;
    //insert transaction row elements into container
    containerTransactions.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.transactions.reduce((acc, trans) => acc + trans, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.transactions
    .filter(trans => trans > 0)
    .reduce((acc, trans) => acc + trans, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.transactions
    .filter(trans => trans < 0)
    .reduce((acc, trans) => acc + trans, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  //chaining methods can create performance issues, try to reduce number of methods to chain. Also bad practice to chain methods that mutate arrays
  const interest = acc.transactions
    .filter(trans => trans > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1) //Bank only pays out interest if interest is at least 1€
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//process: start by using a single account user i.e. 'Maurice Long' and making a username out of that string. Then generalize.
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  //display transactions
  displayTransactions(acc);
};

//Event Handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  const userInput = inputLoginUsername.value;
  const pinInput = Number(inputLoginPin.value);
  //emptying input fields
  inputLoginPin.value = inputLoginUsername.value = '';

  //look for account associated with username inputted in login
  currentAccount = accounts.find(acc => acc.username === userInput);
  //check if pin input is same as pin associated with account
  //use optional chaining ?. to make sure account exist
  if (currentAccount?.pin === pinInput) {
    //display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //display UI
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    //NOTE: will work on timer later
    //display current date and time (will implement timer later)
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    //make the pin input field not focused
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //empty input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  //check if input amount is positive
  //check if current account has enough funds
  //check that recipient is not current user
  //check if receiver account is valid
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc.username !== currentAccount.username
  ) {
    //add negative transaction to current user
    currentAccount.transactions.push(-amount);
    //add positive transaction to recipient
    receiverAcc.transactions.push(amount);
    //add transfer date
    currentAccount.transactionsDates.push(new Date().toISOString());
    receiverAcc.transactionsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  //NOTE: logic allows user to cheat as loans create higher deposit limit
  if (
    amount > 0 &&
    currentAccount.transactions.some(trans => trans >= amount * 0.1)
  ) {
    //add positve transaction to current data
    currentAccount.transactions.push(amount);
    //add transfer date
    currentAccount.transactionsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
    //clear input
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //check credentials
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete user from data
    accounts.splice(index, 1);
    //log user out (hide UI)
    inputClosePin.value = inputCloseUsername.value = '';
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});
