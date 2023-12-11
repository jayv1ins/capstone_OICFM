const createError = require("http-errors");
const express = require("express");
const port = 3000;
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
//-------------------------------------------------------------------------------------
const { exec } = require("child_process");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Guns
const dTableRoutes = require("./routes/guns/dTable");
const createRoutes = require("./routes/guns/create");
const editRoutes = require("./routes/guns/edit");
const selectRoutes = require("./routes/guns/select");
const scannerRoutes = require("./routes/guns/scanner");

app.use("/", dTableRoutes);
app.use("/", createRoutes);
app.use("/", editRoutes);
app.use("/", selectRoutes);
app.use("/", scannerRoutes);

//Account
const loginRoutes = require("./routes/accounts/login");
const registerRoutes = require("./routes/accounts/register");
const logoutRoutes = require("./routes/accounts/logout");
const editManagerRoutes = require("./routes/accounts/editManager");
//Admin
const aCreateRoutes = require("./routes/accounts/admin/create");
const aTableRoutes = require("./routes/accounts/admin/table");
const aEditRoutes = require("./routes/accounts/admin/edit");

app.use("/", loginRoutes);
app.use("/", registerRoutes);
app.use("/", logoutRoutes);
app.use("/", editManagerRoutes);
//Admin
app.use("/", aCreateRoutes);
app.use("/", aTableRoutes);
app.use("/", aEditRoutes);

//etc
const indexRoutes = require("./routes/index");
const helpRoutes = require("./routes/help");

app.use("/", helpRoutes);
app.use("/", indexRoutes);

//---------------------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  exec("start http://localhost:3000/login");
});

module.exports = app;
