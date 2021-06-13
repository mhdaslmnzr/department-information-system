const express = require("express");
const router = express.Router();
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
// const fs = require("fs");
// const { Console } = require("console");

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});

//  <-----------DASHBOARD----------->

router.get('/dashboard',(req,res) => {
    try {
        const id = (req.user[0].PEN_ID);
        db.query("SELECT * FROM NEWS_FEED ORDER BY news_date LIMIT 10",function(err,result) {
            db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,async function(err,user){
                res.render("teacher/facultyView",{
                    user:user[0],
                    news:result
                });
            });
        }); 
    } catch (error) {
        console.log(error);
    }
});

//  <-----------STUDENT LIST----------->

router.get('/studentList',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){
            var image = "/user_displayProfile/" + user[0].profile_picture; 
            res.render("teacher/studentList",{
                user:user[0],
                img: image,
            });    
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/getList',(req,res) => {
    try {
        const id = req.user[0].PEN_ID;
        const sem = req.query.sem;
        db.query("SELECT ROLL_NO,NAME,REGISTER_NO,DIVISION FROM STUDENT_PROFILE WHERE SEMESTER = ? ",sem,function (err,result){
            if(result.length > 0){
                res.send(result);
            }
            else{
                res.send();
            }
        });
    } catch (error) {
        console.log(error);
    }
});


//  <-----------Research Students----------->

router.get('/research',(req,res) => {
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM RESEARCH_STUDENTS WHERE PEN_ID = ?",id,function(err,result){
            db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){ 
                res.render("teacher/research",{
                    user:user[0],
                    data : result
                });    
            });
        })
    } catch (error) {
        console.log(error);
    }
});

router.post('/newStudent',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        const {name,reg_no,area,joined_on} = req.body;
        db.query("INSERT INTO RESEARCH_STUDENTS VALUES (?,?,?,?,?)",[reg_no,name,area,joined_on,id],function(err,result){
            return res.status(200).redirect('/teacher/research');
        }); 
    } catch (error) {
        console.log(error);
    }
});

router.post('/checkStudent',(req,res)=>{
    try {
        const{reg_no} = req.body
        db.query("SELECT REG_NO FROM RESEARCH_STUDENTS WHERE REG_NO = ?",reg_no,function(err,result){
            if(result.length > 0)
                res.send("Already added");
            else
                res.send("")
        });
    } catch (error) {
        console.log(error);
    }
})


//  <-----------Upload Internal----------->

