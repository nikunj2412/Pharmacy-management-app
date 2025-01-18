const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes')
const cors = require('cors');
const sendResponse = require('./middleware/sendResponse');
const { errorConverter, errorHandler } = require('./middleware/error');
const path = require('path');
require("dotenv").config();

const app = express();


mongoose.connect(
  process.env.MONGO_URL ,
  { useNewUrlParser: true }
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(sendResponse);

app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, '../public')));

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
app.use(passport.session());

app.use('/v1', routes);
app.use(errorConverter);
app.use(errorHandler);

app.listen(process.env.PORT,()=>{

    console.log("**** Server is listening at port  !!!! ***")
})
