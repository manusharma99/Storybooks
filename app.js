const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const app = express();

//body parser middlware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override
app.use(methodOverride("_method"));
//load user model
require("./models/Story");
require("./models/User");

// passport config
require("./config/passport")(passport);

// keys require
const keys = require("./config/keys");

//load helpers
const { truncate, formatDate, select, log } = require("./helpers/hbs");

// load routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

// map mongoose promise
mongoose.Promise = global.Promise;

// mongoose connect
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("mongodb is connected"))
  .catch(err => console.log(err));

/// handlebar middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      formatDate: formatDate,
      select: select,
      log: log
    },
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// set static file
app.use(express.static(path.join(__dirname, "public")));

// use routes
app.use("/auth", auth);
app.use("/", index);
app.use("/stories", stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening to port " + port);
});
