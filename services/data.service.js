const jwt = require("jsonwebtoken"); // importing jwt

accounts = {
  1000: {
    account_no: 1000,
    name: "Arun",
    phone: 954826752,
    balance: 54222,
    password: "arun123",
    transaction: [],
  },
  1001: {
    account_no: 1001,
    name: "Akhil",
    phone: 954826749,
    balance: 64222,
    password: "akhil123",
    transaction: [],
  },
  1002: {
    account_no: 1002,
    name: "Raze",
    phone: 954826781,
    balance: 44222,
    password: "raze123",
    transaction: [],
  },
  1003: {
    account_no: 1003,
    name: "Viper",
    phone: 954826717,
    balance: 1222,
    password: "viper123",
    transaction: [],
  },
};

const register = (acno, uname, phone, pswd) => {
  if (acno in accounts) {
    return {
      status: false,
      message: "Account already exists!! Try Log in",
      statusCode: 404,
    };
  } else {
    accounts[acno] = {
      account_no: acno,
      name: uname,
      phone: phone,
      balance: 0,
      password: pswd,
      transaction: [],
    };
    console.log(accounts);
    return {
      status: true,
      message: "Registration completed!",
      statusCode: 201,
    };
  }
};

const login = (acno, pswd) => {
  if (acno in accounts) {
    if (accounts[acno].password == pswd) {
      currentUser = accounts[acno].name;
      currentAcno = acno;
      token = jwt.sign(
        //first parameter is acno of current user in key value pair model
        //second parameter is secret or private key
        { currentAcno: acno },
        "secretsuperkey1234"
      );
      return {
        status: true,
        message: "login successfull",
        statusCode: 200,
        currentUser,
        token,
      };
    } else {
      return {
        status: false,
        message: "invalid password",
        statusCode: 432,
      };
    }
  } else {
    return {
      status: false,
      message: "invalid account number",
      statusCode: 400,
    };
  }
};

const deposit = (acc, amnt, pass) => {
  if (acc in accounts) {
    if (accounts[acc].password == pass) {
      accounts[acc].balance += parseInt(amnt);
      let history = { Type: "CREDIT", Amount: parseInt(amnt) };
      accounts[acc].transaction.push(history);
      return {
        status: true,
        message: `Deposit succesfull! Balance is ${accounts[acc].balance}`,
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "incorrect password",
        statusCode: 400,
      };
    }
  } else {
    return {
      status: false,
      message: "incorrect account number",
      statusCode: 400,
    };
  }
};

const withdraw = (acc, amnt, pass) => {
  if (acc in accounts) {
    if (accounts[acc].password == pass) {
      if (accounts[acc].balance >= amnt) {
        accounts[acc].balance -= parseInt(amnt);
        let history = { Type: "Debit", Amount: parseInt(amnt) };
        accounts[acc].transaction.push(history);
        return {
          status: true,
          message: `Withdrawal succesful! Current Balance : ${accounts[acc].balance}`,
          statusCode: 200,
        };
      } else {
        //insuficcient balance
        return {
          status: false,
          message: "insufficient balance",
          statusCode: 422,
        };
      }
    } else {
      return {
        status: false,
        message: "incorrect password",
        statusCode: 400,
      };
    }
  } else {
    return {
      status: false,
      message: "incorrect account number",
      statusCode: 400,
    };
  }
};
const getTransaction = (acc) => {
  if (acc in accounts) {
    return {
      status: true,
      message: "success",
      data: accounts[acc].transaction,
      statusCode: 200,
    };
  } else {
    return {
      status: false,
      message: "invalid acc (login required)",
      statusCode: 422,
    };
  }
};
module.exports = { register, login, deposit, withdraw, getTransaction };



