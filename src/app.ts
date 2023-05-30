'use strict';
import { Account } from "./types/AccountType";
import { Currency } from "./emums/Currency";
import { MovementFilter } from "./emums/MovementFilter";
import { rates } from "./constants/Rates";
import { AccountProperty } from "./emums/AccountProperty";
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////
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


/////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////
const labelWelcome = <HTMLElement>document.querySelector('.welcome');
const labelDate = <HTMLElement>document.querySelector('.date');
const labelBalance = <HTMLElement>document.querySelector('.balance__value');
const labelSumIn = <HTMLElement>document.querySelector('.summary__value--in');
const labelSumOut = <HTMLElement>document.querySelector('.summary__value--out');
const labelSumInterest = <HTMLElement>document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = <HTMLElement>document.querySelector('.app');
const containerMovements = <HTMLElement>document.querySelector('.movements');

const btnLogin = <HTMLButtonElement>document.querySelector('.login__btn');
const btnTransfer = <HTMLButtonElement>document.querySelector('.form__btn--transfer');
const btnLoan = <HTMLButtonElement>document.querySelector('.form__btn--loan');
const btnClose = <HTMLButtonElement>document.querySelector('.form__btn--close');
const btnSort = <HTMLButtonElement>document.querySelector('.btn--sort');

const inputLoginUsername = <HTMLButtonElement>document.querySelector('.login__input--user');
const inputLoginPin = <HTMLInputElement>document.querySelector('.login__input--pin');
const inputTransferTo = <HTMLButtonElement>document.querySelector('.form__input--to');
const inputTransferAmount = <HTMLButtonElement>document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


/////////////////////////////////////////////////
// DISPAY FUNCTIONS
/////////////////////////////////////////////////
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

// DISPLAY DEPOSIT SUMMARY
const displayDeposits = (account: Account): void => {
  const total = filterMovement(account, MovementFilter.DEPOSIT)?.reduce((acc, cur) => acc + cur, 0)

  labelSumIn.textContent = `${total}€`
}

// DISPLAY WITHDRAWL SUMMARY
const displayWidthdrawls = (account: Account): void => {
  const total = filterMovement(account, MovementFilter.WITHDRAWAL)?.reduce((acc, cur) => acc + cur, 0)

  labelSumOut.textContent = `${total}€`
}

// DISPLAY INTEREST SUMMARY
const displayInterestSummary = (account: Account): void => {
  const deposits = filterMovement(account, MovementFilter.DEPOSIT)
  // TOTAL PAYMENTS
  const total = deposits?.map(deposit => deposit * (account.interestRate / 100)).reduce((acc, int) => acc + int, 0)
  //  DISPLAY SUM
  labelSumInterest.textContent = `${total}€`
}

const updateUI = (account: Account): void => {
  displayTranactions(account)
  displayBalance(account)
  displayDeposits(account)
  displayInterestSummary(account)
  displayWidthdrawls(account)
}

/////////////////////////////////////////////////
// RETURN FUNCTIONS
/////////////////////////////////////////////////

// RETURN ACCOUNT BALANCE
const accountBalance = (account: Account): number => {
  return account.movements.reduce((acc, cur) => acc + cur, 0)
}

// CREATE MOVEMENT TILE DATA
const movementsDisplay = (movements: number[]): string[] => {
  const movementTiles = movements.map((mov, i) => {
    return `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${mov}`
  })
  return movementTiles
}

// MAX DEPOSIT
const maxDeposit = (account: Account): number => {
  const movements = account.movements
  return movements.reduce((acc, mov) => acc > mov ? acc : mov, movements[0])
}

/////////////////////////////////////////////////
// CONVERSION FUNCTIONS
/////////////////////////////////////////////////

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


/////////////////////////////////////////////////
// UTILITY FUNCTIONS
/////////////////////////////////////////////////

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

/////////////////////////////////////////////////
// ACCOUNT FUNCTIONS
/////////////////////////////////////////////////


