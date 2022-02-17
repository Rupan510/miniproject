//import modules 

const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const jwt = require("jwt-simple");


//create the rest object

let app = express();

//enable the cors policy in server
app.use(cors());

//set the JSON as MIME type 
app.use(express.json()); //the communication language between clint and server is the json.

//create the clint object in our server
let Rupam = mongodb.MongoClient;    //where Rupam is the clint object

let server_token = "" ;

//create the post request
app.post("/login", (req, res)=>{
        Rupam.connect("mongodb+srv://admin:admin@cluster0.y43w3.mongodb.net/miniproject?retryWrites=true&w=majority", (err,connection)=>{

            if(err) throw err;

            else{

                let db = connection.db("miniproject");
                db.collection("login_details").find({"email":req.body.email,"password":req.body.password}).toArray((err,array)=>{

                    if(err) throw err;

                    else{
                        if(array.length>0){

                            //creating the token
                            //token means converting the readable data to unreadable data this is called as token 

                            let token = jwt.encode({"email":req.body.email,"password":req.body.password},"Rupam123");
                            server_token = token;

                            res.send({"login" : "success", "token":token});
                        }

                        else{
                            res.send({"login" : "fail"});
                        }
                    }
                });
                
            }
        })
});

//comparing the Nodejs token with Reactjs token

const middcomp = (req, res, next) => {
    let allHeaders = req.headers;
    let react_token = allHeaders.token;

    if(react_token === server_token){
        next();
    }

    else{
        req.send({"message":"unauthorized user"});
    }

}


//create the Get request

app.get("/products",[middcomp],(req,res)=>{
    Rupam.connect("mongodb+srv://admin:admin@cluster0.y43w3.mongodb.net/miniproject?retryWrites=true&w=majority",(err,connection)=>{
        if(err) throw err;

        else{
            let db = connection.db("miniproject");
            db.collection("products").find().toArray((err, array)=>{
                if(err) throw err;

                else{
                    res.send(array);
                }
            })
        }
    });
});




//assign the port number 
app.listen(8080,()=>{
    console.log("server listening to port number 8080");
});