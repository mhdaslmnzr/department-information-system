

const express = require("express");
const router = express.Router();

// dynamic rendering
const dotenv = require("dotenv");
const mysql = require("mysql");
const path = require("path");
// const fileupload = require("express-fileupload");
// const { type } = require("os");
// const { fstat } = require("fs");



dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});


//  <---------Dahboard--------->

router.get('/dashboard',(req,res) => {
    
    try {
        const id = req.user[0].USER_ID;
        db.query("SELECT * FROM NEWS_FEED ORDER BY news_date LIMIT 10",function(err,result) {
            db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,async function(err,user){ 
                res.render("student/studentView",{
                    user:user[0],
                    news:result
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});



//  <---------Results--------->

router.get('/results',(req,res) => {
    try {
        const id = req.user[0].USER_ID;
        db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,async function(err,user){ 
            res.render("student/result",{
                user:user[0]
            });    
        });
    } catch (error) {
        console.log(error)
    }
});


router.get('/getResult',(req,res) => {
    try {
        const id = req.user[0].USER_ID;
        const semester = req.query.sem;

        db.query("SELECT SCHEME FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,function(err,user){
            const scheme = user[0].SCHEME;
            db.query("SELECT SUB_NAME,SUB_CODE,CREDITS,TOTAL FROM SUBJECTS WHERE SEM = ? AND SCHEME = ?",[semester,scheme],function(err,result){
                
               var sub_codes = [];
               var sub_code = []
               var sub_names = [];
               var credits = [];
               var total = [];
               var grade = [];
               var points = [];

               for (let i=0;i<result.length;i++){
                   sub_code.push("`" + result[i].SUB_CODE + "`");
                   sub_codes.push(result[i].SUB_CODE);
                   sub_names.push(result[i].SUB_NAME);
                   credits.push(result[i].CREDITS);
                   total.push(result[i].TOTAL);
               }
               var string = sub_code.join(",");
               
               sql = "SELECT " + string + " FROM SEM_RESULTS WHERE REGISTER_NO = ?";
               db.query(sql,id,function(err,marks){

                   for (let i=0;i<result.length;i++){
                        const x = sub_codes[i]   
                        const p = (marks[0][x] * 100)/total[i];
                    
                        if (p >= 90){
                            grade.push("S");
                            points.push("10");
                        }
                            
                        else if(p >= 80){
                            grade.push("A");
                            points.push("9");
                        }
                        else if(p >= 70){
                            grade.push("B");
                            points.push("8");
                        }
                        else if(p >= 60){
                            grade.push("C");
                            points.push("7");
                        }
                        else if(p >= 50){
                            grade.push("D");
                            points.push("6");
                        }
                        else{
                            grade.push("F");
                            points.push("0");
                        }
                    }

                    let gpa = 0
                    const sum = credits.reduce((a,b)=>{
                        return a+b;
                    });

                    for (let i=0;i<result.length;i++){
                        gpa += ((points[i]*credits[i])/sum);
                    }
                    gpa = Math.round(gpa*100)/100;

                    var o = {}
                    var key = 'json object'
                    o[key] = [];

                    for(let i=0;i<result.length;i++){
                        x = sub_codes[i];
                        r = grade[i];
                        var remarks;
                        if (r != "F")
                            remarks = "PASS"
                        else  
                            remarks = "FAIL"  
                        data = {
                            Code    : sub_codes[i],
                            Name    : sub_names[i],
                            Mark    : marks[0][x],
                            Grade   : grade[i],
                            Remarks : remarks,
                            GPA     : gpa
                        }
                        o[key].push(data);
                    }
                    res.send(o[key]);
                });
            });  
        });
    } catch (error) {
        console.log(error);
    }
});


//  <---------Attendance--------->

router.get('/attendance',(req,res) => {
    try {
        const id = (req.user[0].USER_ID);
        db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,async function(err,user){
            res.render("student/attendance",{
                user:user[0]
            });
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/getAttendance',(req,res) => {
    
    try {
        const id = req.user[0].USER_ID;
        const semester = req.query.sem
        
        db.query("SELECT SCHEME FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,function(err,user){
            const scheme = user[0].SCHEME; 

            db.query("SELECT SUB_CODE,SUB_NAME,TOTAL_HRS FROM SUBJECTS WHERE SEM = ? AND SCHEME = ?",[semester,scheme],function (err,result) {
                var sub_code = [];
                for (let i=0;i<result.length;i++){
                    sub_code.push("`" + result[i].SUB_CODE + "`");
                }
                var string = sub_code.join(",");
                
                sql = "SELECT " + string + " FROM ATTENDANCE WHERE REGISTER_NO = ?";
                db.query(sql,id,function(err,attendance){

                    var o = {}
                    var key = 'json object'
                    o[key] = [];

                    for(let i=0;i<result.length;i++){

                        let x = result[i].SUB_CODE;
                        var remarks = "";
                        let percent = attendance[0][x] * (100/result[i].TOTAL_HRS);
                        if(percent < 75){
                            remarks = "Shortage"
                        }
                        else{
                            remarks = "OK"
                        }

                        data = {
                            Code        : result[i].SUB_CODE,
                            Name        : result[i].SUB_NAME,
                            Percent     : percent,
                            Total       : result[i].TOTAL_HRS,
                            Remarks     : remarks
                        }
                        o[key].push(data)
                    }
                    res.send(o[key]);
                });
            });
        });
    } catch (error) {
     console.log(error);   
    }
});


//  <---------Courses--------->

router.get('/courses',(req,res) => {
    try {
        const id = (req.user[0].USER_ID);
        db.query("SELECT * FROM COURSES WHERE REGISTER_NO = ?",id,function(err,data){
            db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,async function(err,user){
                res.render("student/courses",{
                    user:user[0],
                    course:data
                });
            });
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/addcourse',(req,res) => {

    try {
        const user_id = req.user[0].USER_ID;
        const {name,provider,nature,start_date,end_date} = req.body;
        if(start_date > end_date){
            return res.status(400).render('student/courses',{
                message:"Invalid Dates"
            })
        }

        var file = req.files.certificate;
        var file_name = file.name;

        if(file.mimetype == "application/pdf"){
            file.mv(process.env.ADDCOURSE+ file_name);
            file_path = process.env.UPCOURSE + file_name
            db.query("INSERT INTO COURSES VALUES (?,?,?,?,?,?,?,?);",[,user_id,name,provider,nature,start_date,end_date,file_path],function(err,data){
                return res.status(200).redirect('/student/courses')
            }); 
        }
        else{
            return res.status(400).render('student/courses',{
                message:"Only pdf format supported"
            })
        }
    } catch (error) {
        console.log(error);
    }
});


//  <---------Internships--------->

router.get('/internships',(req,res) => {
    try {
        const id = (req.user[0].USER_ID);
        db.query("SELECT COMPANY_NAME,FIELD,LOCATION,START_DATE,END_DATE,DATEDIFF(END_DATE,START_DATE) AS TOTAL_DAYS,CERTIFICATE FROM INTERNSHIPS WHERE REGISTER_NO = ?;",id,function(err,data){
            db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,async function(err,user){ 
                res.render("student/internship",{
                    user:user[0],
                    internship: data
                });
            });
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/addInternships',(req,res) => {
    
    try {
        const user_id = req.user[0].USER_ID;
        const {company_name,field,location,start_date,end_date} = req.body;

        if(start_date > end_date){
            return res.status(401).render('student/internship',{
                message : "Invalid dates"
            })
        }

        var file = req.files.certificate;
        var file_name = file.name;
        
        if (file.mimetype == "application/pdf"){
            file.mv(process.env.ADDINTERN + file_name);
            file_path = process.env.UPINTERN + file_name
            db.query("INSERT INTO INTERNSHIPS VALUES (?,?,?,?,?,?,?,?);",[,user_id,company_name,field,location,start_date,end_date,file_path],function (err,data){
                return res.status(200).redirect('/student/internships')
            })
        }
        else{
            return res.status(400).render('student/internship',{
                message:"Only pdf format supported"
            })
        }
    } catch (error) {
        console.log(error);
    }
});



//  <---------Request/Applications--------->

router.get('/requests',(req,res) => {

    try {
        const id = (req.user[0].USER_ID);
        db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,async function(err,user){ 
            db.query("SELECT * FROM REQUESTS WHERE id = ?",id,function(err,data){
                res.render("student/request",{
                    user:user[0],
                    data:data,
                });
            });   
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/apply',(req,res) => {
    
    try {
        const id = req.user[0].USER_ID;
        const {request,purpose} = req.body;
        
        var file = req.files.receipt;
        var file_name = file.name;
        if (file.mimetype == "application/pdf"){
            file.mv(process.env.ADDRECEIPTS + file_name);
            file_path = process.env.UPRECEIPTS + file_name
            db.query("INSERT INTO REQUESTS VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP);",[,id,request,purpose,"Pending",file_path],function (err,data){
                return res.status(200).redirect('/student/requests')
            })
            
        }
        else{
            return res.status(401).render('student/request',{
                message:"Only pdf format supported"
            })
        }
    } catch (error) {
        console.log(error);
    }
})



//  <---------CEE / Internal--------->

router.get('/internals',(req,res)=> {
    try {
        const id = (req.user[0].USER_ID);
        const semester = req.query.sem;
        db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,function(err,user){   
            res.render("student/internal",{
                user:user[0],
            });   
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/internalMarks', (req,res) => {

    try {
        const id = (req.user[0].USER_ID);
        const semester = req.query.sem;
    
        db.query("SELECT SEMESTER,SCHEME FROM STUDENT_PROFILE WHERE REGISTER_NO = ?;",id,function(err,data){
            const scheme = data[0].SCHEME; 

            db.query("SELECT SUB_NAME,SUB_CODE FROM SUBJECTS WHERE SEM = ? AND SCHEME = ?",[semester,scheme],function(err,codes){
                
                var sub_name = []
                var sub_codes = []
                var arrCodes1 = []
                for(let i=0;i<codes.length;i++){
                    sub_name.push(codes[i].SUB_NAME)
                    sub_codes.push(codes[i].SUB_CODE);
                    arrCodes1.push("`"+codes[i].SUB_CODE+"`");
                }
                var string = arrCodes1.join(',');

                let sql = "SELECT " + string + " FROM FIRST_INTERNALS WHERE REGISTER_NO = ?";
                db.query(sql,id,function(err,first){
                    
                    let sql1 = "SELECT " + string + " FROM SECOND_INTERNALS WHERE REGISTER_NO = ?";
                    db.query(sql1,id,function(err,second){

                        var o = {}
                        var key = 'json object'
                        o[key] = [];

                        for (let i=0;i<sub_codes.length;i++){
                            let x = sub_codes[i];
                            data = {
                                Code    : sub_codes[i],
                                Name    : sub_name[i],
                                First   : first[0][x],
                                Second  : second[0][x],
                                Total   : first[0][x] + second[0][x]
                            }
                            o[key].push(data)
                        }
                        res.send(o[key])
                    });
                });
            });        
        });
    } catch (error) {
        console.log(error);
    }
});




//  <---------Academic Details--------->

router.get("/academic",(req,res) => {
    try {
        const id = (req.user[0].USER_ID);
        db.query("SELECT * FROM STUDENT_ACADEMIC WHERE REGISTER_NO = ?",id, function(err,data){
            db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,function(err,user){     
                res.render("student/academic",{
                    user:user[0],
                    data:data
                });   
            });
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/addAcademic',(req,res) => {
    try {
        const user_id = req.user[0].USER_ID;
        const {qualifying,board,pass_out} = req.body;

        db.query("SELECT YEAR_OF_JOINING FROM STUDENT_PROFILE WHERE REGISTER_NO = ?;",user_id,function(err,year){
            let y = year[0].YEAR_OF_JOINING;
            if(pass_out > y){
                return res.status(401).render('student/academic',{
                    message : 'Invalid date entry'
                });
            }
    
            db.query("SELECT * FROM STUDENT_ACADEMIC WHERE REGISTER_NO = ? AND QUALIFYING_DEGREE=?",[user_id,qualifying],(err,result) => {
                if(result.length > 0){
                    return res.status(401).render('student/academic',{
                        message : 'File already submitted'
                    })
                }
                else{
    
                    var file = req.files.certificate;
                    var file_name = file.name;
                    
                    if (file.mimetype == "application/pdf"){
                        file.mv(process.env.ADDACADEMIC + file_name);
                        file_path = process.env.UPACADEMIC + file_name

                        db.query("INSERT INTO STUDENT_ACADEMIC VALUES (?,?,?,?,?,?);",[,user_id,qualifying,board,pass_out,file_path],function (err,data){
                            return res.status(200).redirect('/student/academic')
                        })
                    }
                    else{
                        return res.status(400).render('student/academic',{
                            message:"Only pdf format supported"
                        })
                    }
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/cert',(req,res) =>{

    try {
        const {cert} = req.query
        const id = req.user[0].USER_ID

        db.query("SELECT REGISTER_NO FROM STUDENT_ACADEMIC WHERE QUALIFYING_DEGREE=? AND REGISTER_NO = ?",[cert,id],function(err,result){
            if(result.length>0){
                res.send("Present")
            }
            else{
                res.send()
            }
            
        })
    } catch (error) {
        console.log(error);
    }
});




//<--------------------PERSONAL--------------------->

router.get('/personal',(req,res) => {
    
    try {
        const id = (req.user[0].USER_ID);
        db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",id,function(err,user){
            res.render("student/personal",{
                user : user[0]
            });     
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/updatePersonal',(req,res) => {

    try {
        const id = req.user[0].USER_ID;
        const {phone,email,address,post,district,state,pincode} = req.body;
        db.query("UPDATE STUDENT_PROFILE SET PHONE = ?,EMAIL = ?,ADDRESS = ?,POST = ?,DISTRICT = ?,STATE=?,PINCODE=? WHERE REGISTER_NO = ?;",[phone,email,address,post,district,state,pincode,id],function(err,data){
            return res.status(200).redirect('/student/personal');
        });  
    } catch (error) {
        console.log(error)
    }
});


router.get('/changePassword',(req,res) => {
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

module.exports = router;