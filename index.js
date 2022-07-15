// server creation

// import express
const express=require("express")

// import dataservice
const dataService=require('./services/dataservice')

// import cors
const cors = require('cors')

// import jsonwebtoken
const jwt=require('jsonwebtoken')

// server app create using express
const app=express()

// cors use in server app
app.use(cors({
    origin:'http://localhost:4200'
}))
// parse json
app.use(express.json())

// application specific middleware
const appMiddleware=(req,res,next)=>{
    console.log("Application specific middleware");
    next()
}

// use middleware
app.use(appMiddleware)
// bank server

const jwtMiddleware=(req,res,next)=>{
    // fetch token
try{
    token=req.headers['x-access-token']
    // verify token
    const data = jwt.verify(token,'supersecretkey12345')
    console.log(data);
    next()
}
catch{
    res.status(401).json({
        status:false,
        statusCode:401,
        message:'Please Log in'
    })
}
}

// register API
app.post('/register',(req,res)=>{
    // register solving-asynchronous

    dataService.register(req.body.username,req.body.accno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
 })

// login API
app.post('/login',(req,res)=>{
    // login solving-asynchronous
        dataService.login(req.body.acno,req.body.pswd)
        .then(result=>{
            res.status(result.statusCode).json(result)
     })
})

// deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    // login solving-asynchronous
        dataService.deposit(req.body.acno,req.body.password,req.body.amt)
        .then(result=>{
        res.status(result.statusCode).json(result)
     })
  })
  // withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    
       dataService.withdraw(req.body.acno,req.body.password,req.body.amt)
       .then(result=>{
        res.status(result.statusCode).json(result)
     }) 
})  

// transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    
       dataService.getTransaction(req.body.acno)
       .then(result=>{
        res.status(result.statusCode).json(result)
     }) 
})
// user request resolving
// GET REQUEST
app.get('/',(req,res)=>{
    res.send("GET Request")
})

// POST REQUEST
app.post('/',(req,res)=>{
    res.send("POST Request")
})

// PUT REQUEST
app.put('/',(req,res)=>{
    res.send("PUT Request")
})

// PATCH REQUEST
app.patch('/',(req,res)=>{
    res.send("PATCH Request")
})

// DELETE REQUEST
app.delete('/',(req,res)=>{
    res.send("DELETE Request")
})
// set up port number to the server app
app.listen(3000,()=>{
    console.log("server started at 3000");
})