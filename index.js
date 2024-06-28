//express app
const express = require("express")
const app = express()
//dependencies
const cors = require("cors")
const cp = require("cookie-parser")
require("dotenv").config()
//functions
const cnt = require("./db/connect")
const data = require("./routers/data")
const users = require("./routers/users")

//cors
app.use(cors("*"))
//cookie-parser
app.use(cp())
//making the app configure json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//routes
app.use("/data", data)
app.use('/user',users)
const run =async()=>{
  //connect to database
  await cnt(process.env.db_url)
  //starting the app
  app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
  })
}

run()
