'use strict';

//Data
//assume we are getting data from web API where data typically comes in the form of objects
//simplified case without data and other information for each account balance transaction
const account1 = {
  owner: 'Maurice Long',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, //%
  pin: 1111, //security credential
};

const account2 = {
  owner: 'Zhao Kang',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5, //%
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

//NOTE: better to pass data into function instead of writing in global context
const displayTransactions = function (transactions) {
  //Empty container - innerHTML is similar to .textContent but returns all HTML code
  containerTransactions.innerHTML = '';
  //loop through account transactions to create transaction row elements
  transactions.forEach(function (trans, i) {
    const type = trans > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">
      ${i + 1} ${type}
        </div>
        <div class="transactions__value">${trans}</div>
    </div>
  `;
    //insert transaction row elements into container
    containerTransactions.insertAdjacentHTML('afterbegin', html);
  });
};
displayTransactions(account1.transactions);

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
