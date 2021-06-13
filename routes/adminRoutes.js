const express = require("express");
const router = express.Router();
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
const fs = require("fs");

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});


// <-------------Main.hbs------------------>

router.get("/dashboard",(req,res) => {
    try {
        const id = (req.user[0].PEN_ID);
        db.query("SELECT * FROM ADMIN WHERE ADMIN_ID = ?",id,function(err,user){
            db.query("SELECT * FROM ADMIN",function(err,admins){
              db.query("SELECT * FROM TEACHER_PROFILE",function(err,teachers){
                  db.query("SELECT * FROM STUDENT_PROFILE",function(err,students){
                      db.query("SELECT COUNT(*) AS REQ_COUNT FROM REQUESTS WHERE STATUS = ?","PENDING",function(err,count){
                        db.query("SELECT T.PEN_ID,T.NAME,R.REQUEST_FOR,R.PURPOSE,R.STATUS,R.FEES_RECEIPT,R.APPLIED_ON FROM TEACHER_PROFILE T,REQUESTS R WHERE T.PEN_ID = R.ID AND R.STATUS = ?","PENDING",function(err,treqP){
                            db.query("SELECT T.PEN_ID,T.NAME,R.REQUEST_FOR,R.PURPOSE,R.STATUS,R.FEES_RECEIPT,R.APPLIED_ON FROM TEACHER_PROFILE T,REQUESTS R WHERE T.PEN_ID = R.ID AND R.STATUS != ?","PENDING",function(err,treqNP){
                                db.query("SELECT T.PEN_ID,T.NAME,R.REQUEST_FOR,R.PURPOSE,R.STATUS,R.FEES_RECEIPT,R.APPLIED_ON FROM TEACHER_PROFILE T,REQUESTS R WHERE T.PEN_ID = R.ID",function(err,treqA){
                                    db.query("SELECT S.REGISTER_NO,S.NAME,R.REQUEST_FOR,R.PURPOSE,R.STATUS,R.FEES_RECEIPT,R.APPLIED_ON FROM STUDENT_PROFILE S,REQUESTS R WHERE S.REGISTER_NO = R.ID AND R.STATUS = ?","PENDING",function(err,sreqP){
                                        db.query("SELECT S.REGISTER_NO,S.NAME,R.REQUEST_FOR,R.PURPOSE,R.STATUS,R.FEES_RECEIPT,R.APPLIED_ON FROM STUDENT_PROFILE S,REQUESTS R WHERE S.REGISTER_NO = R.ID AND R.STATUS != ?","PENDING",function(err,sreqNP){
                                            db.query("SELECT S.REGISTER_NO,S.NAME,R.REQUEST_FOR,R.PURPOSE,R.STATUS,R.FEES_RECEIPT,R.APPLIED_ON FROM STUDENT_PROFILE S,REQUESTS R WHERE S.REGISTER_NO = R.ID",function(err,sreqA){
                                                db.query("SELECT * FROM NEWS_FEED",function(err,news){
                                                    db.query("SELECT * FROM NOTICES",function(err,notice){
                                                        res.render("admin/main",{
                                                            user        :   user[0],
                                                            admins      :   admins,
                                                            teachers    :   teachers,
                                                            students    :   students,
                                                            req_count   :   count[0].REQ_COUNT,
                                                            treqP       :   treqP,
                                                            treqNP      :   treqNP,
                                                            treqA       :   treqA,
                                                            sreqA       :   sreqA,
                                                            sreqNP      :   sreqNP,
                                                            sreqP       :   sreqP,
                                                            notice      :   notice,
                                                            news        :   news     
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                      });
                  });
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});


router.post('/studentCheck',(req,res)=>{
    try {
        const {register_no} = req.body
        db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",register_no,function(err,result){
            if(result.length > 0)
                res.send("Already added");
            else
                res.send("Available")
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/addStudent',(req,res) => {
    try {
        const {reg_no,admn_no,name,gender,dob,address,city,district,state,pincode,semester,phone,email,date_of_joining,scheme} = req.body
        var file = req.files.photo;
        var file_name = file.name;
        if(file.mimetype == "image/jpeg"){
            Path = process.env.ADLTDP
            file.mv(Path + file_name);
            file_path = process.env.VIEWDP + file_name
            let password = process.env.STUDENT
            db.query("INSERT INTO LOGIN_STUD VALUES(?,?);",[reg_no,password],function(err,results){
                db.query("INSERT INTO STUDENT_PROFILE VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",[reg_no,null,admn_no,name,gender,dob,null,null,address,city,district,state,pincode,semester,null,phone,email,date_of_joining,scheme,file_path],function(err,add){
                    db.query("INSERT INTO ATTENDANCE (REGISTER_NO) VALUES (?)",reg_no,function(err,att){
                        db.query("INSERT INTO FIRST_INTERNALS (REGISTER_NO) VALUES (?)",reg_no,function(err,first){
                            db.query("INSERT INTO SECOND_INTERNALS (REGISTER_NO) VALUES (?)",reg_no,function(err,second){
                                db.query("INSERT INTO SEM_RESULTS (REGISTER_NO) VALUES (?)",reg_no,function(err,sem_result){
                                    res.status(200).redirect('/admin/dashboard');
                                });
                            });
                        }); 
                    });
                });
            });
        }
    } catch (error) {
        console.log(error)
    }
});

router.post('/deleteStudent',(req,res) => {
    try{
        const{register_no} = req.body;
        db.query("DELETE FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",register_no,function(err,result){
            db.query("DELETE FROM FIRST_INTERNALS WHERE REGISTER_NO = ?",register_no,function(err,result){
                db.query("DELETE FROM SECOND_INTERNALS WHERE REGISTER_NO = ?",register_no,function(err,result){
                    db.query("DELETE FROM ATTENDANCE WHERE REGISTER_NO = ?",register_no,function(err,result){
                        db.query("DELETE FROM SEM_RESULTS WHERE REGISTER_NO = ?",register_no,function(err,result){
                            db.query("DELETE FROM LOGIN_STUD WHERE USER_ID = ?",register_no,function(err,result){
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.log(error)
    }
});





router.post('/teacherCheck',(req,res) => {
    try {
        const {pen} = req.body
        db.query("SELECT PEN_ID FROM TEACHER_PROFILE WHERE PEN_ID = ?",pen,function(err,result){
            if(result.length > 0)
                res.send("Already added");
            else
                res.send("Available")
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/addTeacher',(req,res) => {
    try {
        const {pen,name,designation,email,phone,date_of_joining,gender,dob,address,city,district,state,pincode} = req.body;
        var file = req.files.photo;
        var file_name = file.name;
        if(file.mimetype == "image/jpeg"){
            Path = process.env.ADLTDP
            file.mv(Path + file_name);
            file_path = process.env.VIEWDP + file_name
            let password = process.env.TEACHER
            db.query("INSERT INTO LOGIN_TEACHER VALUES(?,?)",[pen,password],function(err,results){
                db.query("INSERT INTO TEACHER_PROFILE VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[pen,name,designation,email,phone,date_of_joining,gender,dob,address,city,district,state,pincode,file_path],function(err,add){
                    res.status(200).redirect('/admin/dashboard');
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/deleteTeacher',(req,res) => {
    try {
        const {pen_id} = req.body
        db.query("SELECT PROFILE_PICTURE FROM TEACHER_PROFILE WHERE PEN_ID = ?",pen_id,function(err,picture){
            db.query("DELETE FROM TEACHER_PROFILE WHERE PEN_ID = ?",pen_id,function(err,result){
                db.query("DELETE FROM LOGIN_TEACHER WHERE PEN_ID = ?",pen_id,function(err,result){
                    Path = process.env.ADLTDP + picture[0].PROFILE_PICTURE; 
                    fs.unlinkSync(Path);
                });
            });
        });
    } catch (error) {
        console.log(error)
    }
});


router.post('/adminCheck',(req,res)=>{
    try {
        const {pen} = req.body
        db.query("SELECT PEN_ID FROM ADMIN WHERE PEN_ID = ?",pen,function(err,result){
            if(result.length > 0)
                res.send("Already added");
            else
                res.send("Available")
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/addAdmin',(req,res) => {
    try {
        const {pen,name,email,phone,date_of_joining,gender,dob,address,city,district,state,pincode} = req.body;
        let admin_id = "admin_0" + pen
        var file = req.files.photo;
        var file_name = file.name;
        if(file.mimetype == "image/jpeg"){
            Path = process.env.ADLTDP
            file.mv(Path + file_name);
            file_path = process.env.VIEWDP + file_name
            let password = process.env.TEACHER
            db.query("INSERT INTO LOGIN_TEACHER VALUES(?,?)",[admin_id,password],function(err,results){
                db.query("INSERT INTO ADMIN VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[admin_id,pen,name,dob,gender,email,phone,date_of_joining,address,city,district,state,pincode,file_path],function(err,add){
                    res.status(200).redirect('/admin/dashboard');
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/deleteAdmin',(req,res) => {
    try {
        const {pen_id} = req.body
        admin_id = "admin_0" + pen_id
        db.query("SELECT PROFILE_PICTURE FROM ADMIN WHERE ADMIN_ID = ?",admin_id,function(err,picture){
            db.query("DELETE FROM ADMIN WHERE ADMIN_ID = ?",admin_id,function(err,result){
                db.query("DELETE FROM LOGIN_TEACHER WHERE PEN_ID = ?",admin_id,function(err,result){
                    Path = process.env.ADLTDP + picture[0].PROFILE_PICTURE; 
                    fs.unlinkSync(Path);
                });
            });
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/updateAdmin',(req,res) => {
    try {
        const{name,dob,email,phone,address,city,district,state,pincode,date_of_joining} = req.body
        db.query("UPDATE ADMIN SET NAME = ?,DOB = ?,EMAIL = ?,PHONE = ?,DATE_OF_JOINING = ?,ADDRESS = ?,POST = ?,DISTRICT = ?,STATE = ?,PINCODE = ?",[name,dob,email,phone,date_of_joining,address,city,district,state,pincode],function(err,update){
            res.status(200).redirect('/admin/dashboard')
        })
    } catch (error) {
        console.log(error);
    }
});

router.post('/addNotice',(req,res) => {
    try {
        user = req.user[0].PEN_ID
        const {name} = req.body;
        var file = req.files.attachment;
        var file_name = file.name;
        if(file.mimetype == "application/pdf"){
            Path = process.env.ADDNOTICE
            file.mv(Path + file_name);
            file_path = process.env.UPNOTICE + file_name;
            db.query("INSERT INTO NOTICES VALUES(?,?,NOW(),?,?);",[,name,user,file_path],function(err,notice){
                res.status(200).redirect('/admin/dashboard');
            })
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/addNews',(req,res) => {
    try {
        const {string} = req.body;
        const id = req.user[0].PEN_ID
        console.log(string);

        db.query("INSERT INTO NEWS_FEED VALUES(NOW(),?,?);",[string,id],function(err,news){
            return res.status(200).redirect("/admin/dashboard");
        })
    } catch (error) {
        console.log(error);
    }
});


router.get('/getTeacher',(req,res) => {
    try {
        id = req.query.pen
        db.query("SELECT * FROM TEACHER_PROFILE WHERE PEN_ID = ?",id,function(err,result){
            res.send(result[0]);
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/updateTeacher',(req,res) => {
    try {
        const{select,name,pen_id,dob,doj,gender} = req.body;
        if(select != pen_id){
            db.query("UPDATE LOGIN_TEACHER SET PEN_ID = ? WHERE PEN_ID = ?",[id,select]);
        }
        db.query("UPDATE TEACHER_PROFILE SET PEN_ID = ?,NAME=?,DOB=?,YEAR_OF_JOINING=?,GENDER=? WHERE PEN_ID = ?",[pen_id,name,dob,doj,gender,select],function(err,done){
            res.status(200).redirect('/admin/dashboard');
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/getStudent',(req,res) => {
    try {
        reg = req.query.reg
        db.query("SELECT * FROM STUDENT_PROFILE WHERE REGISTER_NO = ?",reg,function(err,result){
            res.send(result[0]);
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/updateStudent',(req,res) => {
    const {select,name,reg,dob,doa,father,mother,gender} = req.body;
    if(select != reg){
        db.query("UPDATE LOGIN_STUD SET USER_ID = ? WHERE USER_ID = ?",[reg,select]);
        db.query("UPDATE ATTENDANCE SET REGISTER_NO = ? WHERE REGISTER_NO =?",[reg,select]);
        db.query("UPDATE FIRST_INTERNALS SET REGISTER_NO = ? WHERE REGISTER_NO =?",[reg,select]);
        db.query("UPDATE SECOND_INTERNALS SET REGISTER_NO = ? WHERE REGISTER_NO =?",[reg,select]);
        db.query("UPDATE SEM_RESULTS SET REGISTER_NO = ? WHERE REGISTER_NO =?",[reg,select]);
    }

    db.query("UPDATE STUDENT_PROFILE SET NAME = ?, REGISTER_NO = ?,DOB=?,YEAR_OF_JOINING=?,FATHER_NAME=?,MOTHER_NAME=?,GENDER=? WHERE REGISTER_NO = ?",[name,reg,dob,doa,father,mother,gender,select],function(err,done){
        return res.status(200).redirect('/admin/dashboard');
    });
});




//<--------------------studentManagement.hbs---------------------->

router.get('/student',(req,res) =>{
    try {
        const id = req.user[0].PEN_ID
        db.query("SELECT * FROM ADMIN WHERE ADMIN_ID = ?",id,function(err,admin){
            res.render('admin/studentManagement',{
                user    :   admin[0]
            });
        });
    } catch (error) {
     console.log(error)   
    }
});

router.get('/getFirstInternal',(req,res) => {
    try {
        const {branch,scheme,sem,year} = req.query;
        db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE BRANCH = ? AND SCHEME = ? AND EXTRACT(YEAR FROM YEAR_OF_JOINING)=?",[branch,scheme,year],function(err,reg){
            
            reg_no = []
            for(let i=0;i<reg.length;i++){
                reg_no.push(reg[i].REGISTER_NO);
            }
            var string = reg_no.join(",");
            
            db.query("SELECT SUB_CODE FROM SUBJECTS WHERE BRANCH = ? AND SCHEME = ? AND SEM = ?",[branch,scheme,sem],function(err,codes){
                code = []
                for(let i=0;i<codes.length;i++){
                    code.push("`" + codes[i].SUB_CODE + "`");
                }
                
                var str = code.join(",");
                sql = "SELECT REGISTER_NO," + str + " FROM FIRST_INTERNALS WHERE REGISTER_NO IN (" + reg_no + ")";
                db.query(sql,function(err,result){
                    res.send(result);
                })      
            })
        })
    } catch (error) {
        console.log(error);
    }
});

router.get('/getSecondInternal',(req,res) =>{
    try {
        const {branch,scheme,sem,year} = req.query;
        db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE BRANCH = ? AND SCHEME = ? AND EXTRACT(YEAR FROM YEAR_OF_JOINING)=?",[branch,scheme,year],function(err,reg){
            reg_no = []
            for(let i=0;i<reg.length;i++){
                reg_no.push(reg[i].REGISTER_NO);
            }
            var string = reg_no.join(",");
            
            db.query("SELECT SUB_CODE FROM SUBJECTS WHERE BRANCH = ? AND SCHEME = ? AND SEM = ?",[branch,scheme,sem],function(err,codes){
                code = []
                for(let i=0;i<codes.length;i++){
                    code.push("`" + codes[i].SUB_CODE + "`");
                }
                var str = code.join(",");
                
                sql = "SELECT REGISTER_NO," + str + " FROM SECOND_INTERNALS WHERE REGISTER_NO IN (" + reg_no + ")";
                db.query(sql,function(err,result){
                    res.send(result);
                })      
            })
        })
    } catch (error) {
        console.log(error)
    }
});



router.get("/getResult",(req,res) =>{
    
    try {
        const {branch,scheme,semester,year} = req.query;
        db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE BRANCH = ? AND SCHEME = ? AND EXTRACT(YEAR FROM YEAR_OF_JOINING)=?",[branch,scheme,year],function(err,reg){
            reg_no = []
            for(let i=0;i<reg.length;i++){
                reg_no.push(reg[i].REGISTER_NO);
            }
            var string = reg_no.join(",");
            
            db.query("SELECT SUB_CODE FROM SUBJECTS WHERE BRANCH = ? AND SCHEME = ? AND SEM = ?",[branch,scheme,semester],function(err,codes){
                code = []
                for(let i=0;i<codes.length;i++){
                    code.push("`" + codes[i].SUB_CODE + "`");
                }
                var str = code.join(",");

                sql = "SELECT REGISTER_NO," + str + " FROM SEM_RESULTS WHERE REGISTER_NO IN (" + reg_no + ")";
                db.query(sql,function(err,result){
                    res.send(result);
                })      
            })
        })
    } catch (error) {
        console.log(error)
    }
});


router.get("/getAttendance",(req,res) =>{
    
    try {
        const {branch,scheme,semester,year} = req.query;
        db.query("SELECT REGISTER_NO FROM STUDENT_PROFILE WHERE BRANCH = ? AND SCHEME = ? AND EXTRACT(YEAR FROM YEAR_OF_JOINING)=?",[branch,scheme,year],function(err,reg){
            reg_no = []
            for(let i=0;i<reg.length;i++){
                reg_no.push(reg[i].REGISTER_NO);
            }
            var string = reg_no.join(",");
            
            db.query("SELECT SUB_CODE FROM SUBJECTS WHERE BRANCH = ? AND SCHEME = ? AND SEM = ?",[branch,scheme,semester],function(err,codes){
                
                code = []
                for(let i=0;i<codes.length;i++){
                    code.push("`" + codes[i].SUB_CODE + "`");
                }
                var str = code.join(",");
                
                sql = "SELECT REGISTER_NO," + str + " FROM ATTENDANCE WHERE REGISTER_NO IN (" + reg_no + ")";
                db.query(sql,function(err,result){
                    res.send(result);
                })      
            })
        })
    } catch (error) {
        console.log(error)
    }
});


router.get('/getInternships',(req,res) => {
    try {
        const {branch} = req.query;
        db.query("SELECT S.REGISTER_NO,S.NAME,I.COMPANY_NAME,I.FIELD,I.START_DATE,I.END_DATE FROM STUDENT_PROFILE S,INTERNSHIPS I WHERE S.BRANCH = ? AND S.REGISTER_NO = I.REGISTER_NO",branch,function(err,result){
            if(result.length > 0)
                res.send(result);
            else
                res.send("");
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/getCourses',(req,res) => {
    try {
        const {branch} = req.query;
        db.query("SELECT S.REGISTER_NO,S.NAME,C.COURSE_NAME,C.CERTIFICATION_PROVIDER,C.COURSE_STARTS,C.COURSE_ENDS FROM STUDENT_PROFILE S,COURSES C WHERE S.BRANCH = ? AND S.REGISTER_NO = C.REGISTER_NO",branch,function(err,result){
            if(result.length > 0)
                res.send(result);
            else
                res.send("");
        })
    } catch (error) {
        console.log(error)
    }
});


//<-----------------------teacherManagement.hbs------------------------>

router.get('/teacher',(req,res) => {
    try {
        const id = req.user[0].PEN_ID
        db.query("SELECT * FROM ADMIN WHERE ADMIN_ID = ?",id,function(err,admin){
            db.query("SELECT T.name,R.PEN_ID,R.name as course,R.topic,R.date,R.total_days,R.certificate FROM REFRESHERCOURSE R,TEACHER_PROFILE T WHERE TYPE = ? AND R.PEN_ID=T.PEN_ID","Refresher Course",function(err,Refresher){
                db.query("SELECT T.name,R.PEN_ID,R.name as course,R.topic,R.type,R.date,R.total_days FROM REFRESHERCOURSE R,TEACHER_PROFILE T WHERE TYPE != ? AND R.PEN_ID=T.PEN_ID","Refresher Course",function(err,seminar){
                    db.query("SELECT T.name,P.PEN_ID,P.title,P.name as book,P.ISBN,P.year FROM PUBLICATIONS P,TEACHER_PROFILE T WHERE T.PEN_ID=P.PEN_ID",function(err,publication){
                        res.render('admin/teacherManagement',{
                            user        :   admin[0],
                            seminar     :   seminar,
                            courses     :   Refresher,
                            publication :   publication
                        });
                    })
                })
            })
        });
    } catch (error) {
     console.log(error)   
    }
});



router.get('/changePassword',(req,res) =>{
    try {
        const id = req.user[0].PEN_ID
        db.query("SELECT NAME,PROFILE_PICTURE FROM ADMIN WHERE ADMIN_ID = ?",id,function(err,result){
            res.render('Passwords/admin',{
                user    :   result[0]
            })
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;