// FIND ACCOUNT BY NAME

const findAccountBy = (accounts: Account[], by: AccountProperty, searchTerm: string): Account | undefined => {
  const account = accounts.find(acc => acc[by] === searchTerm)
  return account
}

const findAccountByName = (accounts: Account[], owner: string): Account | undefined => {
  const account = accounts.find(acc => acc.owner === owner)
  return account
}


/////////////////////////////////////////////////
/// LOGIN IN FUNCTION
/////////////////////////////////////////////////

const handleLoginSuccess = (account: Account): void => {
  // DISPLAY UI AND MESSAGE
  labelWelcome.textContent = `Welcome back, ${account.owner.split(" ")[0]}`
  containerApp.style.opacity = '100';

  // UPDATE UI
  updateUI(account)

  // CLEAR INPUTS
  inputLoginPin.value = '';
  inputLoginUsername.value = '';
  // CLEAR FOCUS
  inputLoginPin.blur();
  inputLoginUsername.blur()
}


/////////////////////////////////////////////////
/// TRANSER FUNCTION
/////////////////////////////////////////////////

const handleTranferFunds = (fromAccount: Account, toAccount: Account, amount: number): void => {
  //subtract amount from acccount
  fromAccount.movements.push(-amount)
  toAccount.movements.push(amount)

  // refresh account
  updateUI(fromAccount)
}


/////////////////////////////////////////////////
/// EVENT HANDLERS
/////////////////////////////////////////////////

/// LOGIN IN BUTTON HANDLER
btnLogin.addEventListener('click', (e: Event) => {
  e.preventDefault()
  const userName = inputLoginUsername.value
  const pin = inputLoginPin.value
  if (!userName) {
    alert('Please enter your username');
    inputLoginUsername.focus()
    return;
  }

  if (!pin) {
    alert('please enter your pin');
    inputLoginPin.focus()
    return
  }
  // CHECK FOR ACCOUNT AND LOGIN
  const accountLookup = findAccountBy(accounts, AccountProperty.UserName, userName)
  if (+pin === accountLookup?.pin) {
    currentAccount = accountLookup
    handleLoginSuccess(currentAccount)
  } else {
    alert("Forgot your username or password?, click need help")
    inputLoginUsername.focus()
    return;
  }

})



btnTransfer.addEventListener("click", (e: Event) => {
  e.preventDefault()

  // SET INPUTS
  const amount = +inputTransferAmount.value
  const to = inputTransferTo.value

  // FIND RECIPENT ACCOUNT
  const toAccount = findAccountBy(accounts, AccountProperty.UserName, to)

  // CHECK FOR VALID ACCOUNT
  if (!toAccount || currentAccount?.userName === to) {
    alert('Please enter a valid username')
    inputTransferTo.focus()
    return
  }

  // GET CURRENT BALANCE
  const currentBal = accountBalance(currentAccount!)

  // VERIFY BALANCE
  if (amount > currentBal || currentBal <= 0) {
    alert(`insufficent funds`)
    return
  }

  // Handle Transfer
  handleTranferFunds(currentAccount!, toAccount, amount)

})

/// TRANSER FUNDS HANDLER
const transerFundsHandler = () => {

}




/////////////////////////////////////////////////
// APP INIT FUNCTIONS
/////////////////////////////////////////////////

// GERERATE USERNAMES
const createUserNames = (accounts: Account[]): void => {
  accounts.forEach(account => {
    account.userName = account.owner.toLowerCase().split(' ').reduce((userName, name) => userName + name[0], '')
  });
}

const handleAddFunds = (account: Account) => {

}


/////////////////////////////////////////////////
/// START APPLICATION 
/////////////////////////////////////////////////
// CURRENT ACCOUNT
let currentAccount: Account | undefined;
// ASSIGN USERNAMES TO ACCOUNTS
createUserNames(accounts);