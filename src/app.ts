'use strict';
import { Account } from "./types/AccountType";
import { Currency } from "./emums/Currency";
import { MovementFilter } from "./emums/MovementFilter";
import { rates } from "./constants/Rates";
import { AccountProperty } from "./emums/AccountProperty";
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value') as HTMLElement;
const labelSumIn = document.querySelector('.summary__value--in') as HTMLElement;
const labelSumOut = document.querySelector('.summary__value--out') as HTMLElement;
const labelSumInterest = document.querySelector('.summary__value--interest') as HTMLElement;
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements') as HTMLElement;

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// DISPAY TRANSATIONS 
const displayTranactions = (account: Account) => {
  // CLEAR CONTAINER
  containerMovements.innerHTML = '';
  // CREATE A TILE FOR EACH ACCOUNT MOVEMENT
  account.movements.forEach((mov, i) => {

    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;
    // RENDER TILES
    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}
// DISPLAY ACCOUNT BALANCE
const displayBalance = function (account: Account): void {
  const accountBalance = account.movements.reduce((acc, cur) => acc + cur, 0)
  labelBalance.textContent = `${accountBalance} EUR`
}

// CONVERT CURRENCY FUNCTION
const convertCurrancy = (amount: number, to: Currency, from: Currency): number => {
  const fromRate = rates[from];
  const toRate = rates[to];
  if (fromRate && toRate) {
    return (amount / fromRate) * toRate;
  } else {
    throw new Error('Invalid currency');
  }
}

// CONVERTED FROM EUR TO USD
const movementsUSD = movements.map((movement) => {
  return convertCurrancy(movement, Currency.USD, Currency.EUR)
})

// CREATE MOVEMENT TILE DATA
const movementsDisplay = (movements: number[]): string[] => {
  const movementTiles = movements.map((mov, i) => {
    return `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${mov}`
  })
  return movementTiles
}


// GERERATE USERNAMES
const createUserName = (accounts: Account[]): void => {
  accounts.forEach(account => {
    account.userName = account.owner.toLowerCase().split(' ').reduce((userName, name) => userName + name[0], '')
  });
}

// FILTER MOVEMENTS
const filterMovement = (account: Account, filter: MovementFilter): number[] | undefined => {
  switch (filter) {
    case MovementFilter.DEPOSIT:
      return account.movements.filter(mov => mov > 0)
    case MovementFilter.WITHDRAWAL:
      return account.movements.filter(mov => mov < 0)
    default:
      console.log('Invalid transaction type');
  }
}
const deposits = filterMovement(account1, MovementFilter.DEPOSIT)
const withdrawals = filterMovement(account2, MovementFilter.WITHDRAWAL)

// ACCOUNT BALANCE
const accountBalance = (account: Account): number => {
  return account.movements.reduce((acc, cur) => acc + cur, 0)
}


// MAX DEPOSIT
const maxDeposit = (account: Account): number => {
  const movements = account.movements
  return movements.reduce((acc, mov) => acc > mov ? acc : mov, movements[0])
}


// DISPLAY DEPOSIT SUMMARY
const displayDeposits = (account: Account): void => {
  const total = filterMovement(account, MovementFilter.DEPOSIT)?.reduce((acc, cur) => acc + cur, 0)

  labelSumIn.textContent = `${total}€`
}

// DISPLAY WITHDRAWL SUMMARY
const displayWidthdrawl = (account: Account): void => {
  const total = filterMovement(account, MovementFilter.WITHDRAWAL)?.reduce((acc, cur) => acc + cur, 0)

  labelSumOut.textContent = `${total}€`
}

// DISPLAY INTEREST SUMMARY
const displayInterestSummary = (account: Account): void => {
  const deposits = filterMovement(account, MovementFilter.DEPOSIT)  
  // TOTAL PAYMENTS
  const total =  deposits?.map(deposit => deposit * 0.012).reduce((acc, int) => acc + int, 0)
  //  DISPLAY SUM
  labelSumInterest.textContent = `${total}€`
}

displayDeposits(account1)
displayWidthdrawl(account1)
displayBalance(account1)
displayInterestSummary(account1)


// FIND ACCOUNT BY NAME

const findAccountBy = (accounts: Account[], by: AccountProperty, searchTerm: string): Account | undefined => {
  const account = accounts.find(acc => acc[by] === searchTerm)
  return account
}

const findAccountByName = (accounts: Account[] , owner: string): Account | undefined => {
  const account = accounts.find(acc => acc.owner === owner)
  return account
}


console.log(findAccountBy(accounts, AccountProperty.Owner, `Sarah Smith`))