const jwt = require("jsonwebtoken"); // importing jwt
const db = require("./db"); //importing db.js
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
  return db.Account.findOne({ account_no: acno }).then((acc) => {
    console.log(acc);
    if (acc) {
      return {
        status: false,
        message: "Account already exists!! Try Log in",
        statusCode: 404,
      };
    } else {
      let accnt = new db.Account({
        account_no: acno,
        name: uname,
        phone: phone,
        balance: 0,
        password: pswd,
        transaction: [],
      });
      accnt.save(); //by this method we are saving the data to db instead of insertOne method
      return {
        status: true,
        message: "Registration completed!",
        statusCode: 201,
      };
    }
  });
};

const login = (acno, pswd) => {
  return db.Account.findOne({
    account_no: acno,
    password: pswd,
  }).then((res) => {
    // console.log(res);
    if (res) {
      currentUser = res.name;
      currentAcno = acno;
      token = jwt.sign({ currentAcno: acno }, "secretsuperkey1234");
      return {
        status: true,
        message: "login successfull",
        statusCode: 200,
        currentUser,
        currentAcno,
        token,
      };
    } else {
      return {
        status: false,
        message: "invalid Password or Account number",
        statusCode: 400,
      };
    }
  });
};

const deposit = (acc, amnt, pass,req) => {
  return db.Account.findOne({
    account_no: acc,
    password: pass,
  }).then((res) => {
    if (res) {
      if(req.currentAcno!=res.account_no){
        return{
          status:false,
          message:'Given Acno is not authenticated',
          statusCode:422
        }
      }
     else {res.balance += parseInt(amnt);
      let history = { Type: "CREDIT", Amount: parseInt(amnt) };
      res.transaction.push(history);
      res.save();
      return {
        status: true,
        message: "Amount deposited to your account. Balance is :" + res.balance,
        statusCode: 200,
      };}
    } else {
      return {
        status: false,
        message: "Incorrect Account number or Password",
        statusCode: 400,
      };
    }
  });
};

const withdraw = (acc, amnt, pass) => {
  return db.Account.findOne({
    account_no: acc,
    password: pass,
  }).then((res) => {
    if (res) {
      if (res.balance >= amnt) {
        res.balance -= parseInt(amnt);
        let history = { Type: "Debit", Amount: parseInt(amnt) };
        res.transaction.push(history);
        res.save();
        return {
          status: true,
          message: `Withdrawal succesful! Current Balance : ${res.balance}`,
          statusCode: 200,
        };
      } else {
        return {
          status: false,
          message: "insufficient balance",
          statusCode: 422,
        };
      }
    } else {
      return {
        status: false,
        message: "Incorrect Account number or Password",
        statusCode: 400,
      };
    }
  });
};
const getTransaction = (acc) => {

    return db.Account.findOne({
      account_no:acc
    }).then(res=>{
      if(res){
        return {
              status: true,
              message: "success",
              data: res.transaction,
              statusCode: 200,
            };
      }
      else{
        return {
              status: false,
              message: "invalid acc (login required)",
              statusCode: 422,
            };
      }
    })

  };
  // if (acc in accounts) {
  //   return {
  //     status: true,
  //     message: "success",
  //     data: accounts[acc].transaction,
  //     statusCode: 200,
  //   };
  // } else {
  //   return {
  //     status: false,
  //     message: "invalid acc (login required)",
  //     statusCode: 422,
  //   };
  // }
    const delAccount =(acno)=>{
     return db.Account.deleteOne({account_no:acno}).then(res=>{
        if(res){
          return{
            status:true,
            message:'Deletion success',
            statusCode:200
          }
        }
        else{
          return {
            status:false,
            message:"deletion failed",
            statusCode:400
          }
        }
      })
    } 


module.exports = { register, login, deposit, withdraw, getTransaction,delAccount };
