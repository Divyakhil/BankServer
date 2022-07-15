// import jsonwebtoken
const jwt = require("jsonwebtoken");

// import db.js
const db = require("./db");

// DATABASE
// db = {
//   1000: {
//     accno: 1000,
//     username: "Neer",
//     password: 1000,
//     balance: 5000,
//     transaction: [],
//   },
//   1001: {
//     accno: 1001,
//     username: "Laisha",
//     password: 1001,
//     balance: 5000,
//     transaction: [],
//   },
//   1002: {
//     accno: 1002,
//     username: "Ram",
//     password: 1002,
//     balance: 3000,
//     transaction: [],
//   },
// };

// register
const register = (username, accno, password) => {
  // asynchronous
  return db.User.findOne({
    accno,
  }).then((user) => {
    console.log(user);
    if (user) {
      return {
        status: false,
        message: "Already registered..please log in",
        statusCode: 401,
      };
    } else {
      // insert in db
      const newUser = new db.User({
        accno,
        username,
        password,
        balance: 0,
        transaction: [],
      });

      newUser.save();

      return {
        status: true,
        message: "Registered successfully",
        statusCode: 200,
      };
    }
  });
};
const login = (acno, pswd) => {
  return db.User.findOne({
    accno: acno,
    password: pswd,
  }).then((user) => {
    if (user) {
      console.log(user);
      currentUser = user.username;
      currentAcno = acno;
      // token generation
      token = jwt.sign(
        {
          // store acno inside token
          currentAcno: acno,
        },
        "supersecretkey12345"
      );

      return {
        status: true,
        message: "Login successfull",
        statusCode: 200,
        currentUser,
        currentAcno,
        token,
      };
    } else {
      return {
        status: false,
        message: "Invalid account number or Password!!",
        statusCode: 401,
      };
    }
  });
};

const deposit = (acno, password, amt) => {
  var amount = parseInt(amt);
  return db.User.findOne({
    accno: acno,
    password,
  }).then((user) => {
    if (user) {
      user.balance += amount;
      user.transaction.push({
        type: "CREDIT",
        amount: amount,
      });
      user.save();
      return {
        status: true,
        message:
          amount + " deposited successfully...New balance is " + user.balance,
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "Invalid account number or Password!!",
        statusCode: 401,
      };
    }
  });
};

const withdraw = (acno, password, amt) => {
  var amt1 = parseInt(amt);
  return db.User.findOne({
    accno: acno,
    password,
  }).then((user) => {
    if (user) {
      if (amt1 <= user.balance) {
        user.balance -= amt1;
        user.transaction.push({
          type: "DEBIT",
          amount: amt1,
        });
        user.save();
        return {
          status: true,
          message:
            amt1 + " debited successfully...New balance is " + user.balance,
          statusCode: 200,
        };
      } else {
        return {
          status: false,
          message: "Insufficient balance",
          statusCode: 422,
        };
      }
    } else {
      return {
        status: false,
        message: "Invalid account number or Password!!",
        statusCode: 401,
      };
    }
  });
};

// transaction
const getTransaction = (acno) => {
  return db.User.findOne({
    accno: acno,
  }).then((user) => {
    if (user) {
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction,
      };
    } else {
      return {
        status: false,
        message: "User does not exist",
        statusCode: 401,
      };
    }
  });
};

//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
};
