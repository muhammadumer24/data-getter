const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
 serial_id:{
  unique:true,
  type:Number,
  required:true
 },
 createdAt:{
  type:Date,
  default:Date.now()
 }
})

module.exports = mongoose.model("usersId", userSchema)
