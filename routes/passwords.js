const express = require("express");
const router = express.Router();
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});


router.get('/student',(req,res) => {
    try {
        const id = req.user[0].USER_ID
        db.query("SELECT NAME,PROFILE_PICTURE,REGISTER_NO FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,function(err,result){
            res.render('Passwords/studPass',{
                user    :   result[0]
            })
        })
    } catch (error) {
        console.log(error);
    }
});

router.post('/changeStudent',(req,res) => {

    const id = req.user[0].USER_ID
    const {oldPass,newPass} = req.body;
    db.query("SELECT * FROM LOGIN_STUD WHERE USER_ID = ?",id,(err,result) => {
        if(err){
            res.send({err:err})
        }
        if(result.length > 0){
            bcrypt.compare(oldPass,result[0].PASSWORD,async (err,response) =>{
                if(response){
                    let hashedPassword = await bcrypt.hash(newPass,8)
                    db.query("UPDATE LOGIN_STUD SET PASSWORD = ? WHERE USER_ID = ?;",[hashedPassword,id],function(err,result){
                        return res.send({redirect:'/logout'});
                    })
                }
                else{
                    res.send("")
                }
            })
        }
    })
})



router.get('/faculty',(req,res) => {
    try {
        const id = req.user[0].PEN_ID
        db.query("SELECT NAME,PROFILE_PICTURE,DESIGNATION FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,result){
            res.render('Passwords/facPass',{
                user    :   result[0]
            })
        })
    } catch (error) {
        console.log(error);
    }
});

router.post('/changeFaculty',(req,res) => {

    const id = req.user[0].PEN_ID
    const {oldPass,newPass} = req.body;
    db.query("SELECT * FROM LOGIN_TEACHER WHERE PEN_ID = ?",id,(err,result) => {
        if(err){
            res.send({err:err})
        }
        if(result.length > 0){
            bcrypt.compare(oldPass,result[0].PASSWORD,async (err,response) =>{
                if(response){
                    let hashedPassword = await bcrypt.hash(newPass,8)
                    db.query("UPDATE LOGIN_TEACHER SET PASSWORD = ? WHERE PEN_ID = ?;",[hashedPassword,id],function(err,result){
                        return res.send({redirect:'/logout'});
                    })
                }
                else{
                    res.send("")
                }
            })
        }
    })
});


router.get('/admin',(req,res) => {
    try {
        const id = req.user[0].PEN_ID
        db.query("SELECT NAME,PROFILE_PICTURE FROM ADMIN WHERE ADMIN_ID = ?",id,function(err,result){
            res.render('Passwords/admin',{
                user    :   result[0]
            })
        })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;