router.get('/internals',(req,res) => {
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,async function(err,user){
            db.query("SELECT SUB_CODE,SUB_NAME, SEM FROM SUBJECTS WHERE DIV_A = ? OR DIV_B = ? ORDER BY SEM",[id,id],function(err,result){
                res.render("teacher/internal",{
                    user:user[0],
                    sub : result
                });   
            })
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/getStudents',(req,res) => {
    
    try {
        const value = req.query.sub_code;
        let code = value.split('|')[0]
        let name = value.split('|')[1]
        const id = req.user[0].PEN_ID;
        db.query("SELECT SEM,SCHEME FROM SUBJECTS WHERE SUB_CODE = ?",code,function(err,result){
            const sem = result[0].SEM;
            db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE SEMESTER = ? ORDER BY ROLL_NO",sem,function(err,user){
                db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,profile){
                    res.render("teacher/internal",{
                        user        :   profile[0], 
                        data        :   user,
                        code        :   code,
                        sub_name    :   name
                    });    
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/showInternal',(req,res) => {

    try {
        const{sub_code,number,date,reg_no,marks} = req.query
        var Internal;
        if (number == 'first')
            Internal = "First Internal Marks"
        else
            Internal = "Second Internal Marks"

        var o = {}
        var key = 'json object'
        o[key] = [];
        for (let i=0;i<reg_no.length;i++){
            data = {
                reg_no  :   reg_no[i],
                marks   :   marks[i],
            }
            o[key].push(data);
        }
        res.render('teacher/internalConfirm',{
            data    :   o[key],
            number  :   Internal,
            date    :   date,
            subject :   sub_code
        })
    } catch (error) {
        console.log(error);
    }
});


router.post('/uploadInternal',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        const {number,sub_code,date,reg_no,marks} = req.body
        var o = {}
        var key = 'json object'
        o[key] = [];

        for (let i=0;i<reg_no.length;i++){

            data = {
                reg_no  :   reg_no[i],
                marks   :   marks[i],
            }
            o[key].push(data);
        }
        let result = o[key];
        
        if (number == 'First Internal Marks'){

            for (let i=0;i<result.length;i++){

                let r = parseInt(result[i].reg_no) 
                let m = parseInt(result[i].marks)

                sql = "UPDATE FIRST_INTERNALS SET `" + sub_code + "` = ? WHERE REGISTER_NO = ?";
                db.query(sql,[m,r],function(err,data){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
        else{
            
            for (let i=0;i<result.length;i++){

                let r = parseInt(result[i].reg_no) 
                let m = parseInt(result[i].marks)

                sql = "UPDATE SECOND_INTERNALS SET `" + sub_code + "` = ? WHERE REGISTER_NO = ?";
                db.query(sql,[m,r],function(err,data){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
        return res.status(303).redirect('/teacher/internals');
    } catch (error) {
        console.log(error);
    }
});




//  <-----------Publications----------->

router.get('/publication',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM PUBLICATIONS WHERE PEN_ID = ? ORDER BY YEAR",id,function(err,result) {
            db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){
                res.render("teacher/publications",{
                    user    :   user[0],
                    data    :   result 
                });    
            });
        })
    } catch (error) {
        console.log(error);
    }
});


router.post('/addPublication',(req,res) => {

    try {
        const id = req.user[0].PEN_ID;
        const {title,name,ISBN,year} = req.body;
        
        db.query("INSERT INTO PUBLICATIONS VALUES (?,?,?,?,?)",[id,title,name,ISBN,year],function (err,result){
            return res.status(200).redirect('/teacher/publication');
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/checkPublication',(req,res)=>{
    try {
        const{isbn} = req.body;
        db.query("SELECT ISBN FROM PUBLICATIONS WHERE ISBN = ?",isbn,function(err,result){
            if(result.length > 0)
                res.send("Duplicate Entry")
            else
                res.send("")
        });
    } catch (error) {
        console.log(error);
    }
});


//  <-----------Upload Attendance----------->

router.get('/attendance',(req,res) =>{
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,async function(err,user){
            db.query("SELECT SUB_CODE,SUB_NAME, SEM FROM SUBJECTS WHERE DIV_A = ? OR DIV_B = ? ORDER BY SEM",[id,id],function(err,result){
                res.render("teacher/attendance",{
                    user:user[0],
                    sub : result
                });   
            })
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/getDetails',(req,res) => {
    
    try {
        const value = req.query.sub_code;
        let code = value.split('|')[0]
        let name = value.split('|')[1]
        const id = req.user[0].PEN_ID;
        db.query("SELECT SUB_NAME,SEM,SCHEME FROM SUBJECTS WHERE SUB_CODE = ?",code,function(err,result){
            const sem = result[0].SEM;
            db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE SEMESTER = ?",sem,function(err,user){
                db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,profile){
                    res.render("teacher/attendance",{
                        user        :   profile[0],
                        data        :   user,
                        code        :   code,
                        sub_name    :   name 
                    });    
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/showAttendance',(req,res) => {
    
    try {
        const{sub_code,month,hrs,reg_no,present} = req.query;
        var o = {}
        var key = 'json object'
        o[key] = [];

        for (let i = 0;i < reg_no.length; i++){
            data = {
                reg_no  :   reg_no[i],
                present :   present[i],
                absent  :   hrs - present[i],
                total   :   hrs,
                percent :   present[i] *(100/hrs)
            }
            o[key].push(data);
        }
        res.render('teacher/attendanceConfirm',{
            data    :   o[key],
            date    :   req.query.month,
            subject :   req.query.sub_code,
            total   :   req.query.hrs
        })
    } catch (error) {
        console.log(error);
    }
});


router.post('/UploadAttendance',(req,res) => {
    
    try {    
        const {sub_code,month,total,reg_no,present} = req.body;

        var o = {}
        var key = 'json object'
        o[key] = [];

        for (let i=0;i<reg_no.length;i++){

            data = {
                reg_no  :   reg_no[i],
                present :   present[i],
            }
            o[key].push(data);
        }
        result = o[key];

        for (let i=0;i<result.length;i++){

            let r = parseInt(result[i].reg_no) 
            let p = parseInt(result[i].present)

            sql = "UPDATE ATTENDANCE SET `" + sub_code + "` = ? WHERE REGISTER_NO = ?";
            db.query(sql,[p,r],function(err,data){
                if(err){
                    console.log(err);
                }
            });
        }
        return res.status(200).redirect('/teacher/attendance');
    } catch (error) {
        console.log(error);
    }
});


// <------------------Question Papers------------------>


router.get('/questionPapers',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
            db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){
                res.render("teacher/qp",{
                    user    :   user[0]
                });    
            });
    } catch (error) {
        console.log(error);
    }
});




// <------------------Refreshser Course------------------>

router.get('/refresherCourse',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM REFRESHERCOURSE WHERE PEN_ID = ? AND TYPE = ?",[id,"Refresher Course"],function(err,result) {
            db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){ 
                res.render("teacher/refresher",{
                    user    :   user[0], 
                    data    :   result 
                });    
            });
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/addCourse',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        const {name,type,topic,date,total_days} = req.body;

        var file = req.files.certificate;
        var file_name = file.name;
        if(file.mimetype == "application/pdf"){
            file.mv(process.env.ADDREFRESHER + file_name);
            file_path = process.env.UPREFRESHER + file_name

            db.query("INSERT INTO REFRESHERCOURSE VALUES (?,?,?,?,?,?,?);",[id,name,type,topic,date,total_days,file_path],function(err,data){
                return res.status(200).redirect('/teacher/refresherCourse')
            }); 
        }
        else{
            return res.status(417).render('teacher/refresher',{
                message:"Only pdf format supported"
            })
        }
    } catch (error) {
        console.log(error);
    }
});

// <------------------Seminars------------------>


router.get('/seminar',(req,res)=>{
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM REFRESHERCOURSE WHERE PEN_ID = ? AND TYPE != ?",[id,"Refresher Course"],function(err,result) {
            db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){ 
                res.render("teacher/seminars",{
                    user    :   user[0], 
                    data    :   result 
                });    
            });
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/addEvent',(req,res) =>{
    try {
        const id = req.user[0].PEN_ID
        const{name,type,topic,date,total} = req.body;

        db.query("INSERT INTO REFRESHERCOURSE VALUES (?,?,?,?,?,?,?)",[id,name,type,topic,date,total,"NO CERTIFICATE"],function(err,result){
            return res.status(200).redirect('/teacher/seminar');
        })
    } catch (error) {
        console.log(error)
    }
});

// <------------------Application / Request------------------>

router.get('/requests',(req,res) => {
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,user){
            db.query("SELECT * FROM REQUESTS WHERE id = ?",id,function(err,data){
                res.render("teacher/requests",{
                    user:user[0],
                    data:data,
                });
            });   
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/apply',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        const {request,purpose} = req.body;
        var file = req.files.certificate;
        var file_name = file.name;
        
        if (file.mimetype == "application/pdf"){
            file.mv(process.env.ADDRECEIPTS + file_name);
            file_path = process.env.UPRECEIPTS + file_name
            
            db.query("INSERT INTO REQUESTS VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP);",[,id,request,purpose,"Pending",file_path],function (err,data){
                return res.status(200).redirect('/teacher/requests')
            })
        }
        else{
            return res.status(401).render('teacher/requests',{
                message:"Only pdf format supported"
            })
        }
    } catch (error) {
        console.log(error);
    }
});



