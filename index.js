const express = require("express"); // imported express framework
const dataservice = require("./services/data.service");
const jwt = require("jsonwebtoken");
const app = express(); // created server application
app.use(express.json()); // to parse json to js
const appMiddleware = (req, res, next) => {
  try {
    token = req.headers["x-access-token"];
    res = jwt.verify(token, "secretsuperkey1234");
    console.log(res);
    next();
  } catch {
    res.status(400).json({
      status: false,
      message: "Invalid user... Please login!!",
      statusCode: 400,
    });
  }
  
};

// app.use(appMiddleware);
//resolving request
//REGISTER API
app.post("/register", (req, res) => {
  const result = dataservice.register(
    req.body.acno,
    req.body.uname,
    req.body.phone,
    req.body.pswd
  );
  // if (result.status == true) {
  //   res.status(result.statusCode).json(result);
  // } else {
  //   res.status(result.statusCode).json(result);
  // }
  res.send('success')
});

//LOGIN API

app.post("/login", (req, res) => {
  const result = dataservice.login(req.body.acno, req.body.pswd);
  res.status(result.statusCode).json(result);
});

//DEPOSIT API
app.post("/deposit", appMiddleware, (req, res) => {
  const result = dataservice.deposit(
    req.body.acc,
    req.body.amnt,
    req.body.pass
  );
  res.status(result.statusCode).json(result);
});

//  WITHDRAW API
app.post("/withdraw",appMiddleware, (req, res) => {
  const result = dataservice.withdraw(
    req.body.acc,
    req.body.amnt,
    req.body.pass
  );
  res.status(result.statusCode).json(result);
});

//transaction API
app.post("/transact",appMiddleware, (req, res) => {
  const result = dataservice.getTransaction(req.body.acc);
  res.status(result.statusCode).json(result);
});

// configuring port number for server app
app.listen(3000, () => {
  console.log("server running on port 3000");
});
