
let jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mysql = require("mysql");
dotenv.config({ path: "./.env" });


const db = mysql.createConnection({
    host        : process.env.DATABASE_HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.DATABASE_PASSWORD,
    database    : process.env.DATABASE
});

let checkStudent = (req,res,next) => {

    const authHeader = req.headers.cookie;

    if (!authHeader){
        return res.status(401).json({error: "You are not signed in"});
    }
    
    let token = authHeader.split('=')[1];
    
    jwt.verify(token,process.env.JWT_SECRET,(err,decode) => {

        if(err){

            return res.status(401).json({error:"You are not signed in"});
        }

        const { id } = decode;
        
        db.query("SELECT * FROM LOGIN_STUD WHERE USER_ID=?;",id,(err,result) => {

            if(err){
                console.log(err);
                return res.status(401).json({error:"User not found"});
            }
            
            req.user = result
            next()

        })

    })

};


// let checkFaculty = (req,res,next) => {

//     const authHeader = req.headers.cookie;

//     if (!authHeader){
//         return res.status(401).json({error: "You are not signed in"});
//     }
    
//     let token = authHeader.split('=')[1];
    
    
//     jwt.verify(token,process.env.JWT_SECRET,(err,decode) => {

//         if(err){
//             return res.status(401).json({error:"You are not signed in"});
//         }

//         //console.log(decode);
//         const { pen } = decode;

        
//         db.query("SELECT * FROM LOGIN_TEACHER WHERE PEN_ID=?;",pen,(err,result) => {

//             if(err){
//                 console.log(err);
//                 return res.status(401).json({error:"User not found"});
//             }
//             req.user = result
//             next()
//         })

//     })

// };


let checkFaculty = (req,res,next) => {

    const authHeader = req.headers.cookie;

    if (!authHeader){
        return res.status(401).json({error: "You are not signed in"});
    }
    
    let token = authHeader.split('=')[1];
    
    
    jwt.verify(token,process.env.JWT_SECRET,(err,decode) => {

        if(err){
            return res.status(401).json({error:"You are not signed in"});
        }

        //console.log(decode);
        const { pen } = decode;

        
        db.query("SELECT * FROM LOGIN_TEACHER WHERE PEN_ID=?;",pen,(err,result) => {

            if(err){
                console.log(err);
                return res.status(401).json({error:"User not found"});
            }
            req.user = result
            next()
        })

    })

};

module.exports = {
    checkStudent: checkStudent,
    checkFaculty: checkFaculty
};