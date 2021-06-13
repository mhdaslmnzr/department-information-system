
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' });
let jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// let middleware = require("../Middlewares/loginMiddleware");
//const { response } = require("express");

const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});

// Forgot password
var transporter = nodemailer.createTransport({
    service :   'gmail',
    auth    :   {
        user    :   process.env.USERGMAIL,
        pass    :   process.env.PASSGMAIL
    }
});

exports.login_student = async (req,res) => {
    try {
        
        const {user_id,password} = req.body;
        if (! user_id || ! password){
            console.log("some i/p missing");
            return res.status(401).render('Login',{
                stud_message: 'Please provide User ID and Password'
            });
            
        }

        db.query("SELECT * FROM LOGIN_STUD WHERE USER_ID=?;",user_id,(err,result) =>{
            if(err){
                res.send({err:err})
            }
            if (result.length > 0){
                bcrypt.compare(password,result[0].PASSWORD,(error,response) => {
                    if(response){
                        let token = jwt.sign({id:user_id},process.env.JWT_SECRET,{
                            expiresIn:'24h'
                        });
                        const cookieOptions = {
                            expires:new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                            ),
                            httpOnly:true
                        }
                        res.cookie('disjwt',token,cookieOptions);
                        return res.status(200).redirect("/student/dashboard")
                    } else{
                        return res.status(401).render("Login",{
                            stud_message: "Wrong User ID/Password"
                        });
                    }
                });
            }else{
                return res.status(401).render("Login",{
                    stud_message: "User does not exist"
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// exports.login_faculty = async (req,res) => {
//     try {
//         const {pen,password} = req.body;

//         if (! pen || ! password){
//             console.log("some i/p missing");
//             return res.status(401).render('index',{
//                 tchr_message: "Provide ID and Password"
//             });
//         }

//         db.query("SELECT * FROM LOGIN_TEACHER WHERE PEN_ID=?;",pen,(err,result) =>{
//             if(err){
//                 res.send({err:err})
//             }

//             if (result.length > 0){
//                 bcrypt.compare(password,result[0].PASSWORD,(error,response) => {
//                     if(response){
//                         //console.log("Success");
//                         let token = jwt.sign({pen:pen},process.env.JWT_SECRET,{
//                             expiresIn:'24h'
//                         });

//                         const cookieOptions = {
//                             expires:new Date(
//                                 Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
//                             ),
//                             httpOnly:true
//                         }

//                         res.cookie('disjwt',token,cookieOptions);
//                         // return res.json({
//                         //     success:true,
//                         //     message: 'Authentication Successfull',
//                         //     token:token
//                         //     });

//                         return res.status(200).redirect("/teacher/dashboard")
                        
                        
//                     } else{
//                         //res.send("Wrong username/Password");
//                         return res.status(401).render("index",{
//                             tchr_message: "Wrong ID/Password"
//                         });
//                     }
//                 });
//             }else{
//                 // res.send("user doesnot exist")
//                 return res.status(401).render("index",{
//                     tchr_message: "User does not exist"
//                 });
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };


exports.login_faculty = async (req,res) => {
    try {
        const {pen,password} = req.body;

        if (! pen || ! password){
            console.log("some i/p missing");
            return res.status(401).render('Login',{
                tchr_message: "Provide ID and Password"
            });
        }

        db.query("SELECT * FROM LOGIN_TEACHER WHERE PEN_ID=?;",pen,(err,result) =>{
            if(err){
                res.send({err:err})
            }

            if (result.length > 0){
                bcrypt.compare(password,result[0].PASSWORD,(error,response) => {
                    if(response){
                        
                        db.query("SELECT * FROM ADMIN WHERE ADMIN_ID = ?",pen,(err,results) => {
                            if(err){
                                res.send({err:err})
                            }
                            if (results.length > 0){

                                let token = jwt.sign({pen:pen},process.env.JWT_SECRET,{
                                    expiresIn:'24h'
                                });
        
                                const cookieOptions = {
                                    expires:new Date(
                                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                                    ),
                                    httpOnly:true
                                }
        
                                res.cookie('disjwt',token,cookieOptions);        
                                return res.status(200).redirect("/admin/dashboard");

                            } else{

                                let token = jwt.sign({pen:pen},process.env.JWT_SECRET,{
                                    expiresIn:'24h'
                                });
        
                                const cookieOptions = {
                                    expires:new Date(
                                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                                    ),
                                    httpOnly:true
                                }
        
                                res.cookie('disjwt',token,cookieOptions);
                                return res.status(200).redirect("/teacher/dashboard")
                                
                            }
                        })
                        
                    } else{
                        //res.send("Wrong username/Password");
                        return res.status(401).render("Login",{
                            tchr_message: "Wrong ID/Password"
                        });
                    }
                });
            }else{
                // res.send("user doesnot exist")
                return res.status(401).render("Login",{
                    tchr_message: "User does not exist"
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

exports.logout = (req,res) => {
    res.cookie('disjwt','',{maxAge : 1});
    res.redirect('/login');
}

exports.forgotPassword = async (req,res) => {
    console.log("hi");
    console.log(req.body);
    const {user_id} = req.body;

    db.query("SELECT REGISTER_NO,EMAIL FROM STUDENT_PROFILE WHERE REGISTER_NO = ? UNION SELECT PEN_ID,EMAIL FROM TEACHER_PROFILE WHERE PEN_ID = ?;",[user_id,user_id],function(err,result){
        console.log(err);
        console.log(result);

        let email = result[0].EMAIL;
        let id = result[0].REGISTER_NO;
        console.log(email);

        var mailOptions = {
            from    :   process.env.USERGMAIL,
            to      :   email,
            subject :   "Your password",
            text    :   "Hi " + id + ", Your current password is 'hello'. Please feel free to change if needed" 
        };

        transporter.sendMail(mailOptions,function(err,info){
            if(err)
                console.log(err);
            else    
                console.log("email sent " + info.response);
        });

        return res.status(200).redirect('/login')
    })
}