// <------------------Personal Details------------------>


router.get('/personal',(req,res) => {

    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,async function(err,user){
            res.render("teacher/personal",{
                user:user[0],
            });   
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/updatePersonal',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        const {phone,email,address,post,district,state,pincode} = req.body;

        db.query("UPDATE TEACHER_PROFILE SET PHONE = ?,EMAIL = ?,ADDRESS = ?,POST = ?,DISTRICT = ?,STATE=?,PINCODE=? WHERE PEN_ID = ?;",[phone,email,address,post,district,state,pincode,id],function(err,data){
            return res.status(200).redirect('/teacher/personal');
        });
    } catch (error) {
        console.log(error)
    }
});


// <------------------Attendance View------------------>

router.get('/viewAttendance',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,async function(err,user){
            db.query("SELECT SUB_CODE,SUB_NAME, SEM FROM SUBJECTS WHERE DIV_A = ? OR DIV_B = ? ORDER BY SEM",[id,id],function(err,result){
                res.render("teacher/attendanceList",{
                    user:user[0],
                    sub : result
                });   
            });
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/AttendanceList',(req,res) => {
    
    try {
        const id  = req.user[0].PEN_ID;
        const code = req.query.sub_code;
        db.query("SELECT SEM,SCHEME,TOTAL_HRS FROM SUBJECTS WHERE SUB_CODE = ?",code,function(err,result){
            const sem = result[0].SEM;
            const scheme = result[0].SCHEME;
            const total = result[0].TOTAL_HRS
            
            db.query("SELECT REGISTER_NO,ROLL_NO,NAME FROM STUDENT_PROFILE WHERE SEMESTER = ? AND SCHEME = ? ORDER BY ROLL_NO",[sem,scheme],function(err,user){

                if(user.length>0){
                    let reg = [];
                    for (let i=0;i<user.length;i++){
                        reg.push(user[i].REGISTER_NO);
                    }
                    var string = reg.join(",")
                    sql = "SELECT REGISTER_NO,`" + code +"` FROM ATTENDANCE WHERE REGISTER_NO IN (" + string + ")";
                    
                    db.query(sql,function(err,attendance){

                        var o = {}
                        var key = 'json object'
                        o[key] = [];

                        for(let i=0;i<attendance.length;i++){

                            data = {
                                Roll_No         :   user[i].ROLL_NO,
                                Register_No     :   user[i].REGISTER_NO,
                                Name            :   user[i].NAME,
                                Present         :   attendance[i][code],
                                Absent          :   total - attendance[i][code],
                                Total           :   total  
                            }
                            o[key].push(data)
                        }
                        res.send(o[key])
                    });
                } else{
                    res.send("");
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
});


// <------------------Internals View------------------>

router.get('/viewInternals',(req,res) => {
    
    try {
        const id = req.user[0].PEN_ID;
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,async function(err,user){
            db.query("SELECT SUB_CODE,SUB_NAME, SEM FROM SUBJECTS WHERE DIV_A = ? OR DIV_B = ? ORDER BY SEM",[id,id],function(err,result){
                res.render("teacher/internalsView",{
                    user:user[0],
                    sub : result
                });   
            })
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/getInternals',(req,res) => {
    
    try {
        
        const code = req.query.sub_code;
        const id = req.user[0].PEN_ID;

        db.query("SELECT SEM,SCHEME FROM SUBJECTS WHERE SUB_CODE = ?",code,function(err,result){
            const sem = result[0].SEM;
            const scheme = result[0].SCHEME;

            db.query("SELECT REGISTER_NO,ROLL_NO,NAME FROM STUDENT_PROFILE WHERE SEMESTER = ? AND SCHEME = ? ORDER BY ROLL_NO",[sem,scheme],function(err,user){
                
                if (user.length > 0){
                    let reg = []
                    for (let i=0;i<user.length;i++){
                        reg.push(user[i].REGISTER_NO);
                    }
                    var string = reg.join(",")

                    sql_first = "SELECT REGISTER_NO,`" + code + "` FROM FIRST_INTERNALS WHERE REGISTER_NO IN (" + string + ")";
                    sql_second = "SELECT REGISTER_NO,`" + code + "` FROM SECOND_INTERNALS WHERE REGISTER_NO IN (" + string + ")";
                    db.query(sql_first,function(err,first){
                        db.query(sql_second,function(err,second){
                            
                            var o = {}
                            var key = 'json object'
                            o[key] = [];

                            for (let i=0;i<user.length;i++){
                                
                                data = {
                                    Register_No     :   user[i].REGISTER_NO,
                                    Name            :   user[i].NAME,
                                    First           :   first[i][code],
                                    Second          :   second[i][code],
                                    Total           :   first[i][code] + second[i][code]
                                }
                                o[key].push(data)
                            }
                            
                            res.send(o[key]);
                        });
                    });
                } else{
                    res.send("")
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
});




router.get('/changePassword',(req,res) =>{
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

module.exports = router;