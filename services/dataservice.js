// import jsonwebtoken
const jwt=require('jsonwebtoken')

// DATABASE
db = {
  1000: {
    accno: 1000,
    username: "Neer",
    password: 1000,
    balance: 5000,
    transaction: [],
  },
  1001: {
    accno: 1001,
    username: "Laisha",
    password: 1001,
    balance: 5000,
    transaction: [],
  },
  1002: {
    accno: 1002,
    username: "Ram",
    password: 1002,
    balance: 3000,
    transaction: [],
  },
};

// register
const register = (username, acno, password) => {
  if (acno in db) {
    return {
      status: false,
      message: "Already registered..please log in",
      statusCode: 401,
    };
  } else {
    db[acno] = {
      acno,
      username,
      password,
      balance: 0,
      transaction: [],
    };

    return {
      status: true,
      message: "Registered successfully",
      statusCode: 200,
    };
  }
};

const login = (acno, pswd) => {
  if (acno in db) {
    if (pswd == db[acno]["password"]) {
      currentUser = db[acno]["username"];
      currentAcno = acno;
      // token generation
     token= jwt.sign({
        // store acno inside token
        currentAcno:acno
      },'supersecretkey12345')


      return {
        status: true,
        message: "Login successfull",
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      };
    } else {
      return {
        status: false,
        message: "incorrect password",
        statusCode: 401,
      };
    }
  } else {
    return {
      status: false,
      message: "User does not exist",
      statusCode: 401,
    };
  }
};

const deposit = (acno, password, amt) => {
  var amount = parseInt(amt);

  if (acno in db) {
    if (password == db[acno]["password"]) {
      db[acno]["balance"] += amount;
      db[acno].transaction.push({
        type: "CREDIT",
        amount: amount,
      });
      return {
        status: true,
        message:
          amount +
          " deposited successfully...New balance is " +
          db[acno]["balance"],
        statusCode: 200,
      };
    }
  } else {
    return {
      status: false,
      message: "User does not exist",
      statusCode: 401,
    };
  }
};

const withdraw=(acno, password, amt)=> {
  var amt1 = parseInt(amt);

  if (acno in db) {
    if (password == db[acno]["password"]) {
      if (amt1 <= db[acno]["balance"]) {
        db[acno]["balance"] -= amt1;
        db[acno].transaction.push({
          type:"DEBIT",
          amount:amt1
        })
       
        return{
          status: true,
        message:
          amt1 +
          " debited successfully...New balance is " +
          db[acno]["balance"],
        statusCode: 200,
        }
      } else {
        
        return{
          status: false,
      message:'Insufficient balance' ,
      statusCode: 422,
        }
      }
    } else {
      return {
        status: false,
        message: "incorrect password",
        statusCode: 401,
      };
    }
  } else {
    return{
      status: false,
      message: "User does not exist",
      statusCode: 401,
    }
  }
}

// transaction
const getTransaction=(acno)=>{
  if(acno in db){
    return{
      status:true,
      statusCode:200,
      transaction:db[acno].transaction
    }
  }
  else{
    return{
      status: false,
      message: "User does not exist",
      statusCode: 401,
    } 
  }
}

//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction
};
