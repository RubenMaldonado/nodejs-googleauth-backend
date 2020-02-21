const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session')
const cookieParser = require('cookie-parser')

// Custom exports
const keys = require('./config/keys');

// Initiate express
const app = express();

// Load User Model
require('./models/User');

// Passport Conifg
require('./config/passport')(passport);

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('---> MongoDB Connected!!'))
.catch(err => console.log(err));

//Routes
const auth = require('./routes/auth')

app.get('/', (req, res) => {
  res.send('It Works!');
});

// Cookie Parser middleware
app.use(cookieParser())

// Session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next();
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`--> Server started on port ${port}`)
});