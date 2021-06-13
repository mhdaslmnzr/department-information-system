var port = process.env.PORT || 5002; 
const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
let middleware = require("./Middlewares/loginMiddleware");
const fileupload = require("express-fileupload");
const nodemailer = require("nodemailer");
const fs = require("fs-extra");
// const puppeteer = require("puppeteer");
//const pdf = require("html-pdf");

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});

const publicDircetory = path.join(__dirname,'./public');
app.use(express.static(publicDircetory));

app.use(express.urlencoded({ extended:false }));
app.use(express.json());

app.use(cookieParser());
app.use(fileupload());


app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views'));

db.connect( (error) => {

    if(error){
        console.log(error);
    }
    else{
        console.log("MYSQL Connected");
    }

});

app.get('/', (req, res) => {
    res.render("index")
  });

app.use('/login',require('./routes/home'));

app.use('/auth/student',require('./routes/auth'));
app.use('/auth/faculty',require('./routes/auth'));

app.use('/student',middleware.checkStudent,require('./routes/stdRoutes'));
app.use('/teacher',middleware.checkFaculty,require('./routes/facRoutes'));
app.use('/admin',middleware.checkFaculty,require('./routes/adminRoutes'));
// middleware.checkFaculty,
app.use('/logout',require('./routes/auth'));

app.use('/settings',middleware.checkStudent,require('./routes/passwords'))
app.use('/settingf',middleware.checkFaculty,require('./routes/passwords'))

app.listen(port,() => {
    console.log("Server started on port", +port);
});